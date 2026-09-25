import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import ConnectHubLogo from '../common/ConnectHubLogo';
import {
  MessageSquare,
  Users,
  UserPlus,
  PlusCircle,
  User,
  LogOut,
  Settings,
} from 'lucide-react';

const NavSidebar = ({ activeTab = 'chats', onTabChange }) => {
  const { user, logout } = useAuth();
  const { conversations, setIsSearchOpen, setIsCreateGroupOpen } = useChat();
  const navigate = useNavigate();
  const location = useLocation();

  const isProfile = location.pathname === '/profile';

  // Calculate total unread messages across conversations
  const totalUnread = conversations.reduce((acc, conv) => {
    const myMeta = conv.memberMeta?.find(
      (m) => m.user === user?._id || m.user?._id === user?._id
    );
    return acc + (myMeta?.unreadCount || 0);
  }, 0);

  return (
    <aside className="hidden md:flex flex-col items-center justify-between w-20 py-5 bg-[#0a1f13]/90 backdrop-blur-xl border-r border-[#18422b] shrink-0 select-none z-20">
      {/* ─── Top Brand Logo ──────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="focus:outline-none transition-transform duration-200 hover:scale-105"
          title="ConnectHub"
        >
          <ConnectHubLogo size="md" variant="dark" showWordmark={false} showCHMark={true} />
        </button>

        {/* ─── Main Navigation Items ───────────────────────────────────────── */}
        <nav className="flex flex-col items-center gap-3 mt-4">
          {/* Chats / Messages */}
          <button
            onClick={() => {
              if (onTabChange) onTabChange('all');
              navigate('/');
            }}
            title="All Messages"
            className={`relative p-3 rounded-2xl transition-all duration-200 group ${
              activeTab === 'all' && !isProfile
                ? 'bg-[#10B981] text-white shadow-lg shadow-[#10B981]/30'
                : 'text-[#9bb8a8] hover:text-white hover:bg-[#18422b]'
            }`}
          >
            <MessageSquare className="w-5 h-5 transition-transform group-hover:scale-110" />
            {totalUnread > 0 && activeTab !== 'all' && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#10B981] rounded-full border-2 border-[#0a1f13] animate-pulse" />
            )}
          </button>

          {/* New Chat / Find Users */}
          <button
            onClick={() => setIsSearchOpen(true)}
            title="Find Users & Start Chat"
            className="p-3 rounded-2xl text-[#9bb8a8] hover:text-white hover:bg-[#18422b] transition-all duration-200 group"
          >
            <UserPlus className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:text-[#34D399]" />
          </button>

          {/* Groups */}
          <button
            onClick={() => {
              if (onTabChange) onTabChange('groups');
            }}
            title="Group Channels"
            className={`p-3 rounded-2xl transition-all duration-200 group ${
              activeTab === 'groups' && !isProfile
                ? 'bg-[#10B981] text-white shadow-lg shadow-[#10B981]/30'
                : 'text-[#9bb8a8] hover:text-white hover:bg-[#18422b]'
            }`}
          >
            <Users className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>

          {/* Create Group Action */}
          <button
            onClick={() => setIsCreateGroupOpen(true)}
            title="Create New Group"
            className="p-3 rounded-2xl text-[#9bb8a8] hover:text-white hover:bg-[#18422b] transition-all duration-200 group"
          >
            <PlusCircle className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:text-[#10B981]" />
          </button>
        </nav>
      </div>

      {/* ─── Bottom Profile & Logout ─────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-3">
        {/* Profile Link */}
        <button
          onClick={() => navigate('/profile')}
          title="Profile & Account Settings"
          className={`p-3 rounded-2xl transition-all duration-200 group ${
            isProfile
              ? 'bg-[#10B981] text-white shadow-lg shadow-[#10B981]/30'
              : 'text-[#9bb8a8] hover:text-white hover:bg-[#18422b]'
          }`}
        >
          <Settings className="w-5 h-5 transition-transform group-hover:rotate-45 duration-300" />
        </button>

        {/* User Avatar */}
        <div
          onClick={() => navigate('/profile')}
          className="relative cursor-pointer group my-1"
          title={`${user?.name} (Click for profile)`}
        >
          <img
            src={user?.avatar || 'https://ui-avatars.com/api/?name=User'}
            alt={user?.name}
            className="w-10 h-10 rounded-2xl object-cover border-2 border-[#18422b] group-hover:border-[#10B981] transition-colors"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0a1f13]" />
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          title="Sign Out"
          className="p-2.5 rounded-2xl text-[#9bb8a8] hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default NavSidebar;

