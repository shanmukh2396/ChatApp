import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import ConversationItem from './ConversationItem';
import {
  FiPlus,
  FiUsers,
  FiSearch,
  FiLogOut,
  FiUser,
  FiMessageSquare,
} from 'react-icons/fi';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const {
    conversations,
    loadingConversations,
    setIsSearchOpen,
    setIsCreateGroupOpen,
  } = useChat();
  const navigate = useNavigate();

  const [filterQuery, setFilterQuery] = useState('');

  // Filter conversations locally in search bar
  const filteredConversations = conversations.filter((c) => {
    if (!filterQuery) return true;
    const name = c.isGroupChat
      ? c.name
      : c.participants?.find((p) => p._id !== user?._id)?.name;
    return name?.toLowerCase().includes(filterQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full w-full md:w-80 lg:w-96 bg-surface-card border-r border-surface-border">
      {/* 1. Header: Current User profile + actions */}
      <div className="p-4 border-b border-surface-border flex items-center justify-between">
        <div
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 cursor-pointer group"
          title="Edit Profile"
        >
          <div className="relative">
            <img
              src={user?.avatar || 'https://ui-avatars.com/api/?name=User'}
              alt={user?.name}
              className="w-10 h-10 avatar border border-surface-border group-hover:ring-2 ring-primary-500 transition-all"
            />
            <span className="online-dot" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white truncate group-hover:text-primary-400 transition-colors">
              {user?.name}
            </h3>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCreateGroupOpen(true)}
            title="Create Group"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-surface-input transition-colors"
          >
            <FiUsers className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsSearchOpen(true)}
            title="New Chat"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-surface-input transition-colors"
          >
            <FiPlus className="w-5 h-5" />
          </button>
          <button
            onClick={logout}
            title="Logout"
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Filter Search Bar */}
      <div className="p-3 border-b border-surface-border">
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="input pl-10 py-2 text-xs"
          />
        </div>
      </div>

      {/* 3. Conversation List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {loadingConversations ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading conversations...</span>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs px-4">
            {filterQuery ? (
              'No conversations match your search'
            ) : (
              <div className="space-y-3">
                <FiMessageSquare className="w-8 h-8 mx-auto text-slate-500" />
                <p>No active conversations yet.</p>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="btn-primary text-xs py-2 px-3"
                >
                  Start a Conversation
                </button>
              </div>
            )}
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <ConversationItem key={conv._id} conversation={conv} />
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
