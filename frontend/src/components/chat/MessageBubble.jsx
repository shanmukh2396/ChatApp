import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { formatMessageTime, formatFileSize } from '../../utils/formatDate';
import { linkifyText } from '../../utils/linkify';
import { FileText, Download, Check, CheckCheck, Eye, Image as ImageIcon } from 'lucide-react';

const MessageBubble = ({ message, isGroupChat }) => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [manualImageLoad, setManualImageLoad] = useState(false);

  const isSelf = message.sender?._id === user?._id || message.sender === user?._id;
  const isRead = message.readBy && message.readBy.length > 1;

  // Auto download preference check
  const shouldRenderImage = settings.mediaAutoDownload !== false || manualImageLoad;

  return (
    <div
      className={`flex flex-col mb-3.5 ${
        isSelf ? 'items-end' : 'items-start'
      } animate-fade-in group`}
    >
      {/* Sender name in group chats */}
      {isGroupChat && !isSelf && (
        <span className="text-[11px] font-bold text-forest dark:text-[#8ba895] mb-1 ml-2">
          {message.sender?.name || 'User'}
        </span>
      )}

      <div
        className={`relative transition-all duration-150 ${
          isSelf
            ? 'bg-mint dark:bg-[#20402b] text-charcoal dark:text-[#f4f6f2] rounded-2xl rounded-br-sm px-4 py-2.5 max-w-xs sm:max-w-sm lg:max-w-md shadow-sm border border-transparent dark:border-[#2f5e3f]'
            : 'bg-white dark:bg-[#1e2a22] text-charcoal dark:text-[#f4f6f2] rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-xs sm:max-w-sm lg:max-w-md border border-sage-300 dark:border-[#2d3f34] shadow-sm'
        }`}
      >
        {/* 1. Image Attachment */}
        {message.messageType === 'image' && message.attachment?.url && (
          <div className="mb-2 overflow-hidden rounded-xl max-w-sm">
            {shouldRenderImage ? (
              <a
                href={message.attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block cursor-pointer relative group/img overflow-hidden rounded-xl"
              >
                <img
                  src={message.attachment.url}
                  alt={message.attachment.fileName || 'Attachment'}
                  loading="lazy"
                  className="w-full max-h-80 object-cover rounded-xl transition-transform duration-200 group-hover/img:scale-105"
                />
              </a>
            ) : (
              <button
                type="button"
                onClick={() => setManualImageLoad(true)}
                className="w-full p-4 rounded-xl bg-sage-100 dark:bg-[#223027] border border-sage-300 dark:border-[#3a5643] flex items-center justify-center gap-2 text-xs font-bold text-forest dark:text-[#8ba895] hover:bg-sage-200 transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Click to load image ({formatFileSize(message.attachment.fileSize)})</span>
              </button>
            )}
          </div>
        )}

        {/* 2. File Attachment */}
        {message.messageType === 'file' && message.attachment?.url && (
          <div
            className={`flex items-center gap-3 p-2.5 rounded-xl mb-2 min-w-[220px] ${
              isSelf
                ? 'bg-forest/10 dark:bg-forest/20 border border-forest/20 dark:border-forest/30'
                : 'bg-sage-100 dark:bg-[#223027] border border-sage-300 dark:border-[#3a5643]'
            }`}
          >
            <div
              className={`p-2.5 rounded-xl ${
                isSelf ? 'bg-forest/20 text-forest dark:text-[#8ba895]' : 'bg-sage-200 dark:bg-[#2b3d32] text-forest dark:text-[#8ba895]'
              }`}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-charcoal dark:text-white">
                {message.attachment.fileName || 'Attachment'}
              </p>
              <p
                className={`text-[10px] ${
                  isSelf ? 'text-charcoal/70 dark:text-[#8ba895]' : 'text-charcoal-50 dark:text-[#8ba895]'
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
              className="p-2 rounded-xl bg-forest/10 hover:bg-forest/20 dark:bg-forest/30 text-forest dark:text-white transition-colors"
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* 3. Message Text Content with Auto Link Detection */}
        {message.content && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words font-medium select-text">
            {linkifyText(message.content, { isSelf })}
          </p>
        )}

        {/* 4. Timestamp & Read Checkmarks */}
        <div
          className={`flex items-center gap-1.5 mt-1 text-[10px] font-semibold select-none ${
            isSelf ? 'text-charcoal/60 dark:text-[#8ba895] justify-end' : 'text-charcoal-50 dark:text-[#8ba895] justify-start'
          }`}
        >
          <span>{formatMessageTime(message.createdAt)}</span>

          {isSelf && (
            <span className="inline-flex items-center">
              {isRead ? (
                <CheckCheck className="w-3.5 h-3.5 text-forest dark:text-emerald-400" title="Seen" />
              ) : (
                <Check className="w-3.5 h-3.5 text-charcoal/40 dark:text-[#8ba895]/60" title="Sent" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
