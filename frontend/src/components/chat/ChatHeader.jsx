import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useSocket } from '../../context/SocketContext';
import { useCall } from '../../context/CallContext';
import { formatLastSeen } from '../../utils/formatDate';
import ChatSettingsModal from '../modals/ChatSettingsModal';
import { ArrowLeft, Info, Users, Phone, Video, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

const ChatHeader = () => {
  const { user } = useAuth();
  const {
    activeConversation,
    selectConversation,
    setIsGroupDetailsOpen,
    typingMap,
  } = useChat();
  const { onlineUsers } = useSocket();
  const { startCall, callStatus } = useCall();
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  if (!activeConversation) return null;

  const isGroup = activeConversation.isGroupChat;

  const recipient = isGroup
    ? null
    : activeConversation.participants?.find(
        (p) => p._id !== user?._id && p !== user?._id
      );

  const isRecipientOnline = recipient ? onlineUsers.has(recipient._id) : false;
  const activeTyping = typingMap[activeConversation._id];

  const handleVoiceCall = () => {
    if (isGroup) return;
    if (!recipient) return;
    if (callStatus !== 'idle') {
      return toast.error('You are already on an active call.');
    }
    startCall(recipient, 'voice');
  };

  const handleVideoCall = () => {
    if (isGroup) return;
    if (!recipient) return;
    if (callStatus !== 'idle') {
      return toast.error('You are already on an active call.');
    }
    startCall(recipient, 'video');
  };

  return (
    <>
      <ChatSettingsModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />

      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-sage-300 dark:border-[#2d3f34] bg-white/85 dark:bg-[#18221b]/90 backdrop-blur-sm z-10 shrink-0">
        {/* Left: Mobile Back Button + Avatar + Name & Status */}
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Mobile Back Button */}
          <button
            onClick={() => selectConversation(null)}
            className="md:hidden p-2 rounded-xl text-charcoal-100 dark:text-[#8ba895] hover:text-charcoal dark:hover:text-white hover:bg-sage-200 dark:hover:bg-[#2d3f34] transition-colors -ml-1.5"
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
              className="w-10 h-10 rounded-2xl object-cover border-2 border-sage-300 dark:border-[#3a5643]"
            />
            {!isGroup && isRecipientOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#18221b]" />
            )}
          </div>

          {/* Conversation Title & Presence Info */}
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-extrabold text-charcoal dark:text-white truncate tracking-tight">
              {isGroup ? activeConversation.name : recipient?.name || 'Chat'}
            </h3>

            <div className="text-xs truncate">
              {activeTyping ? (
                <span className="text-forest dark:text-[#8ba895] font-semibold flex items-center gap-1">
                  <span>{activeTyping.userName} is typing</span>
                  <span className="inline-flex gap-0.5">
                    <span className="w-1 h-1 bg-forest dark:bg-[#8ba895] rounded-full animate-bounce"></span>
                    <span className="w-1 h-1 bg-forest dark:bg-[#8ba895] rounded-full animate-bounce [animation-delay:0.15s]"></span>
                    <span className="w-1 h-1 bg-forest dark:bg-[#8ba895] rounded-full animate-bounce [animation-delay:0.3s]"></span>
                  </span>
                </span>
              ) : isGroup ? (
                <span className="text-charcoal-50 dark:text-[#8ba895] flex items-center gap-1 font-medium">
                  <Users className="w-3 h-3 text-forest" />
                  <span>{activeConversation.participants?.length || 0} members</span>
                </span>
              ) : isRecipientOnline ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online</span>
                </span>
              ) : (
                <span className="text-charcoal-50 dark:text-[#8ba895]">
                  {formatLastSeen(recipient?.lastSeen)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Actions: Wallpaper Customizer, Voice Call, Video Call, Group Info */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Per-Chat Wallpaper & Theme Button */}
          <button
            onClick={() => setIsThemeModalOpen(true)}
            title="Customize chat wallpaper"
            className="p-2.5 rounded-xl bg-sage-200/80 dark:bg-[#223027] hover:bg-forest hover:text-white dark:hover:bg-forest text-charcoal-100 dark:text-[#8ba895] border border-sage-300 dark:border-[#3a5643] transition-all duration-200 active:scale-95"
          >
            <Palette className="w-4 h-4" />
          </button>

          {!isGroup && recipient && (
            <>
              <button
                onClick={handleVoiceCall}
                title={`Start voice call with ${recipient.name}`}
                className="p-2.5 rounded-xl bg-sage-200/80 dark:bg-[#223027] hover:bg-forest hover:text-white dark:hover:bg-forest text-charcoal-100 dark:text-[#8ba895] border border-sage-300 dark:border-[#3a5643] transition-all duration-200 active:scale-95"
              >
                <Phone className="w-4 h-4" />
              </button>

              <button
                onClick={handleVideoCall}
                title={`Start video call with ${recipient.name}`}
                className="p-2.5 rounded-xl bg-sage-200/80 dark:bg-[#223027] hover:bg-forest hover:text-white dark:hover:bg-forest text-charcoal-100 dark:text-[#8ba895] border border-sage-300 dark:border-[#3a5643] transition-all duration-200 active:scale-95"
              >
                <Video className="w-4 h-4" />
              </button>
            </>
          )}

          {isGroup && (
            <button
              onClick={() => setIsGroupDetailsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sage-200/80 dark:bg-[#223027] hover:bg-sage-300 dark:hover:bg-[#2d3f34] text-charcoal dark:text-white border border-sage-300 dark:border-[#3a5643] text-xs font-semibold transition-all duration-200"
              title="Group Details & Members"
            >
              <Info className="w-4 h-4 text-forest" />
              <span className="hidden sm:inline">Group Info</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatHeader;
