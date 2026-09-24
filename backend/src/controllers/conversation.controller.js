const Conversation = require('../models/Conversation.model');
const User = require('../models/User.model');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * @desc    Get all conversations for the logged in user
 * @route   GET /api/conversations
 * @access  Private
 */
const getUserConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: { $in: [req.user._id] },
    })
      .populate('participants', '-password')
      .populate('groupAdmin', '-password')
      .populate({
        path: 'latestMessage',
        populate: {
          path: 'sender',
          select: 'name avatar email',
        },
      })
      .sort({ updatedAt: -1 });

    return sendSuccess(res, 200, 'Conversations fetched', conversations);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Access or create a 1-to-1 conversation
 * @route   POST /api/conversations
 * @access  Private
 */
const accessOrCreatePrivateConversation = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return sendError(res, 400, 'Recipient userId is required');
    }

    if (userId.toString() === req.user._id.toString()) {
      return sendError(res, 400, 'You cannot start a chat with yourself');
    }

    // Check if conversation already exists
    let isChat = await Conversation.find({
      isGroupChat: false,
      $and: [
        { participants: { $elemMatch: { $eq: req.user._id } } },
        { participants: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate('participants', '-password')
      .populate({
        path: 'latestMessage',
        populate: {
          path: 'sender',
          select: 'name avatar email',
        },
      });

    if (isChat.length > 0) {
      return sendSuccess(res, 200, 'Conversation fetched', isChat[0]);
    }

    // Create new conversation
    const chatData = {
      isGroupChat: false,
      participants: [req.user._id, userId],
      memberMeta: [
        { user: req.user._id, lastRead: new Date(), unreadCount: 0 },
        { user: userId, lastRead: new Date(), unreadCount: 0 },
      ],
    };

    const createdChat = await Conversation.create(chatData);
    const fullChat = await Conversation.findById(createdChat._id).populate(
      'participants',
      '-password'
    );

    return sendSuccess(res, 201, 'Conversation created', fullChat);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new group chat
 * @route   POST /api/conversations/group
 * @access  Private
 */
const createGroupChat = async (req, res, next) => {
  try {
    const { name, members } = req.body;

    if (!name || !members) {
      return sendError(res, 400, 'Group name and members list are required');
    }

    let parsedMembers = typeof members === 'string' ? JSON.parse(members) : members;

    if (parsedMembers.length < 1) {
      return sendError(res, 400, 'Please select at least 1 member for the group');
    }

    // Add current user to group participants
    const allParticipants = [...new Set([...parsedMembers, req.user._id.toString()])];

    const memberMeta = allParticipants.map((id) => ({
      user: id,
      lastRead: new Date(),
      unreadCount: 0,
    }));

    const groupAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=4f46e5&color=fff&bold=true`;

    const groupChat = await Conversation.create({
      name: name.trim(),
      isGroupChat: true,
      groupAvatar,
      participants: allParticipants,
      groupAdmin: req.user._id,
      memberMeta,
    });

    const fullGroupChat = await Conversation.findById(groupChat._id)
      .populate('participants', '-password')
      .populate('groupAdmin', '-password');

    return sendSuccess(res, 201, 'Group chat created', fullGroupChat);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Rename a group chat
 * @route   PUT /api/conversations/group/:id/rename
 * @access  Private (Admin or Member)
 */
const renameGroup = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return sendError(res, 400, 'Group name cannot be empty');
    }

    const updatedGroup = await Conversation.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        groupAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name.trim()
        )}&background=4f46e5&color=fff&bold=true`,
      },
      { new: true }
    )
      .populate('participants', '-password')
      .populate('groupAdmin', '-password');

    if (!updatedGroup) {
      return sendError(res, 404, 'Group not found');
    }

    return sendSuccess(res, 200, 'Group renamed successfully', updatedGroup);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add member to group
 * @route   PUT /api/conversations/group/:id/add
 * @access  Private (Admin only)
 */
const addToGroup = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return sendError(res, 404, 'Group not found');
    }

    if (conversation.groupAdmin.toString() !== req.user._id.toString()) {
      return sendError(res, 403, 'Only the group admin can add members');
    }

    if (conversation.participants.includes(userId)) {
      return sendError(res, 400, 'User is already a member of this group');
    }

    const updatedGroup = await Conversation.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          participants: userId,
          memberMeta: { user: userId, lastRead: new Date(), unreadCount: 0 },
        },
      },
      { new: true }
    )
      .populate('participants', '-password')
      .populate('groupAdmin', '-password');

    return sendSuccess(res, 200, 'Member added to group', updatedGroup);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove member from group
 * @route   PUT /api/conversations/group/:id/remove
 * @access  Private (Admin only)
 */
const removeFromGroup = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return sendError(res, 404, 'Group not found');
    }

    if (conversation.groupAdmin.toString() !== req.user._id.toString()) {
      return sendError(res, 403, 'Only the group admin can remove members');
    }

    const updatedGroup = await Conversation.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          participants: userId,
          memberMeta: { user: userId },
        },
      },
      { new: true }
    )
      .populate('participants', '-password')
      .populate('groupAdmin', '-password');

    return sendSuccess(res, 200, 'Member removed from group', updatedGroup);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Leave a group
 * @route   PUT /api/conversations/group/:id/leave
 * @access  Private
 */
const leaveGroup = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return sendError(res, 404, 'Group not found');
    }

    const remainingParticipants = conversation.participants.filter(
      (p) => p.toString() !== req.user._id.toString()
    );

    // If group is now empty, delete it
    if (remainingParticipants.length === 0) {
      await Conversation.findByIdAndDelete(req.params.id);
      return sendSuccess(res, 200, 'Group deleted as all members left');
    }

    // If leaving user was admin, assign admin to the next participant
    let newAdmin = conversation.groupAdmin;
    if (conversation.groupAdmin.toString() === req.user._id.toString()) {
      newAdmin = remainingParticipants[0];
    }

    const updatedGroup = await Conversation.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          participants: req.user._id,
          memberMeta: { user: req.user._id },
        },
        groupAdmin: newAdmin,
      },
      { new: true }
    )
      .populate('participants', '-password')
      .populate('groupAdmin', '-password');

    return sendSuccess(res, 200, 'You left the group', updatedGroup);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserConversations,
  accessOrCreatePrivateConversation,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  leaveGroup,
};
