import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useSocket } from '../../context/SocketContext';
import { formatLastSeen } from '../../utils/formatDate';
import { FiArrowLeft, FiInfo, FiUsers } from 'react-icons/fi';

const ChatHeader = () => {
  const { user } = useAuth();
  const {
    activeConversation,
    selectConversation,
    setIsGroupDetailsOpen,
    typingMap,
  } = useChat();
  const { onlineUsers } = useSocket();

  if (!activeConversation) return null;

  const isGroup = activeConversation.isGroupChat;

  // Determine recipient for 1-to-1 conversation
  const recipient = isGroup
    ? null
    : activeConversation.participants?.find(
        (p) => p._id !== user?._id && p !== user?._id
      );

  const isRecipientOnline = recipient ? onlineUsers.has(recipient._id) : false;

  const activeTyping = typingMap[activeConversation._id];

  return (
    <div className="flex items-center justify-between p-3 sm:px-4 border-b border-surface-border bg-surface-card z-10">
      {/* Left: Back button (mobile) + Avatar + Info */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Back to Conversation List Button */}
        <button
          onClick={() => selectConversation(null)}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-surface-input transition-colors -ml-1"
          title="Back to chats"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>

        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={
              isGroup
                ? activeConversation.groupAvatar
                : recipient?.avatar || 'https://ui-avatars.com/api/?name=Chat'
            }
            alt={isGroup ? activeConversation.name : recipient?.name}
            className="w-10 h-10 avatar border border-surface-border"
          />
          {!isGroup && isRecipientOnline && <span className="online-dot" />}
        </div>

        {/* Title and Subtitle */}
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-white truncate">
            {isGroup ? activeConversation.name : recipient?.name || 'Chat'}
          </h3>

          {/* Status / Typing */}
          <div className="text-xs truncate">
            {activeTyping ? (
              <span className="text-primary-400 font-medium flex items-center gap-1">
                <span>{activeTyping.userName} is typing</span>
                <span className="inline-flex gap-0.5">
                  <span className="typing-dot"></span>
                  <span className="typing-dot [animation-delay:0.2s]"></span>
                  <span className="typing-dot [animation-delay:0.4s]"></span>
                </span>
              </span>
            ) : isGroup ? (
              <span className="text-slate-400">
                {activeConversation.participants?.length || 0} members
              </span>
            ) : isRecipientOnline ? (
              <span className="text-emerald-400 font-medium">Online</span>
            ) : (
              <span className="text-slate-400">
                {formatLastSeen(recipient?.lastSeen)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Action: Group Info */}
      {isGroup && (
        <button
          onClick={() => setIsGroupDetailsOpen(true)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-surface-input transition-colors"
          title="Group Info"
        >
          <FiInfo className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ChatHeader;
