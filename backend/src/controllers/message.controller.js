const Message = require('../models/Message.model');
const Conversation = require('../models/Conversation.model');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * @desc    Send a message (text or attachment)
 * @route   POST /api/messages
 * @access  Private
 */
const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, content, messageType, attachment } = req.body;

    if (!conversationId) {
      return sendError(res, 400, 'Conversation ID is required');
    }

    if (!content && !attachment?.url) {
      return sendError(res, 400, 'Message must contain text or an attachment');
    }

    // Verify conversation exists and user is a participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return sendError(res, 404, 'Conversation not found');
    }

    const isMember = conversation.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return sendError(res, 403, 'You are not a member of this conversation');
    }

    // Create the message
    const newMessage = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      content: content || '',
      messageType: messageType || 'text',
      attachment: attachment || undefined,
      readBy: [{ user: req.user._id, readAt: new Date() }],
    });

    // Update conversation's latestMessage & member unreadCounts
    const updatedMemberMeta = conversation.memberMeta.map((meta) => {
      if (meta.user.toString() === req.user._id.toString()) {
        return { ...meta.toObject(), lastRead: new Date(), unreadCount: 0 };
      }
      return { ...meta.toObject(), unreadCount: (meta.unreadCount || 0) + 1 };
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      latestMessage: newMessage._id,
      memberMeta: updatedMemberMeta,
    });

    const fullMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name email avatar')
      .populate('readBy.user', 'name avatar');

    return sendSuccess(res, 201, 'Message sent', fullMessage);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all messages for a conversation
 * @route   GET /api/messages/:conversationId
 * @access  Private
 */
const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    // Verify user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return sendError(res, 404, 'Conversation not found');
    }

    const isMember = conversation.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return sendError(res, 403, 'You are not authorized to view these messages');
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name email avatar')
      .populate('readBy.user', 'name avatar')
      .sort({ createdAt: 1 });

    return sendSuccess(res, 200, 'Messages fetched', messages);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark all unread messages in a conversation as read
 * @route   PUT /api/messages/:conversationId/read
 * @access  Private
 */
const markMessagesAsRead = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    // Add user to readBy array for any unread message
    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: req.user._id },
        'readBy.user': { $ne: req.user._id },
      },
      {
        $addToSet: {
          readBy: { user: req.user._id, readAt: new Date() },
        },
      }
    );

    // Reset unread count for this user in conversation
    await Conversation.updateOne(
      { _id: conversationId, 'memberMeta.user': req.user._id },
      {
        $set: {
          'memberMeta.$.unreadCount': 0,
          'memberMeta.$.lastRead': new Date(),
        },
      }
    );

    return sendSuccess(res, 200, 'Messages marked as read');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markMessagesAsRead,
};
