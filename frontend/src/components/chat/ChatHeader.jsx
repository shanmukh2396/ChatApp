import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useSocket } from '../../context/SocketContext';
import { formatLastSeen } from '../../utils/formatDate';
import { ArrowLeft, Info, Users, Shield } from 'lucide-react';

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
    <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#202235] bg-[#171827] z-10 shrink-0">
      {/* Left: Mobile Back Button + Avatar + Name & Status */}
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Mobile Back to Conversation List Button */}
        <button
          onClick={() => selectConversation(null)}
          className="md:hidden p-2 rounded-xl text-[#9293A5] hover:text-white hover:bg-[#202235] transition-colors -ml-1.5"
          title="Back to conversations"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Avatar with Presence Indicator */}
        <div className="relative shrink-0">
          <img
            src={
              isGroup
                ? activeConversation.groupAvatar
                : recipient?.avatar || 'https://ui-avatars.com/api/?name=Chat'
            }
            alt={isGroup ? activeConversation.name : recipient?.name}
            className="w-10 h-10 rounded-2xl object-cover border-2 border-[#202235]"
          />
          {!isGroup && isRecipientOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#171827]" />
          )}
        </div>

        {/* Conversation Title & Presence Info */}
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-extrabold text-white truncate tracking-tight">
            {isGroup ? activeConversation.name : recipient?.name || 'Chat'}
          </h3>

          <div className="text-xs truncate">
            {activeTyping ? (
              <span className="text-[#FF8BA2] font-semibold flex items-center gap-1">
                <span>{activeTyping.userName} is typing</span>
                <span className="inline-flex gap-0.5">
                  <span className="w-1 h-1 bg-[#F20D3A] rounded-full animate-bounce"></span>
                  <span className="w-1 h-1 bg-[#F20D3A] rounded-full animate-bounce [animation-delay:0.15s]"></span>
                  <span className="w-1 h-1 bg-[#F20D3A] rounded-full animate-bounce [animation-delay:0.3s]"></span>
                </span>
              </span>
            ) : isGroup ? (
              <span className="text-[#9293A5] flex items-center gap-1 font-medium">
                <Users className="w-3 h-3 text-[#F20D3A]" />
                <span>{activeConversation.participants?.length || 0} members</span>
              </span>
            ) : isRecipientOnline ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Online</span>
              </span>
            ) : (
              <span className="text-[#9293A5]">
                {formatLastSeen(recipient?.lastSeen)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Actions: Group Info Modal Trigger */}
      {isGroup && (
        <button
          onClick={() => setIsGroupDetailsOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#202235] hover:bg-[#2c2f48] text-slate-200 hover:text-white border border-white/5 text-xs font-semibold transition-all duration-200"
          title="Group Details & Members"
        >
          <Info className="w-4 h-4 text-[#F20D3A]" />
          <span className="hidden sm:inline">Group Info</span>
        </button>
      )}
    </div>
  );
};

export default ChatHeader;
