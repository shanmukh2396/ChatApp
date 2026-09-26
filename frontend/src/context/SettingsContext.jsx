import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const SettingsContext = createContext(null);

export const WALLPAPERS = [
  {
    id: 'default',
    name: 'Theme Default',
    description: 'Matches the active application theme',
    color: '#F4F6F2',
    darkColor: '#17201a',
    className: 'bg-warm-100 dark:bg-[#17201a]',
  },
  {
    id: 'sage',
    name: 'Pale Sage',
    description: 'Soft, calming sage surface',
    color: '#E3EBE2',
    darkColor: '#1f2b23',
    className: 'bg-[#E3EBE2] dark:bg-[#1f2b23]',
  },
  {
    id: 'mint',
    name: 'Soft Mint',
    description: 'Gentle mint green highlight',
    color: '#D5E5D5',
    darkColor: '#1a2e22',
    className: 'bg-[#D5E5D5] dark:bg-[#1a2e22]',
  },
  {
    id: 'forest-gradient',
    name: 'Forest Gradient',
    description: 'Subtle smooth vertical green gradient',
    color: 'linear-gradient(to bottom, #E3EBE2, #D5E5D5)',
    darkColor: 'linear-gradient(to bottom, #1f2b23, #15221a)',
    className: 'bg-gradient-to-b from-[#E3EBE2] to-[#D5E5D5] dark:from-[#1f2b23] dark:to-[#15221a]',
  },
  {
    id: 'dots',
    name: 'Micro Dots',
    description: 'Delicate pattern with minimal contrast',
    color: '#F4F6F2',
    darkColor: '#17201a',
    className: 'bg-warm-100 dark:bg-[#17201a] bg-radial-dots',
  },
  {
    id: 'geometry',
    name: 'Soft Grid',
    description: 'Subtle grid texture for clean focus',
    color: '#F0F5EF',
    darkColor: '#1b261f',
    className: 'bg-[#F0F5EF] dark:bg-[#1b261f] bg-subtle-grid',
  },
  {
    id: 'dark-charcoal',
    name: 'Deep Charcoal',
    description: 'OLED-friendly dark forest backdrop',
    color: '#26332B',
    darkColor: '#141d17',
    className: 'bg-[#26332B] dark:bg-[#141d17]',
  },
];

export const CHAT_THEMES = [
  { id: 'sage', name: 'Sage Calm (Default)', accent: '#547A60' },
  { id: 'classic', name: 'Classic Clean', accent: '#45664F' },
  { id: 'mint', name: 'Mint Fresh', accent: '#6D9578' },
  { id: 'forest', name: 'Deep Forest', accent: '#3A5643' },
  { id: 'charcoal', name: 'Charcoal Modern', accent: '#26332B' },
];

const DEFAULT_SETTINGS = {
  theme: 'system', // 'system' | 'light' | 'dark'
  chatTheme: 'sage',
  wallpaper: 'default',
  mediaQuality: 'standard', // 'standard' | 'high' | 'compressed'
  mediaAutoDownload: true,
  spellCheck: true,
  emojiShortcuts: true,
  enterIsSend: true,
};

const SETTINGS_STORAGE_KEY = 'connecthub_settings_v2';
const CHAT_WALLPAPERS_STORAGE_KEY = 'connecthub_chat_wallpapers_v2';

export const SettingsProvider = ({ children }) => {
  const { user, updateUser } = useAuth();

  // Load initial settings from localStorage or defaults
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (cached) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(cached) };
      }
    } catch (e) {
      console.warn('Failed to parse cached settings');
    }
    return DEFAULT_SETTINGS;
  });

  // Per-chat wallpaper overrides: { [conversationId]: 'wallpaperId' }
  const [chatWallpapers, setChatWallpapers] = useState(() => {
    try {
      const cached = localStorage.getItem(CHAT_WALLPAPERS_STORAGE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.warn('Failed to parse cached chat wallpapers');
    }
    return {};
  });

  // Calculate actual theme (resolving 'system' to light or dark)
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
    return typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false;
  });

  // Sync with device color scheme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setSystemPrefersDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const isDarkMode =
    settings.theme === 'dark' || (settings.theme === 'system' && systemPrefersDark);

  // Apply .dark class to documentElement for instant Tailwind dark: variants
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  }, [isDarkMode]);

  // Sync settings when logged in user profile updates from backend
  useEffect(() => {
    if (user?.settings && typeof user.settings === 'object') {
      setSettings((prev) => {
        const merged = { ...prev, ...user.settings };
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      });
    }
  }, [user]);

  // Update a specific setting
  const updateSetting = useCallback(
    async (key, value) => {
      setSettings((prev) => {
        const next = { ...prev, [key]: value };
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
        return next;
      });

      // Persist to backend if user is authenticated
      if (user) {
        try {
          const { data } = await api.put('/users/profile', {
            settings: {
              ...settings,
              [key]: value,
            },
          });
          if (data.success && data.data) {
            updateUser(data.data);
          }
        } catch (err) {
          console.error('Failed to sync setting to backend:', err);
        }
      }
    },
    [user, settings, updateUser]
  );

  // Update per-chat wallpaper
  const setConversationWallpaper = useCallback((conversationId, wallpaperId) => {
    if (!conversationId) return;
    setChatWallpapers((prev) => {
      const next = { ...prev, [conversationId]: wallpaperId };
      localStorage.setItem(CHAT_WALLPAPERS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Reset per-chat wallpaper to default
  const resetConversationWallpaper = useCallback((conversationId) => {
    if (!conversationId) return;
    setChatWallpapers((prev) => {
      const next = { ...prev };
      delete next[conversationId];
      localStorage.setItem(CHAT_WALLPAPERS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Get active wallpaper for a conversation (override or global default)
  const getWallpaperForConversation = useCallback(
    (conversationId) => {
      if (conversationId && chatWallpapers[conversationId]) {
        const id = chatWallpapers[conversationId];
        return WALLPAPERS.find((w) => w.id === id) || WALLPAPERS[0];
      }
      const globalId = settings.wallpaper || 'default';
      return WALLPAPERS.find((w) => w.id === globalId) || WALLPAPERS[0];
    },
    [chatWallpapers, settings.wallpaper]
  );

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isDarkMode,
        updateSetting,
        setConversationWallpaper,
        resetConversationWallpaper,
        getWallpaperForConversation,
        chatWallpapers,
        WALLPAPERS,
        CHAT_THEMES,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext;
