import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useSocket } from '../../context/SocketContext';
import { useCall } from '../../context/CallContext';
import { formatLastSeen } from '../../utils/formatDate';
import { ArrowLeft, Info, Users, Phone, Video } from 'lucide-react';
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
    <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#204e35] bg-[#0f2d1c] z-10 shrink-0">
      {/* Left: Mobile Back Button + Avatar + Name & Status */}
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Mobile Back to Conversation List Button */}
        <button
          onClick={() => selectConversation(null)}
          className="md:hidden p-2 rounded-xl text-[#9bb8a8] hover:text-white hover:bg-[#18422b] transition-colors -ml-1.5"
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
            className="w-10 h-10 rounded-2xl object-cover border-2 border-[#204e35]"
          />
          {!isGroup && isRecipientOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0f2d1c]" />
          )}
        </div>

        {/* Conversation Title & Presence Info */}
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-extrabold text-white truncate tracking-tight">
            {isGroup ? activeConversation.name : recipient?.name || 'Chat'}
          </h3>

          <div className="text-xs truncate">
            {activeTyping ? (
              <span className="text-[#6ee7b7] font-semibold flex items-center gap-1">
                <span>{activeTyping.userName} is typing</span>
                <span className="inline-flex gap-0.5">
                  <span className="w-1 h-1 bg-[#10B981] rounded-full animate-bounce"></span>
                  <span className="w-1 h-1 bg-[#10B981] rounded-full animate-bounce [animation-delay:0.15s]"></span>
                  <span className="w-1 h-1 bg-[#10B981] rounded-full animate-bounce [animation-delay:0.3s]"></span>
                </span>
              </span>
            ) : isGroup ? (
              <span className="text-[#9bb8a8] flex items-center gap-1 font-medium">
                <Users className="w-3 h-3 text-[#10B981]" />
                <span>{activeConversation.participants?.length || 0} members</span>
              </span>
            ) : isRecipientOnline ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Online</span>
              </span>
            ) : (
              <span className="text-[#9bb8a8]">
                {formatLastSeen(recipient?.lastSeen)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Actions: Voice Call, Video Call, Group Info */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {!isGroup && recipient && (
          <>
            {/* Voice Call Button */}
            <button
              onClick={handleVoiceCall}
              title={`Start voice call with ${recipient.name}`}
              className="p-2.5 rounded-xl bg-[#18422b] hover:bg-[#10B981] text-[#9bb8a8] hover:text-white border border-[#204e35] transition-all duration-200 active:scale-95"
            >
              <Phone className="w-4 h-4" />
            </button>

            {/* Video Call Button */}
            <button
              onClick={handleVideoCall}
              title={`Start video call with ${recipient.name}`}
              className="p-2.5 rounded-xl bg-[#18422b] hover:bg-[#10B981] text-[#9bb8a8] hover:text-white border border-[#204e35] transition-all duration-200 active:scale-95"
            >
              <Video className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Group Info Modal Trigger */}
        {isGroup && (
          <button
            onClick={() => setIsGroupDetailsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#18422b] hover:bg-[#255c3e] text-slate-200 hover:text-white border border-white/5 text-xs font-semibold transition-all duration-200"
            title="Group Details & Members"
          >
            <Info className="w-4 h-4 text-[#10B981]" />
            <span className="hidden sm:inline">Group Info</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
