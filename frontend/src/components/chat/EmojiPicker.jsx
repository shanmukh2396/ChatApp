import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Smile, Heart, Coffee, Compass, Flag, Sparkles, Award } from 'lucide-react';

const EMOJI_CATEGORIES = [
  {
    id: 'smileys',
    name: 'Smileys & Emotion',
    icon: '😀',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
      '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
      '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
      '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
      '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮',
      '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓',
      '🧐', '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😦',
      '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞',
      '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿',
    ],
  },
  {
    id: 'gestures',
    name: 'Gestures & People',
    icon: '👋',
    emojis: [
      '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟',
      '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎',
      '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏',
      '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻',
      '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄',
    ],
  },
  {
    id: 'nature',
    name: 'Animals & Nature',
    icon: '🌿',
    emojis: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
      '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆',
      '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋',
      '🐌', '🐞', '🐜', '🦟', '🐢', '🐍', '🦎', '🐙', '🦑', '🦐',
      '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🦈', '🐊', '🐅',
      '🌲', '🌳', '🌴', '🌱', '🌿', '☘️', '🍀', '🎍', '🪴', '🍃',
      '🍂', '🍁', '🍄', '🌾', '💐', '🌷', '🌹', '🌻', '🌼', '🌸',
      '🌺', '☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️',
      '⚡', '❄️', '☃️', '⛄', '🌬️', '💨', '🌪️', '🌫️', '🌈', '✨',
    ],
  },
  {
    id: 'food',
    name: 'Food & Drink',
    icon: '🍕',
    emojis: [
      '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐',
      '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🍆',
      '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠',
      '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞',
      '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕',
      '🥪', '🥙', '🧆', '🌮', '🌯', '🥗', '🥘', '🍝', '🍜', '🍲',
      '🍣', '🍱', '🥟', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🍢',
      '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫',
      '🍬', '🍭', '🍮', '🍯', '☕', '🍵', '🧃', '🥤', '🧋', '🍺',
    ],
  },
  {
    id: 'activities',
    name: 'Activities & Objects',
    icon: '⚽',
    emojis: [
      '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱',
      '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳',
      '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷',
      '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️',
      '🤺', '🤾', '🧗', '🧘', '🏇', '🏆', '🥇', '🥈', '🥉', '🏅',
      '🎯', '🎮', '🕹️', '🎰', '🎲', '🧩', '🎨', '🎬', '🎤', '🎧',
      '💡', '🔦', '📱', '💻', '🖥️', '⌨️', '🖱️', '📷', '📸', '📹',
      '🔍', '🔬', '🔭', '📡', '🔋', '🔌', '💎', '🔑', '🔒', '🔔',
    ],
  },
  {
    id: 'symbols',
    name: 'Symbols & Hearts',
    icon: '❤️',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
      '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️',
      '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐',
      '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐',
      '♑', '♒', '♓', '🆔', '⚛️', '☣️', '📴', '📳', '🈶', '🈚',
      '🈸', '🈺', '🈵', '♨️', '💯', '🔥', '⭐', '🌟', '⚡', '💥',
      '✅', '✔️', '❌', '❎', '➕', '➖', '➗', '❓', '❗', '💤',
    ],
  },
];

const EmojiPicker = ({ onSelect, onClose, isOpen }) => {
  const [activeCategory, setActiveCategory] = useState('smileys');
  const [search, setSearch] = useState('');
  const pickerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Focus search when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter emojis across all categories if search is active
  const filteredEmojis = search.trim()
    ? EMOJI_CATEGORIES.flatMap((c) => c.emojis).filter((emoji) => emoji.includes(search.trim()))
    : null;

  const currentCategoryObj = EMOJI_CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-16 right-2 sm:right-auto sm:left-12 z-50 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-[#1c2620] border border-sage-300 dark:border-[#3a5643] rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col h-80"
    >
      {/* ─── Top Header & Search ─────────────────────────────────────────── */}
      <div className="p-2.5 border-b border-sage-200 dark:border-[#2d3f34] bg-sage-50/80 dark:bg-[#18221b]">
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 w-3.5 h-3.5 text-charcoal-50 dark:text-[#8ba895]" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search emojis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-[#223027] text-charcoal dark:text-white placeholder-charcoal-50 dark:placeholder-[#8ba895]/60 text-xs rounded-xl pl-8 pr-7 py-1.5 border border-sage-300 dark:border-[#3a5643] focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest/30"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2 text-charcoal-50 hover:text-charcoal dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        {!search && (
          <div className="flex items-center justify-between gap-1 mt-2 pt-1 border-t border-sage-200/60 dark:border-[#2d3f34]/60 overflow-x-auto no-scrollbar">
            {EMOJI_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                title={cat.name}
                className={`p-1.5 rounded-lg text-sm transition-all shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-forest/15 text-forest dark:bg-forest/30 scale-110'
                    : 'opacity-60 hover:opacity-100 hover:bg-sage-200/50 dark:hover:bg-[#2d3f34]'
                }`}
              >
                {cat.icon}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── Emoji Grid View ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-2.5">
        {search ? (
          <div>
            <p className="text-[10px] font-bold text-charcoal-50 dark:text-[#8ba895] uppercase tracking-wider mb-1.5 px-1">
              Search Results ({filteredEmojis.length})
            </p>
            {filteredEmojis.length === 0 ? (
              <div className="py-8 text-center text-xs text-charcoal-50 dark:text-[#8ba895]">
                No matching emojis found
              </div>
            ) : (
              <div className="grid grid-cols-7 sm:grid-cols-8 gap-1">
                {filteredEmojis.map((emoji, idx) => (
                  <button
                    key={`${emoji}-${idx}`}
                    type="button"
                    onClick={() => {
                      onSelect(emoji);
                      onClose();
                    }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xl hover:bg-sage-100 dark:hover:bg-[#2a3a30] active:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-[10px] font-bold text-charcoal-50 dark:text-[#8ba895] uppercase tracking-wider mb-1.5 px-1">
              {currentCategoryObj?.name}
            </p>
            <div className="grid grid-cols-7 sm:grid-cols-8 gap-1">
              {currentCategoryObj?.emojis.map((emoji, idx) => (
                <button
                  key={`${emoji}-${idx}`}
                  type="button"
                  onClick={() => {
                    onSelect(emoji);
                    onClose();
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xl hover:bg-sage-100 dark:hover:bg-[#2a3a30] active:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── Bottom Status Hint ─────────────────────────────────────────── */}
      <div className="px-3 py-1.5 bg-sage-50 dark:bg-[#18221b] border-t border-sage-200 dark:border-[#2d3f34] flex items-center justify-between text-[10px] text-charcoal-50 dark:text-[#8ba895]">
        <span>Click to insert</span>
        <span>Esc to close</span>
      </div>
    </div>
  );
};

export default EmojiPicker;
