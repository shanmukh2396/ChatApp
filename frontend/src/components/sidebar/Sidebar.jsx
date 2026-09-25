import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import ConversationItem from './ConversationItem';
import ConnectHubLogo from '../common/ConnectHubLogo';
import {
  Search,
  Plus,
  Users,
  MessageSquare,
  Sparkles,
  LogOut,
  UserPlus,
  SlidersHorizontal,
} from 'lucide-react';

const Sidebar = ({ filterTab = 'all', setFilterTab }) => {
  const { user, logout } = useAuth();
  const {
    conversations,
    loadingConversations,
    setIsSearchOpen,
    setIsCreateGroupOpen,
  } = useChat();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [internalTab, setInternalTab] = useState('all');

  const activeTab = setFilterTab ? filterTab : internalTab;
  const setActiveTab = setFilterTab || setInternalTab;

  // Filter conversations based on search query and active tab
  const filteredConversations = conversations.filter((c) => {
    if (activeTab === 'groups' && !c.isGroupChat) return false;
    if (activeTab === 'unread') {
      const myMeta = c.memberMeta?.find(
        (m) => m.user === user?._id || m.user?._id === user?._id
      );
      if (!myMeta || myMeta.unreadCount <= 0) return false;
    }
    if (!searchQuery.trim()) return true;
    const name = c.isGroupChat
      ? c.name
      : c.participants?.find((p) => p._id !== user?._id)?.name;
    return name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const unreadCount = conversations.reduce((acc, conv) => {
    const myMeta = conv.memberMeta?.find(
      (m) => m.user === user?._id || m.user?._id === user?._id
    );
    return acc + (myMeta?.unreadCount > 0 ? 1 : 0);
  }, 0);

  const groupCount = conversations.filter((c) => c.isGroupChat).length;

  return (
    <div className="flex flex-col h-full w-full md:w-80 lg:w-96 bg-sage-100/90 backdrop-blur-xl border-r border-sage-300 shrink-0 select-none">
      {/* ─── Top Header ──────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 border-b border-sage-300 flex items-center justify-between bg-white/50">
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <ConnectHubLogo size="sm" variant="light" showCHMark={true} />
          </div>
          <div className="hidden md:block">
            <h2 className="text-xl font-extrabold text-charcoal tracking-tight flex items-center gap-2">
              <span>Messages</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-forest/10 text-forest border border-forest/20 font-bold">
                {conversations.length}
              </span>
            </h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(true)}
            title="Start New Chat"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-forest hover:bg-forest-600 active:bg-forest-700 text-white text-xs font-bold shadow-sm transition-all duration-200 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          {/* Mobile Profile & Logout */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={() => navigate('/profile')}
              title="Profile"
              className="p-2 rounded-xl text-charcoal-100 hover:text-charcoal hover:bg-sage-200"
            >
              <img
                src={user?.avatar || 'https://ui-avatars.com/api/?name=User'}
                alt={user?.name}
                className="w-7 h-7 rounded-full object-cover border-2 border-sage-300"
              />
            </button>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-xl text-charcoal-100 hover:text-red-500"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Search Bar ──────────────────────────────────────────────────── */}
      <div className="px-4 py-3 border-b border-sage-300 bg-white/30">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-50 w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations or contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-charcoal placeholder-charcoal-50 border border-sage-300 rounded-xl pl-10 pr-4 py-2.5 text-xs transition-all duration-200 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
          />
        </div>
      </div>

      {/* ─── Filter Tabs ─────────────────────────────────────────────────── */}
      <div className="px-4 py-2.5 border-b border-sage-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-white/20">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 ${
            activeTab === 'all'
              ? 'bg-forest text-white shadow-sm'
              : 'text-charcoal-100 hover:text-charcoal hover:bg-sage-200'
          }`}
        >
          All Chats ({conversations.length})
        </button>

        <button
          onClick={() => setActiveTab('unread')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
            activeTab === 'unread'
              ? 'bg-forest text-white shadow-sm'
              : 'text-charcoal-100 hover:text-charcoal hover:bg-sage-200'
          }`}
        >
          <span>Unread</span>
          {unreadCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-forest text-white text-[10px] font-black flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('groups')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
            activeTab === 'groups'
              ? 'bg-forest text-white shadow-sm'
              : 'text-charcoal-100 hover:text-charcoal hover:bg-sage-200'
          }`}
        >
          <span>Groups</span>
          <span className="text-[10px] opacity-70">({groupCount})</span>
        </button>
      </div>

      {/* ─── Conversation List ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
        {loadingConversations ? (
          <div className="py-16 flex flex-col items-center justify-center text-charcoal-50 text-xs gap-3">
            <div className="w-7 h-7 border-2 border-forest border-t-transparent rounded-full animate-spin" />
            <span>Loading conversations...</span>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="py-16 text-center text-charcoal-50 text-xs px-4">
            {searchQuery ? (
              <p>No conversations matching "{searchQuery}"</p>
            ) : activeTab === 'unread' ? (
              <div className="space-y-2">
                <Sparkles className="w-8 h-8 mx-auto text-forest/40" />
                <p>You're all caught up! No unread messages.</p>
              </div>
            ) : activeTab === 'groups' ? (
              <div className="space-y-3">
                <Users className="w-8 h-8 mx-auto text-forest/40" />
                <p>No group channels yet.</p>
                <button
                  onClick={() => setIsCreateGroupOpen(true)}
                  className="px-4 py-2 rounded-xl bg-forest text-white font-bold text-xs hover:bg-forest-600 transition-colors"
                >
                  Create a Group
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-sage-200 border border-sage-300 flex items-center justify-center text-forest mx-auto shadow-sm">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <p className="text-charcoal font-medium">No active conversations yet.</p>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest hover:bg-forest-600 text-white font-bold text-xs shadow-sm transition-all"
                >
                  Start Your First Chat
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
