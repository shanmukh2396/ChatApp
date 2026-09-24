import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatMessageTime, formatFileSize } from '../../utils/formatDate';
import { FiFile, FiDownload, FiCheck } from 'react-icons/fi';

const MessageBubble = ({ message, isGroupChat }) => {
  const { user } = useAuth();
  const isSelf = message.sender?._id === user?._id || message.sender === user?._id;

  // Check read receipt status for self messages
  const isRead = message.readBy && message.readBy.length > 1;

  return (
    <div
      className={`flex flex-col mb-3 ${
        isSelf ? 'items-end' : 'items-start'
      } animate-fade-in`}
    >
      {/* Sender name in group chats */}
      {isGroupChat && !isSelf && (
        <span className="text-[11px] font-semibold text-primary-400 mb-1 ml-2">
          {message.sender?.name || 'Unknown User'}
        </span>
      )}

      <div
        className={isSelf ? 'msg-bubble-self shadow-md' : 'msg-bubble-other shadow-sm'}
      >
        {/* 1. Image Message */}
        {message.messageType === 'image' && message.attachment?.url && (
          <div className="mb-1.5 overflow-hidden rounded-xl max-w-sm">
            <a
              href={message.attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block cursor-pointer group relative"
            >
              <img
                src={message.attachment.url}
                alt={message.attachment.fileName || 'Attachment'}
                className="w-full max-h-64 object-cover rounded-xl transition-transform duration-200 group-hover:scale-105"
              />
            </a>
          </div>
        )}

        {/* 2. File / Document Message */}
        {message.messageType === 'file' && message.attachment?.url && (
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-black/20 border border-white/10 mb-1.5 min-w-[220px]">
            <div className="p-2.5 rounded-lg bg-primary-500/20 text-primary-300">
              <FiFile className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-white">
                {message.attachment.fileName || 'Document'}
              </p>
              <p className="text-[10px] text-slate-300">
                {formatFileSize(message.attachment.fileSize)}
              </p>
            </div>
            <a
              href={message.attachment.url}
              download={message.attachment.fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <FiDownload className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* 3. Text Message Content */}
        {message.content && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        )}

        {/* Timestamp and Read Status */}
        <div
          className={`flex items-center gap-1 mt-1 text-[10px] ${
            isSelf ? 'text-primary-200 justify-end' : 'text-slate-400 justify-start'
          }`}
        >
          <span>{formatMessageTime(message.createdAt)}</span>

          {isSelf && (
            <span className="inline-flex items-center ml-0.5">
              {isRead ? (
                <span className="flex text-sky-300" title="Seen">
                  <FiCheck className="w-3 h-3 -mr-1.5" />
                  <FiCheck className="w-3 h-3" />
                </span>
              ) : (
                <FiCheck className="w-3 h-3 text-primary-200" title="Delivered" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
