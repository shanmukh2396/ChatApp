import React, { useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageComposer from './MessageComposer';
import ConnectHubLogo from '../common/ConnectHubLogo';
import { MessageSquare, Plus } from 'lucide-react';

const ChatWindow = () => {
  const { activeConversation, messages, loadingMessages, setIsSearchOpen } = useChat();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Empty state when no chat is currently selected
  if (!activeConversation) {
    return (
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#071a0f]/60 backdrop-blur-md p-8 text-center select-none">
        <div className="w-20 h-20 rounded-3xl bg-[#0c2417] border border-[#18422b] flex items-center justify-center text-[#10B981] mb-6 shadow-2xl shadow-black/60 relative group">
          <div className="absolute inset-0 bg-[#10B981]/15 rounded-3xl blur-md group-hover:bg-[#10B981]/25 transition-all" />
          <MessageSquare className="w-9 h-9 relative z-10" />
        </div>

        <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
          Select a Conversation
        </h2>
        <p className="text-[#9bb8a8] text-sm max-w-sm leading-relaxed mb-6">
          Choose a chat from the sidebar or start a new conversation to begin messaging on ConnectHub.
        </p>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] text-white font-bold text-sm shadow-lg shadow-[#10B981]/25 transition-all duration-200 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Start New Chat</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col h-full bg-[#071a0f]/75 backdrop-blur-md overflow-hidden">
      {/* 1. Header */}
      <ChatHeader />

      {/* 2. Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-1">
        {loadingMessages ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-[#9bb8a8] text-xs">
              <div className="w-8 h-8 border-3 border-[#10B981] border-t-transparent rounded-full animate-spin" />
              <span>Loading messages...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center p-6">
            <div className="bg-[#0c2417] border border-[#18422b] rounded-3xl p-8 max-w-sm text-center shadow-xl">
              <span className="text-4xl mb-3 block">👋</span>
              <h4 className="text-base font-bold text-white mb-1.5">
                Say Hello!
              </h4>
              <p className="text-xs text-[#9bb8a8] leading-relaxed">
                This is the start of your message history with{' '}
                <span className="text-white font-semibold">
                  {activeConversation.isGroupChat
                    ? activeConversation.name
                    : 'this contact'}
                </span>
                .
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg._id}
              message={msg}
              isGroupChat={activeConversation.isGroupChat}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Composer */}
      <MessageComposer />
    </div>
  );
};

export default ChatWindow;

