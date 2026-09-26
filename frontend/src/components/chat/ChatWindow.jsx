import React, { useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useSettings } from '../../context/SettingsContext';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageComposer from './MessageComposer';
import { MessageSquare, Plus } from 'lucide-react';

const ChatWindow = () => {
  const { activeConversation, messages, loadingMessages, setIsSearchOpen } = useChat();
  const { getWallpaperForConversation } = useSettings();
  const messagesEndRef = useRef(null);

  const activeWallpaper = getWallpaperForConversation(activeConversation?._id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Empty state when no chat is currently selected
  if (!activeConversation) {
    return (
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-warm-100/70 dark:bg-[#121914]/80 backdrop-blur-md p-8 text-center select-none">
        <div className="w-20 h-20 rounded-3xl bg-sage-200 dark:bg-[#1f2b22] border border-sage-300 dark:border-[#2f4234] flex items-center justify-center text-forest dark:text-[#8ba895] mb-6 shadow-lg relative group">
          <div className="absolute inset-0 bg-forest/5 dark:bg-forest/15 rounded-3xl blur-md group-hover:bg-forest/10 transition-all" />
          <MessageSquare className="w-9 h-9 relative z-10" />
        </div>

        <h2 className="text-2xl font-extrabold text-charcoal dark:text-white mb-2 tracking-tight">
          Select a Conversation
        </h2>
        <p className="text-charcoal-50 dark:text-[#8ba895] text-sm max-w-sm leading-relaxed mb-6">
          Choose a chat from the sidebar or start a new conversation to begin messaging on ConnectHub.
        </p>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-forest hover:bg-forest-600 active:bg-forest-700 text-white font-bold text-sm shadow-md transition-all duration-200 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Start New Chat</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col h-full bg-warm-100/80 dark:bg-[#121914] backdrop-blur-md overflow-hidden transition-colors duration-200">
      {/* 1. Header */}
      <ChatHeader />

      {/* 2. Messages Stream with Active Wallpaper applied */}
      <div
        className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-1 transition-all duration-300 ${activeWallpaper.className}`}
      >
        {loadingMessages ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-charcoal-50 dark:text-[#8ba895] text-xs">
              <div className="w-8 h-8 border-2 border-forest border-t-transparent rounded-full animate-spin" />
              <span>Loading messages...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center p-6">
            <div className="bg-white/90 dark:bg-[#1e2a22]/90 backdrop-blur-md border border-sage-300 dark:border-[#2d3f34] rounded-3xl p-8 max-w-sm text-center shadow-sm">
              <span className="text-4xl mb-3 block">👋</span>
              <h4 className="text-base font-bold text-charcoal dark:text-white mb-1.5">
                Say Hello!
              </h4>
              <p className="text-xs text-charcoal-50 dark:text-[#8ba895] leading-relaxed">
                This is the start of your message history with{' '}
                <span className="text-charcoal dark:text-white font-semibold">
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
