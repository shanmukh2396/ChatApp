import React from 'react';

const ConnectHubLogo = ({
  size = 'md',
  variant = 'light', // 'light' (on light backgrounds) or 'dark' (on dark surfaces)
  showWordmark = true,
  showTagline = false,
  className = '',
}) => {
  const iconSizes = {
    sm: { box: 'w-7 h-7', svg: 'w-4 h-4', text: 'text-base', sub: 'text-[9px]' },
    md: { box: 'w-9 h-9', svg: 'w-4.5 h-4.5', text: 'text-lg', sub: 'text-[10px]' },
    lg: { box: 'w-11 h-11', svg: 'w-5.5 h-5.5', text: 'text-xl', sub: 'text-xs' },
    xl: { box: 'w-14 h-14', svg: 'w-7 h-7', text: 'text-2xl', sub: 'text-xs' },
  };

  const currentSize = iconSizes[size] || iconSizes.md;
  const isDark = variant === 'dark';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* ─── Logo Icon Emblem ─────────────────────────────────────────────── */}
      <div
        className={`${currentSize.box} rounded-xl bg-[#547A60] p-[1px] shadow-sm shrink-0 flex items-center justify-center transition-transform duration-150 hover:scale-105`}
      >
        <div className="w-full h-full bg-[#547A60] rounded-[11px] flex items-center justify-center relative overflow-hidden">
          {/* SVG ConnectHub Symbol: Connected Messenger Nodes */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${currentSize.svg} text-white`}
          >
            {/* Main Chat Node */}
            <path
              d="M12 3C7.03 3 3 6.8 3 11.5C3 13.9 4.05 16.05 5.75 17.6L5 21L8.7 19.8C9.72 20.25 10.83 20.5 12 20.5C16.97 20.5 21 16.7 21 12C21 7.3 16.97 3 12 3Z"
              fill="#D5E5D5"
            />
            {/* Connected Hub Intersect */}
            <circle cx="9.5" cy="11.5" r="1.5" fill="#26332B" />
            <circle cx="14.5" cy="11.5" r="1.5" fill="#26332B" />
            <path
              d="M9.5 11.5 H14.5"
              stroke="#26332B"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* ─── Wordmark ──────────────────────────────────────────────────────── */}
      {showWordmark && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center">
            <span
              className={`font-black tracking-tight ${currentSize.text} ${
                isDark ? 'text-white' : 'text-[#26332B]'
              }`}
            >
              Connect
            </span>
            <span
              className={`font-black tracking-tight ${currentSize.text} text-[#547A60] ml-0.5`}
            >
              Hub
            </span>
          </div>

          {showTagline && (
            <span
              className={`${currentSize.sub} font-semibold uppercase tracking-wider text-[#5C6D63] -mt-0.5`}
            >
              Connect. Chat. Share.
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectHubLogo;
