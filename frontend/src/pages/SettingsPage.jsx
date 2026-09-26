import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import ConnectHubLogo from '../components/common/ConnectHubLogo';
import PrismaticBurst from '../components/backgrounds/PrismaticBurst';
import {
  ArrowLeft,
  Sun,
  Moon,
  Laptop,
  Palette,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Sparkles,
  Send,
  SpellCheck,
  Smile,
  ShieldCheck,
  Sliders,
  HardDrive,
  DownloadCloud,
} from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    settings,
    updateSetting,
    WALLPAPERS,
    CHAT_THEMES,
    isDarkMode,
  } = useSettings();

  const handleThemeChange = (newTheme) => {
    updateSetting('theme', newTheme);
    toast.success(`Theme updated to ${newTheme === 'system' ? 'System Default' : newTheme}`);
  };

  const handleWallpaperChange = (wallpaperId) => {
    updateSetting('wallpaper', wallpaperId);
    toast.success('Chat wallpaper updated');
  };

  const handleResetWallpaper = () => {
    updateSetting('wallpaper', 'default');
    toast.success('Wallpaper reset to default');
  };

  return (
    <div className="min-h-screen w-full bg-warm-100 dark:bg-[#121914] text-charcoal dark:text-[#E3EBE2] transition-colors duration-200 flex flex-col items-center p-4 sm:p-6 lg:p-8 relative overflow-x-hidden">
      {/* ─── Ambient Animated Background ─────────────────────────────────── */}
      <PrismaticBurst
        color1="#547A60"
        color2="#E3EBE2"
        color3="#D5E5D5"
        color4="#F4F6F2"
        speed={0.1}
        intensity={0.2}
        rays={8.0}
        grain={0.01}
        mouseInfluence={0.08}
        opacity={isDarkMode ? 0.12 : 0.22}
      />

      <div className="w-full max-w-3xl relative z-10 my-4 sm:my-6 space-y-6">
        {/* ─── Top Navigation Header ──────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-[#1c2620]/80 hover:bg-white dark:hover:bg-[#223027] text-charcoal-100 dark:text-[#8ba895] hover:text-charcoal dark:hover:text-white border border-sage-300 dark:border-[#3a5643] text-xs font-bold transition-all shadow-sm backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Messages</span>
          </button>

          <ConnectHubLogo size="sm" variant={isDarkMode ? 'dark' : 'light'} />
        </div>

        {/* ─── Main Title Card ────────────────────────────────────────────── */}
        <div className="bg-white/90 dark:bg-[#18221b]/90 backdrop-blur-xl border border-sage-300 dark:border-[#2d3f34] rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3.5 mb-2">
            <div className="p-3 rounded-2xl bg-forest/10 dark:bg-forest/25 text-forest dark:text-[#8ba895]">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-charcoal dark:text-white">
                Chat &amp; App Settings
              </h1>
              <p className="text-xs text-charcoal-50 dark:text-[#8ba895]">
                Customize your theme, conversation wallpaper, and messaging experience
              </p>
            </div>
          </div>
        </div>

        {/* ─── Section 1: Display & Appearance ────────────────────────────── */}
        <div className="bg-white/90 dark:bg-[#18221b]/90 backdrop-blur-xl border border-sage-300 dark:border-[#2d3f34] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="border-b border-sage-200 dark:border-[#2d3f34] pb-3">
            <h2 className="text-base font-extrabold text-charcoal dark:text-white flex items-center gap-2">
              <Sun className="w-4 h-4 text-forest" />
              <span>Display &amp; Appearance</span>
            </h2>
            <p className="text-xs text-charcoal-50 dark:text-[#8ba895] mt-0.5">
              Control the overall visual appearance and color theme of ConnectHub
            </p>
          </div>

          {/* 1. App Theme Option */}
          <div>
            <label className="block text-xs font-bold text-charcoal-50 dark:text-[#8ba895] uppercase tracking-wider mb-2.5">
              Application Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* System */}
              <button
                type="button"
                onClick={() => handleThemeChange('system')}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all text-center gap-2 ${
                  settings.theme === 'system'
                    ? 'border-forest bg-forest/10 dark:bg-forest/20 text-forest dark:text-white font-bold shadow-sm'
                    : 'border-sage-200 dark:border-[#2d3f34] bg-sage-50/50 dark:bg-[#1e2a21] text-charcoal-100 dark:text-[#8ba895] hover:border-forest/40'
                }`}
              >
                <Laptop className="w-5 h-5" />
                <span className="text-xs font-semibold">System Default</span>
              </button>

              {/* Light */}
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all text-center gap-2 ${
                  settings.theme === 'light'
                    ? 'border-forest bg-forest/10 dark:bg-forest/20 text-forest dark:text-white font-bold shadow-sm'
                    : 'border-sage-200 dark:border-[#2d3f34] bg-sage-50/50 dark:bg-[#1e2a21] text-charcoal-100 dark:text-[#8ba895] hover:border-forest/40'
                }`}
              >
                <Sun className="w-5 h-5" />
                <span className="text-xs font-semibold">Light Mode</span>
              </button>

              {/* Dark */}
              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all text-center gap-2 ${
                  settings.theme === 'dark'
                    ? 'border-forest bg-forest/10 dark:bg-forest/20 text-forest dark:text-white font-bold shadow-sm'
                    : 'border-sage-200 dark:border-[#2d3f34] bg-sage-50/50 dark:bg-[#1e2a21] text-charcoal-100 dark:text-[#8ba895] hover:border-forest/40'
                }`}
              >
                <Moon className="w-5 h-5" />
                <span className="text-xs font-semibold">Dark Mode</span>
              </button>
            </div>
          </div>

          {/* 2. Default Chat Theme */}
          <div>
            <label className="block text-xs font-bold text-charcoal-50 dark:text-[#8ba895] uppercase tracking-wider mb-2">
              Default Chat Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CHAT_THEMES.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => {
                    updateSetting('chatTheme', th.id);
                    toast.success(`Chat theme set to ${th.name}`);
                  }}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all ${
                    settings.chatTheme === th.id
                      ? 'border-forest bg-forest/10 dark:bg-forest/20 font-bold'
                      : 'border-sage-200 dark:border-[#2d3f34] bg-sage-50/50 dark:bg-[#1e2a21] hover:border-forest/30'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full shrink-0 shadow-xs border border-white/20"
                    style={{ backgroundColor: th.accent }}
                  />
                  <span className="text-xs truncate">{th.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Chat Wallpaper Selection */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <label className="block text-xs font-bold text-charcoal-50 dark:text-[#8ba895] uppercase tracking-wider">
                  Chat Wallpaper
                </label>
                <span className="text-[11px] text-charcoal-50 dark:text-[#8ba895]">
                  Applied to the conversation message area
                </span>
              </div>

              {settings.wallpaper !== 'default' && (
                <button
                  type="button"
                  onClick={handleResetWallpaper}
                  className="flex items-center gap-1 text-xs font-bold text-forest hover:underline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {WALLPAPERS.map((wp) => {
                const isSelected = settings.wallpaper === wp.id;
                return (
                  <button
                    key={wp.id}
                    type="button"
                    onClick={() => handleWallpaperChange(wp.id)}
                    className={`group relative flex flex-col p-2.5 rounded-2xl border text-left transition-all overflow-hidden ${
                      isSelected
                        ? 'border-forest ring-2 ring-forest/30 shadow-md'
                        : 'border-sage-300 dark:border-[#2d3f34] hover:border-forest/40'
                    }`}
                  >
                    {/* Wallpaper Preview Swatch */}
                    <div
                      className={`w-full h-16 rounded-xl border border-sage-300/60 dark:border-[#3a5643] mb-2 flex items-center justify-center relative overflow-hidden ${wp.className}`}
                    >
                      {/* Mock mini bubbles */}
                      <div className="w-3/4 space-y-1 scale-75 opacity-80">
                        <div className="w-2/3 h-2 rounded-md bg-white dark:bg-[#223027] border border-sage-300/40 ml-0 shadow-2xs" />
                        <div className="w-2/3 h-2 rounded-md bg-mint dark:bg-forest/40 ml-auto shadow-2xs" />
                      </div>

                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-forest text-white flex items-center justify-center shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <span className="text-xs font-bold text-charcoal dark:text-white truncate">
                      {wp.name}
                    </span>
                    <span className="text-[10px] text-charcoal-50 dark:text-[#8ba895] line-clamp-1">
                      {wp.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── Section 2: Messaging & Typing Preferences ─────────────────── */}
        <div className="bg-white/90 dark:bg-[#18221b]/90 backdrop-blur-xl border border-sage-300 dark:border-[#2d3f34] rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="border-b border-sage-200 dark:border-[#2d3f34] pb-3">
            <h2 className="text-base font-extrabold text-charcoal dark:text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-forest" />
              <span>Chat &amp; Typing Behavior</span>
            </h2>
            <p className="text-xs text-charcoal-50 dark:text-[#8ba895] mt-0.5">
              Customize shortcuts, autocorrect, and message submission
            </p>
          </div>

          <div className="space-y-4 divide-y divide-sage-200 dark:divide-[#2d3f34]">
            {/* 1. Enter is Send */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-charcoal dark:text-white">
                  Enter is Send
                </h3>
                <p className="text-xs text-charcoal-50 dark:text-[#8ba895]">
                  Pressing <kbd className="px-1.5 py-0.5 bg-sage-100 dark:bg-[#223027] rounded text-[10px] font-mono">Enter</kbd> sends your message. Press <kbd className="px-1.5 py-0.5 bg-sage-100 dark:bg-[#223027] rounded text-[10px] font-mono">Shift+Enter</kbd> for a newline.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.enterIsSend}
                onClick={() => {
                  updateSetting('enterIsSend', !settings.enterIsSend);
                  toast.success(`Enter is send: ${!settings.enterIsSend ? 'Enabled' : 'Disabled'}`);
                }}
                className={`w-12 h-6.5 rounded-full transition-colors relative flex items-center p-1 shrink-0 ${
                  settings.enterIsSend
                    ? 'bg-forest'
                    : 'bg-sage-300 dark:bg-[#2d3f34]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.enterIsSend ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 2. Replace Text with Emoji */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-charcoal dark:text-white flex items-center gap-1.5">
                  <span>Replace text with emoji</span>
                  <Smile className="w-3.5 h-3.5 text-forest" />
                </h3>
                <p className="text-xs text-charcoal-50 dark:text-[#8ba895]">
                  Automatically convert shortcuts like <code className="text-forest font-bold">:)</code> to 😊 and <code className="text-forest font-bold">&lt;3</code> to ❤️ while composing.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.emojiShortcuts}
                onClick={() => {
                  updateSetting('emojiShortcuts', !settings.emojiShortcuts);
                  toast.success(`Emoji shortcuts: ${!settings.emojiShortcuts ? 'Enabled' : 'Disabled'}`);
                }}
                className={`w-12 h-6.5 rounded-full transition-colors relative flex items-center p-1 shrink-0 ${
                  settings.emojiShortcuts
                    ? 'bg-forest'
                    : 'bg-sage-300 dark:bg-[#2d3f34]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.emojiShortcuts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 3. Spell Check */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-charcoal dark:text-white flex items-center gap-1.5">
                  <span>Spell check</span>
                  <SpellCheck className="w-3.5 h-3.5 text-forest" />
                </h3>
                <p className="text-xs text-charcoal-50 dark:text-[#8ba895]">
                  Highlight misspelled words in the message composer.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.spellCheck}
                onClick={() => {
                  updateSetting('spellCheck', !settings.spellCheck);
                  toast.success(`Spell check: ${!settings.spellCheck ? 'Enabled' : 'Disabled'}`);
                }}
                className={`w-12 h-6.5 rounded-full transition-colors relative flex items-center p-1 shrink-0 ${
                  settings.spellCheck
                    ? 'bg-forest'
                    : 'bg-sage-300 dark:bg-[#2d3f34]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.spellCheck ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Section 3: Media & Storage ─────────────────────────────────── */}
        <div className="bg-white/90 dark:bg-[#18221b]/90 backdrop-blur-xl border border-sage-300 dark:border-[#2d3f34] rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="border-b border-sage-200 dark:border-[#2d3f34] pb-3">
            <h2 className="text-base font-extrabold text-charcoal dark:text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-forest" />
              <span>Media &amp; Storage</span>
            </h2>
            <p className="text-xs text-charcoal-50 dark:text-[#8ba895] mt-0.5">
              Control media upload resolution and auto-download behavior
            </p>
          </div>

          <div className="space-y-4 divide-y divide-sage-200 dark:divide-[#2d3f34]">
            {/* 1. Media Upload Quality */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-charcoal dark:text-white">
                  Media Upload Quality
                </h3>
                <p className="text-xs text-charcoal-50 dark:text-[#8ba895]">
                  Select compression quality for photos and file attachments
                </p>
              </div>
              <select
                value={settings.mediaQuality}
                onChange={(e) => {
                  updateSetting('mediaQuality', e.target.value);
                  toast.success(`Media quality set to ${e.target.value}`);
                }}
                className="bg-sage-50 dark:bg-[#1e2a21] text-charcoal dark:text-white border border-sage-300 dark:border-[#3a5643] rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none focus:border-forest"
              >
                <option value="high">High (Original Quality)</option>
                <option value="standard">Standard (Optimized)</option>
                <option value="compressed">Compressed (Data Saver)</option>
              </select>
            </div>

            {/* 2. Media Auto-Download */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-charcoal dark:text-white flex items-center gap-1.5">
                  <span>Auto-load media preview</span>
                  <DownloadCloud className="w-3.5 h-3.5 text-forest" />
                </h3>
                <p className="text-xs text-charcoal-50 dark:text-[#8ba895]">
                  Automatically display image previews in chat conversations.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.mediaAutoDownload}
                onClick={() => {
                  updateSetting('mediaAutoDownload', !settings.mediaAutoDownload);
                  toast.success(`Media auto-load: ${!settings.mediaAutoDownload ? 'Enabled' : 'Disabled'}`);
                }}
                className={`w-12 h-6.5 rounded-full transition-colors relative flex items-center p-1 shrink-0 ${
                  settings.mediaAutoDownload
                    ? 'bg-forest'
                    : 'bg-sage-300 dark:bg-[#2d3f34]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.mediaAutoDownload ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Footer Privacy & Version ───────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-sage-100/60 dark:bg-[#18221b] border border-sage-300 dark:border-[#2d3f34] text-xs text-charcoal-50 dark:text-[#8ba895] gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-forest" />
            <span>Preferences saved to your ConnectHub profile</span>
          </div>
          <span>ConnectHub v2.0 • Secure P2P</span>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
