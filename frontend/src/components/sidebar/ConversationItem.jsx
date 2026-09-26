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

  const recipient = isGroup
    ? null
    : conversation.participants?.find(
        (p) => p._id !== user?._id && p !== user?._id
      );

  const isOnline = recipient ? onlineUsers.has(recipient._id) : false;

  const myMeta = conversation.memberMeta?.find(
    (m) => m.user === user?._id || m.user?._id === user?._id
  );
  const unreadCount = isSelected ? 0 : myMeta?.unreadCount || 0;

  const activeTyping = typingMap[conversation._id];

  const renderLatestMessage = () => {
    if (activeTyping) {
      return (
        <span className="text-forest dark:text-[#8ba895] font-semibold italic flex items-center gap-1">
          <span>{activeTyping.userName} is typing</span>
          <span className="inline-flex gap-0.5">
            <span className="w-1 h-1 bg-forest dark:bg-[#8ba895] rounded-full animate-bounce"></span>
            <span className="w-1 h-1 bg-forest dark:bg-[#8ba895] rounded-full animate-bounce [animation-delay:0.15s]"></span>
            <span className="w-1 h-1 bg-forest dark:bg-[#8ba895] rounded-full animate-bounce [animation-delay:0.3s]"></span>
          </span>
        </span>
      );
    }

    const latest = conversation.latestMessage;
    if (!latest) {
      return <span className="text-charcoal-50 dark:text-[#8ba895]/70 italic text-[11px]">No messages yet</span>;
    }

    const senderPrefix =
      latest.sender?._id === user?._id || latest.sender === user?._id
        ? 'You: '
        : isGroup && latest.sender?.name
        ? `${latest.sender.name}: `
        : '';

    if (latest.messageType === 'image') {
      return (
        <span className="flex items-center gap-1 text-forest dark:text-[#8ba895]">
          <span>{senderPrefix}</span>
          <Image className="w-3.5 h-3.5" />
          <span>Photo</span>
        </span>
      );
    }

    if (latest.messageType === 'file') {
      return (
        <span className="flex items-center gap-1 text-forest dark:text-[#8ba895]">
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
          ? 'bg-sage-200 dark:bg-[#202f25] border-l-4 border-forest shadow-sm'
          : 'hover:bg-sage-200/70 dark:hover:bg-[#1c2720] hover:translate-x-0.5'
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
              ? 'border-forest/60'
              : 'border-sage-300 dark:border-[#3a5643] group-hover:border-forest/30'
          }`}
        />
        {!isGroup && isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-sage-100 dark:border-[#162019]" />
        )}
      </div>

      {/* ─── Center Details ───────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <h4
            className={`text-sm font-bold truncate transition-colors ${
              unreadCount > 0 || isSelected
                ? 'text-charcoal dark:text-white'
                : 'text-charcoal-100 dark:text-[#E3EBE2]/80 group-hover:text-charcoal dark:group-hover:text-white'
            }`}
          >
            {isGroup ? conversation.name : recipient?.name || 'User'}
          </h4>

          {conversation.latestMessage?.createdAt && (
            <span
              className={`text-[10px] font-semibold shrink-0 ml-2 ${
                unreadCount > 0 ? 'text-forest dark:text-emerald-400' : 'text-charcoal-50 dark:text-[#8ba895]'
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
                ? 'text-charcoal dark:text-white font-semibold'
                : 'text-charcoal-50 dark:text-[#8ba895] group-hover:text-charcoal-100 dark:group-hover:text-[#E3EBE2]'
            }`}
          >
            {renderLatestMessage()}
          </p>

          {unreadCount > 0 && (
            <span className="min-w-[1.25rem] h-5 px-1.5 rounded-full bg-forest text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-sm">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
