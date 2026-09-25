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
    // 1. Tab filter
    if (activeTab === 'groups' && !c.isGroupChat) return false;
    if (activeTab === 'unread') {
      const myMeta = c.memberMeta?.find(
        (m) => m.user === user?._id || m.user?._id === user?._id
      );
      if (!myMeta || myMeta.unreadCount <= 0) return false;
    }

    // 2. Search query filter
    if (!searchQuery.trim()) return true;
    const name = c.isGroupChat
      ? c.name
      : c.participants?.find((p) => p._id !== user?._id)?.name;
    return name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Calculate counts
  const unreadCount = conversations.reduce((acc, conv) => {
    const myMeta = conv.memberMeta?.find(
      (m) => m.user === user?._id || m.user?._id === user?._id
    );
    return acc + (myMeta?.unreadCount > 0 ? 1 : 0);
  }, 0);

  const groupCount = conversations.filter((c) => c.isGroupChat).length;

  return (
    <div className="flex flex-col h-full w-full md:w-80 lg:w-96 bg-[#0c2417]/85 backdrop-blur-xl border-r border-[#18422b] shrink-0 select-none">
      {/* ─── Top Header ──────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 border-b border-[#18422b] flex items-center justify-between">
        {/* Mobile Logo / Title */}
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <ConnectHubLogo size="sm" variant="dark" showCHMark={true} />
          </div>
          <div className="hidden md:block">
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Messages</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#18422b] text-[#6ee7b7] border border-white/5 font-bold">
                {conversations.length}
              </span>
            </h2>
          </div>
        </div>

        {/* Action Buttons: New Chat & Create Group */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(true)}
            title="Start New Chat"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] text-white text-xs font-bold shadow-md shadow-[#10B981]/25 transition-all duration-200 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          {/* Mobile Profile & Logout */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={() => navigate('/profile')}
              title="Profile"
              className="p-2 rounded-xl text-[#9bb8a8] hover:text-white hover:bg-[#18422b]"
            >
              <img
                src={user?.avatar || 'https://ui-avatars.com/api/?name=User'}
                alt={user?.name}
                className="w-7 h-7 rounded-full object-cover border border-[#18422b]"
              />
            </button>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-xl text-[#9bb8a8] hover:text-red-400"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Search Bar ──────────────────────────────────────────────────── */}
      <div className="px-4 py-3 border-b border-[#18422b]">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9bb8a8] w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations or contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#071a0f]/90 text-slate-100 placeholder-[#9bb8a8] border border-[#18422b] rounded-xl pl-10 pr-4 py-2.5 text-xs transition-all duration-200 focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
          />
        </div>
      </div>

      {/* ─── Filter Tabs (All, Unread, Groups) ────────────────────────────── */}
      <div className="px-4 py-2.5 border-b border-[#18422b]/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 ${
            activeTab === 'all'
              ? 'bg-[#10B981] text-white shadow-sm shadow-[#10B981]/30'
              : 'text-[#9bb8a8] hover:text-white hover:bg-[#18422b]'
          }`}
        >
          All Chats ({conversations.length})
        </button>

        <button
          onClick={() => setActiveTab('unread')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
            activeTab === 'unread'
              ? 'bg-[#10B981] text-white shadow-sm shadow-[#10B981]/30'
              : 'text-[#9bb8a8] hover:text-white hover:bg-[#18422b]'
          }`}
        >
          <span>Unread</span>
          {unreadCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-white text-[#059669] text-[10px] font-black flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('groups')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
            activeTab === 'groups'
              ? 'bg-[#10B981] text-white shadow-sm shadow-[#10B981]/30'
              : 'text-[#9bb8a8] hover:text-white hover:bg-[#18422b]'
          }`}
        >
          <span>Groups</span>
          <span className="text-[10px] text-[#9bb8a8]">({groupCount})</span>
        </button>
      </div>

      {/* ─── Conversation List ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
        {loadingConversations ? (
          <div className="py-16 flex flex-col items-center justify-center text-[#9bb8a8] text-xs gap-3">
            <div className="w-7 h-7 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
            <span>Loading conversations...</span>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="py-16 text-center text-[#9bb8a8] text-xs px-4">
            {searchQuery ? (
              <p>No conversations matching "{searchQuery}"</p>
            ) : activeTab === 'unread' ? (
              <div className="space-y-2">
                <Sparkles className="w-8 h-8 mx-auto text-[#9bb8a8]/50" />
                <p>You're all caught up! No unread messages.</p>
              </div>
            ) : activeTab === 'groups' ? (
              <div className="space-y-3">
                <Users className="w-8 h-8 mx-auto text-[#9bb8a8]/50" />
                <p>No group channels yet.</p>
                <button
                  onClick={() => setIsCreateGroupOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#10B981] text-white font-bold text-xs hover:bg-[#059669] transition-colors"
                >
                  Create a Group
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#18422b] border border-white/5 flex items-center justify-center text-[#10B981] mx-auto shadow-lg">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <p className="text-slate-300 font-medium">No active conversations yet.</p>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs shadow-lg shadow-[#10B981]/30 transition-all"
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

