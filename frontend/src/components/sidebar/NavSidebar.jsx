import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useSettings } from '../../context/SettingsContext';
import ConnectHubLogo from '../common/ConnectHubLogo';
import {
  MessageSquare,
  Users,
  UserPlus,
  PlusCircle,
  User,
  LogOut,
  Sliders,
  Settings,
} from 'lucide-react';

const NavSidebar = ({ activeTab = 'chats', onTabChange }) => {
  const { user, logout } = useAuth();
  const { conversations, setIsSearchOpen, setIsCreateGroupOpen } = useChat();
  const { isDarkMode } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const isProfile = location.pathname === '/profile';
  const isSettings = location.pathname === '/settings';

  const totalUnread = conversations.reduce((acc, conv) => {
    const myMeta = conv.memberMeta?.find(
      (m) => m.user === user?._id || m.user?._id === user?._id
    );
    return acc + (myMeta?.unreadCount || 0);
  }, 0);

  return (
    <aside className="hidden md:flex flex-col items-center justify-between w-20 py-5 bg-white/80 dark:bg-[#18221b]/90 backdrop-blur-xl border-r border-sage-300 dark:border-[#2d3f34] shrink-0 select-none z-20 transition-colors duration-200">
      {/* ─── Top Brand Logo ──────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="focus:outline-none transition-transform duration-200 hover:scale-105"
          title="ConnectHub"
        >
          <ConnectHubLogo size="md" variant={isDarkMode ? 'dark' : 'light'} showWordmark={false} />
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
              activeTab === 'all' && !isProfile && !isSettings
                ? 'bg-forest text-white shadow-md'
                : 'text-charcoal-100 dark:text-[#8ba895] hover:text-charcoal dark:hover:text-white hover:bg-sage-200 dark:hover:bg-[#2d3f34]'
            }`}
          >
            <MessageSquare className="w-5 h-5 transition-transform group-hover:scale-110" />
            {totalUnread > 0 && activeTab !== 'all' && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-forest rounded-full border-2 border-white dark:border-[#18221b] animate-pulse" />
            )}
          </button>

          {/* New Chat / Find Users */}
          <button
            onClick={() => setIsSearchOpen(true)}
            title="Find Users & Start Chat"
            className="p-3 rounded-2xl text-charcoal-100 dark:text-[#8ba895] hover:text-charcoal dark:hover:text-white hover:bg-sage-200 dark:hover:bg-[#2d3f34] transition-all duration-200 group"
          >
            <UserPlus className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:text-forest" />
          </button>

          {/* Groups */}
          <button
            onClick={() => {
              if (onTabChange) onTabChange('groups');
            }}
            title="Group Channels"
            className={`p-3 rounded-2xl transition-all duration-200 group ${
              activeTab === 'groups' && !isProfile && !isSettings
                ? 'bg-forest text-white shadow-md'
                : 'text-charcoal-100 dark:text-[#8ba895] hover:text-charcoal dark:hover:text-white hover:bg-sage-200 dark:hover:bg-[#2d3f34]'
            }`}
          >
            <Users className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>

          {/* Create Group Action */}
          <button
            onClick={() => setIsCreateGroupOpen(true)}
            title="Create New Group"
            className="p-3 rounded-2xl text-charcoal-100 dark:text-[#8ba895] hover:text-charcoal dark:hover:text-white hover:bg-sage-200 dark:hover:bg-[#2d3f34] transition-all duration-200 group"
          >
            <PlusCircle className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:text-forest" />
          </button>
        </nav>
      </div>

      {/* ─── Bottom Settings, Profile & Logout ─────────────────────────────── */}
      <div className="flex flex-col items-center gap-3">
        {/* Chat & App Settings Link */}
        <button
          onClick={() => navigate('/settings')}
          title="Chat & App Settings"
          className={`p-3 rounded-2xl transition-all duration-200 group ${
            isSettings
              ? 'bg-forest text-white shadow-md'
              : 'text-charcoal-100 dark:text-[#8ba895] hover:text-charcoal dark:hover:text-white hover:bg-sage-200 dark:hover:bg-[#2d3f34]'
          }`}
        >
          <Sliders className="w-5 h-5 transition-transform group-hover:scale-110 duration-200" />
        </button>

        {/* User Profile Avatar Link */}
        <div
          onClick={() => navigate('/profile')}
          className="relative cursor-pointer group my-1"
          title={`${user?.name} (Click for profile)`}
        >
          <img
            src={user?.avatar || 'https://ui-avatars.com/api/?name=User'}
            alt={user?.name}
            className={`w-10 h-10 rounded-2xl object-cover border-2 transition-all ${
              isProfile
                ? 'border-forest ring-2 ring-forest/30 shadow-md'
                : 'border-sage-300 dark:border-[#3a5643] group-hover:border-forest/50'
            }`}
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#18221b]" />
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          title="Sign Out"
          className="p-2.5 rounded-2xl text-charcoal-50 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default NavSidebar;
