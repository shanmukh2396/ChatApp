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
    <aside className="hidden md:flex flex-col items-center justify-between w-20 py-5 bg-[#131420] border-r border-[#202235] shrink-0 select-none z-20">
      {/* ─── Top Brand Logo ──────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="focus:outline-none transition-transform duration-200 hover:scale-105"
          title="ConnectHub"
        >
          <ConnectHubLogo size="md" variant="dark" showWordmark={false} />
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
                ? 'bg-[#F20D3A] text-white shadow-lg shadow-[#F20D3A]/30'
                : 'text-[#9293A5] hover:text-white hover:bg-[#202235]'
            }`}
          >
            <MessageSquare className="w-5 h-5 transition-transform group-hover:scale-110" />
            {totalUnread > 0 && activeTab !== 'all' && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#F20D3A] rounded-full border-2 border-[#131420] animate-pulse" />
            )}
          </button>

          {/* New Chat / Find Users */}
          <button
            onClick={() => setIsSearchOpen(true)}
            title="Find Users & Start Chat"
            className="p-3 rounded-2xl text-[#9293A5] hover:text-white hover:bg-[#202235] transition-all duration-200 group"
          >
            <UserPlus className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:text-[#FF4D6D]" />
          </button>

          {/* Groups */}
          <button
            onClick={() => {
              if (onTabChange) onTabChange('groups');
            }}
            title="Group Channels"
            className={`p-3 rounded-2xl transition-all duration-200 group ${
              activeTab === 'groups' && !isProfile
                ? 'bg-[#F20D3A] text-white shadow-lg shadow-[#F20D3A]/30'
                : 'text-[#9293A5] hover:text-white hover:bg-[#202235]'
            }`}
          >
            <Users className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>

          {/* Create Group Action */}
          <button
            onClick={() => setIsCreateGroupOpen(true)}
            title="Create New Group"
            className="p-3 rounded-2xl text-[#9293A5] hover:text-white hover:bg-[#202235] transition-all duration-200 group"
          >
            <PlusCircle className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:text-[#F20D3A]" />
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
              ? 'bg-[#F20D3A] text-white shadow-lg shadow-[#F20D3A]/30'
              : 'text-[#9293A5] hover:text-white hover:bg-[#202235]'
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
            className="w-10 h-10 rounded-2xl object-cover border-2 border-[#202235] group-hover:border-[#F20D3A] transition-colors"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#131420]" />
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          title="Sign Out"
          className="p-2.5 rounded-2xl text-[#9293A5] hover:text-[#F20D3A] hover:bg-[#F20D3A]/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default NavSidebar;
