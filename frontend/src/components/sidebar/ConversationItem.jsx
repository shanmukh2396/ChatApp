import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useSocket } from '../../context/SocketContext';
import { formatConversationTime } from '../../utils/formatDate';
import { FiImage, FiFile } from 'react-icons/fi';

const ConversationItem = ({ conversation }) => {
  const { user } = useAuth();
  const { activeConversation, selectConversation, typingMap } = useChat();
  const { onlineUsers } = useSocket();

  const isSelected = activeConversation?._id === conversation._id;
  const isGroup = conversation.isGroupChat;

  // Determine recipient for 1-to-1 conversation
  const recipient = isGroup
    ? null
    : conversation.participants?.find(
        (p) => p._id !== user?._id && p !== user?._id
      );

  const isOnline = recipient ? onlineUsers.has(recipient._id) : false;

  // Get current user's unread count
  const myMeta = conversation.memberMeta?.find(
    (m) => m.user === user?._id || m.user?._id === user?._id
  );
  const unreadCount = isSelected ? 0 : myMeta?.unreadCount || 0;

  // Typing status
  const activeTyping = typingMap[conversation._id];

  // Latest message preview text
  const renderLatestMessage = () => {
    if (activeTyping) {
      return (
        <span className="text-primary-400 font-medium italic">
          {activeTyping.userName} is typing...
        </span>
      );
    }

    const latest = conversation.latestMessage;
    if (!latest) {
      return <span className="text-slate-500 italic">No messages yet</span>;
    }

    const senderPrefix =
      latest.sender?._id === user?._id || latest.sender === user?._id
        ? 'You: '
        : isGroup && latest.sender?.name
        ? `${latest.sender.name}: `
        : '';

    if (latest.messageType === 'image') {
      return (
        <span className="flex items-center gap-1">
          <span>{senderPrefix}</span>
          <FiImage className="w-3.5 h-3.5 text-primary-400" />
          <span>Photo</span>
        </span>
      );
    }

    if (latest.messageType === 'file') {
      return (
        <span className="flex items-center gap-1">
          <span>{senderPrefix}</span>
          <FiFile className="w-3.5 h-3.5 text-primary-400" />
          <span>Document</span>
        </span>
      );
    }

    return `${senderPrefix}${latest.content}`;
  };

  return (
    <div
      onClick={() => selectConversation(conversation)}
      className={`conv-item ${
        isSelected ? 'active border-l-4 border-primary-500' : ''
      }`}
    >
      {/* Avatar with presence */}
      <div className="relative shrink-0">
        <img
          src={
            isGroup
              ? conversation.groupAvatar
              : recipient?.avatar || 'https://ui-avatars.com/api/?name=Chat'
          }
          alt={isGroup ? conversation.name : recipient?.name}
          className="w-12 h-12 avatar border border-surface-border"
        />
        {!isGroup && isOnline && <span className="online-dot" />}
      </div>

      {/* Center Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4
            className={`text-sm font-semibold truncate ${
              unreadCount > 0 ? 'text-white' : 'text-slate-200'
            }`}
          >
            {isGroup ? conversation.name : recipient?.name || 'User'}
          </h4>

          {conversation.latestMessage?.createdAt && (
            <span
              className={`text-[10px] ${
                unreadCount > 0 ? 'text-primary-400 font-bold' : 'text-slate-400'
              }`}
            >
              {formatConversationTime(conversation.latestMessage.createdAt)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-xs truncate ${
              unreadCount > 0 ? 'text-slate-200 font-medium' : 'text-slate-400'
            }`}
          >
            {renderLatestMessage()}
          </p>

          {/* Unread Count Badge */}
          {unreadCount > 0 && <span className="badge shrink-0">{unreadCount}</span>}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
