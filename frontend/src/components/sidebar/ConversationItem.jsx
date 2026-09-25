import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useSocket } from '../../context/SocketContext';
import { formatConversationTime } from '../../utils/formatDate';
import { Image, FileText } from 'lucide-react';

const ConversationItem = ({ conversation }) => {
  const { user } = useAuth();
  const { activeConversation, selectConversation, typingMap } = useChat();
  const { onlineUsers } = useSocket();

  const isSelected = activeConversation?._id === conversation._id;
  const isGroup = conversation.isGroupChat;

  // Recipient for 1-on-1 conversation
  const recipient = isGroup
    ? null
    : conversation.participants?.find(
        (p) => p._id !== user?._id && p !== user?._id
      );

  const isOnline = recipient ? onlineUsers.has(recipient._id) : false;

  // Unread count
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
        <span className="text-[#FF8BA2] font-semibold italic flex items-center gap-1">
          <span>{activeTyping.userName} is typing</span>
          <span className="inline-flex gap-0.5">
            <span className="w-1 h-1 bg-[#F20D3A] rounded-full animate-bounce"></span>
            <span className="w-1 h-1 bg-[#F20D3A] rounded-full animate-bounce [animation-delay:0.15s]"></span>
            <span className="w-1 h-1 bg-[#F20D3A] rounded-full animate-bounce [animation-delay:0.3s]"></span>
          </span>
        </span>
      );
    }

    const latest = conversation.latestMessage;
    if (!latest) {
      return <span className="text-[#9293A5] italic text-[11px]">No messages yet</span>;
    }

    const senderPrefix =
      latest.sender?._id === user?._id || latest.sender === user?._id
        ? 'You: '
        : isGroup && latest.sender?.name
        ? `${latest.sender.name}: `
        : '';

    if (latest.messageType === 'image') {
      return (
        <span className="flex items-center gap-1 text-[#FF8BA2]">
          <span>{senderPrefix}</span>
          <Image className="w-3.5 h-3.5" />
          <span>Photo</span>
        </span>
      );
    }

    if (latest.messageType === 'file') {
      return (
        <span className="flex items-center gap-1 text-[#FF8BA2]">
          <span>{senderPrefix}</span>
          <FileText className="w-3.5 h-3.5" />
          <span>Attachment</span>
        </span>
      );
    }

    return `${senderPrefix}${latest.content}`;
  };

  return (
    <div
      onClick={() => selectConversation(conversation)}
      className={`group flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'bg-[#202235] border-l-4 border-[#F20D3A] shadow-md shadow-black/20'
          : 'hover:bg-[#202235]/60 hover:translate-x-0.5'
      }`}
    >
      {/* ─── Avatar with Online Indicator ─────────────────────────────────── */}
      <div className="relative shrink-0">
        <img
          src={
            isGroup
              ? conversation.groupAvatar
              : recipient?.avatar || 'https://ui-avatars.com/api/?name=Chat'
          }
          alt={isGroup ? conversation.name : recipient?.name}
          className={`w-11 h-11 rounded-2xl object-cover border-2 transition-colors ${
            isSelected
              ? 'border-[#F20D3A]/60'
              : 'border-[#202235] group-hover:border-white/10'
          }`}
        />
        {!isGroup && isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#171827]" />
        )}
      </div>

      {/* ─── Center Details ───────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <h4
            className={`text-sm font-bold truncate transition-colors ${
              unreadCount > 0 || isSelected
                ? 'text-white'
                : 'text-slate-200 group-hover:text-white'
            }`}
          >
            {isGroup ? conversation.name : recipient?.name || 'User'}
          </h4>

          {conversation.latestMessage?.createdAt && (
            <span
              className={`text-[10px] font-semibold shrink-0 ml-2 ${
                unreadCount > 0 ? 'text-[#F20D3A]' : 'text-[#9293A5]'
              }`}
            >
              {formatConversationTime(conversation.latestMessage.createdAt)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-xs truncate ${
              unreadCount > 0
                ? 'text-slate-100 font-semibold'
                : 'text-[#9293A5] group-hover:text-slate-300'
            }`}
          >
            {renderLatestMessage()}
          </p>

          {/* Unread Count Badge */}
          {unreadCount > 0 && (
            <span className="min-w-[1.25rem] h-5 px-1.5 rounded-full bg-[#F20D3A] text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-sm shadow-[#F20D3A]/40 animate-pulse">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
