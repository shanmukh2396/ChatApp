import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useChat } from '../../context/ChatContext';
import { X, Palette, Sun, Moon, Laptop, Check, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

const ChatSettingsModal = ({ isOpen, onClose }) => {
  const { activeConversation } = useChat();
  const {
    settings,
    updateSetting,
    WALLPAPERS,
    setConversationWallpaper,
    resetConversationWallpaper,
    getWallpaperForConversation,
    chatWallpapers,
    isDarkMode,
  } = useSettings();

  if (!isOpen) return null;

  const currentWp = getWallpaperForConversation(activeConversation?._id);
  const isPerChatCustom = !!(activeConversation && chatWallpapers[activeConversation._id]);

  const handleSelectWallpaper = (wpId) => {
    if (activeConversation) {
      setConversationWallpaper(activeConversation._id, wpId);
      toast.success(`Wallpaper set for "${activeConversation.name || 'this chat'}"`);
    } else {
      updateSetting('wallpaper', wpId);
      toast.success('Global chat wallpaper updated');
    }
  };

  const handleResetChatWallpaper = () => {
    if (activeConversation) {
      resetConversationWallpaper(activeConversation._id);
      toast.success('Reset to global wallpaper');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-[#18221b] border border-sage-300 dark:border-[#2d3f34] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-sage-200 dark:border-[#2d3f34] bg-sage-100/50 dark:bg-[#1f2c23]">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-forest" />
            <div>
              <h2 className="text-base font-extrabold text-charcoal dark:text-white">
                Conversation Appearance
              </h2>
              {activeConversation && (
                <p className="text-[11px] text-charcoal-50 dark:text-[#8ba895]">
                  Customizing: {activeConversation.name || 'Current Chat'}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-charcoal-50 hover:text-charcoal dark:hover:text-white hover:bg-sage-200 dark:hover:bg-[#2d3f34] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Wallpaper Selection Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-charcoal-50 dark:text-[#8ba895] uppercase tracking-wider">
              Select Wallpaper
            </h3>
            {isPerChatCustom && (
              <button
                type="button"
                onClick={handleResetChatWallpaper}
                className="flex items-center gap-1 text-xs font-bold text-forest hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Use Global Default</span>
              </button>
            )}
          </div>

          {/* Wallpapers Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {WALLPAPERS.map((wp) => {
              const isSelected = currentWp.id === wp.id;
              return (
                <button
                  key={wp.id}
                  type="button"
                  onClick={() => handleSelectWallpaper(wp.id)}
                  className={`group relative flex flex-col p-2.5 rounded-2xl border text-left transition-all overflow-hidden ${
                    isSelected
                      ? 'border-forest ring-2 ring-forest/30 shadow-md bg-forest/5 dark:bg-forest/15'
                      : 'border-sage-300 dark:border-[#2d3f34] hover:border-forest/40'
                  }`}
                >
                  <div
                    className={`w-full h-14 rounded-xl border border-sage-300/60 dark:border-[#3a5643] mb-2 flex items-center justify-center relative overflow-hidden ${wp.className}`}
                  >
                    <div className="w-3/4 space-y-1 scale-75 opacity-80">
                      <div className="w-2/3 h-2 rounded-md bg-white dark:bg-[#223027] border border-sage-300/40 ml-0 shadow-2xs" />
                      <div className="w-2/3 h-2 rounded-md bg-mint dark:bg-forest/40 ml-auto shadow-2xs" />
                    </div>

                    {isSelected && (
                      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-forest text-white flex items-center justify-center shadow-md">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <span className="text-xs font-bold text-charcoal dark:text-white truncate">
                    {wp.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-sage-200 dark:border-[#2d3f34] bg-sage-50 dark:bg-[#18221b] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-600 text-white font-bold text-xs shadow-sm transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSettingsModal;
