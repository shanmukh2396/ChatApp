import React, { useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageComposer from './MessageComposer';
import { FiMessageSquare } from 'react-icons/fi';

const ChatWindow = () => {
  const { activeConversation, messages, loadingMessages } = useChat();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Empty state when no conversation is selected
  if (!activeConversation) {
    return (
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-surface p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-card border border-surface-border flex items-center justify-center text-primary-400 mb-4 shadow-xl">
          <FiMessageSquare className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">No Chat Selected</h2>
        <p className="text-slate-400 text-sm max-w-sm">
          Choose a conversation from the sidebar or start a new chat to begin messaging.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col h-full bg-surface overflow-hidden">
      {/* 1. Header */}
      <ChatHeader />

      {/* 2. Messages List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-1">
        {loadingMessages ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-slate-400 text-sm">
              <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading messages...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center p-6">
            <div className="bg-surface-card/60 border border-surface-border rounded-2xl p-6 max-w-xs text-center">
              <span className="text-3xl mb-2 block">👋</span>
              <h4 className="text-sm font-semibold text-white mb-1">Say Hello!</h4>
              <p className="text-xs text-slate-400">
                This is the start of your message history with{' '}
                {activeConversation.isGroupChat
                  ? activeConversation.name
                  : 'this user'}
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
