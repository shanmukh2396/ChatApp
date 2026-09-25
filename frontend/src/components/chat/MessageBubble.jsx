import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatMessageTime, formatFileSize } from '../../utils/formatDate';
import { FileText, Download, Check, CheckCheck } from 'lucide-react';

const MessageBubble = ({ message, isGroupChat }) => {
  const { user } = useAuth();
  const isSelf = message.sender?._id === user?._id || message.sender === user?._id;

  // Read receipt status
  const isRead = message.readBy && message.readBy.length > 1;

  return (
    <div
      className={`flex flex-col mb-3 ${
        isSelf ? 'items-end' : 'items-start'
      } animate-fade-in group`}
    >
      {/* Sender name in group chats */}
      {isGroupChat && !isSelf && (
        <span className="text-[11px] font-bold text-[#6ee7b7] mb-1 ml-2">
          {message.sender?.name || 'User'}
        </span>
      )}

      <div
        className={`relative transition-all duration-150 ${
          isSelf
            ? 'bg-[#059669] text-white rounded-2xl rounded-br-xs px-4 py-2.5 max-w-xs sm:max-w-sm lg:max-w-md shadow-md shadow-[#059669]/20'
            : 'bg-[#18422b] text-slate-100 rounded-2xl rounded-bl-xs px-4 py-2.5 max-w-xs sm:max-w-sm lg:max-w-md border border-white/5 shadow-sm'
        }`}
      >
        {/* 1. Image Attachment */}
        {message.messageType === 'image' && message.attachment?.url && (
          <div className="mb-1.5 overflow-hidden rounded-xl max-w-sm">
            <a
              href={message.attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block cursor-pointer relative group/img"
            >
              <img
                src={message.attachment.url}
                alt={message.attachment.fileName || 'Attachment'}
                className="w-full max-h-72 object-cover rounded-xl transition-transform duration-200 group-hover/img:scale-105"
              />
            </a>
          </div>
        )}

        {/* 2. File Attachment */}
        {message.messageType === 'file' && message.attachment?.url && (
          <div
            className={`flex items-center gap-3 p-2.5 rounded-xl mb-1.5 min-w-[220px] ${
              isSelf
                ? 'bg-black/20 border border-white/10'
                : 'bg-[#0c2417] border border-white/5'
            }`}
          >
            <div
              className={`p-2.5 rounded-xl ${
                isSelf ? 'bg-white/20 text-white' : 'bg-[#10B981]/20 text-[#6ee7b7]'
              }`}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-white">
                {message.attachment.fileName || 'Attachment'}
              </p>
              <p
                className={`text-[10px] ${
                  isSelf ? 'text-white/80' : 'text-[#9bb8a8]'
                }`}
              >
                {formatFileSize(message.attachment.fileSize)}
              </p>
            </div>
            <a
              href={message.attachment.url}
              download={message.attachment.fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* 3. Message Text Content */}
        {message.content && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words font-medium">
            {message.content}
          </p>
        )}

        {/* 4. Timestamp & Read Checkmarks */}
        <div
          className={`flex items-center gap-1.5 mt-1 text-[10px] font-semibold select-none ${
            isSelf ? 'text-white/80 justify-end' : 'text-[#9bb8a8] justify-start'
          }`}
        >
          <span>{formatMessageTime(message.createdAt)}</span>

          {isSelf && (
            <span className="inline-flex items-center">
              {isRead ? (
                <CheckCheck className="w-3.5 h-3.5 text-emerald-200" title="Seen" />
              ) : (
                <Check className="w-3.5 h-3.5 text-emerald-100/70" title="Sent" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
