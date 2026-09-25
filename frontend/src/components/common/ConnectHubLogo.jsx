import React from 'react';

const ConnectHubLogo = ({
  size = 'md',
  variant = 'dark', // 'dark' (for dark surface) or 'light' (for white surface)
  showWordmark = true,
  showTagline = false,
  showCHMark = true,
  className = '',
}) => {
  const iconSizes = {
    sm: { box: 'w-7 h-7', svg: 'w-4 h-4', ch: 'text-[9px] px-1.5 py-0.5', text: 'text-base', sub: 'text-[9px]' },
    md: { box: 'w-10 h-10', svg: 'w-5 h-5', ch: 'text-[11px] px-2 py-0.5', text: 'text-xl', sub: 'text-[10px]' },
    lg: { box: 'w-12 h-12', svg: 'w-6 h-6', ch: 'text-xs px-2.5 py-0.5', text: 'text-2xl', sub: 'text-xs' },
    xl: { box: 'w-16 h-16', svg: 'w-8 h-8', ch: 'text-sm px-3 py-1', text: 'text-3xl', sub: 'text-xs' },
  };

  const currentSize = iconSizes[size] || iconSizes.md;
  const isLight = variant === 'light';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* ─── Logo Icon Emblem ─────────────────────────────────────────────── */}
      <div
        className={`${currentSize.box} rounded-2xl bg-gradient-to-tr from-[#047857] via-[#10B981] to-[#34D399] p-[1.5px] shadow-lg shadow-[#10B981]/20 shrink-0 flex items-center justify-center transition-transform duration-200 hover:scale-105`}
      >
        <div className="w-full h-full bg-[#0b2416] rounded-[14px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle inner radial glow */}
          <div className="absolute inset-0 bg-[#10B981]/15 rounded-full blur-sm" />

          {/* SVG ConnectHub Symbol: Connected Messenger Nodes */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${currentSize.svg} relative z-10`}
          >
            {/* Main Chat Node */}
            <path
              d="M12 3C7.03 3 3 6.8 3 11.5C3 13.9 4.05 16.05 5.75 17.6L5 21L8.7 19.8C9.72 20.25 10.83 20.5 12 20.5C16.97 20.5 21 16.7 21 12C21 7.3 16.97 3 12 3Z"
              fill="url(#logoGreenGrad)"
            />
            {/* Connected Hub Intersect */}
            <circle cx="9.5" cy="11.5" r="1.5" fill="#FFFFFF" />
            <circle cx="14.5" cy="11.5" r="1.5" fill="#FFFFFF" />
            <path
              d="M9.5 11.5 H14.5"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient
                id="logoGreenGrad"
                x1="3"
                y1="3"
                x2="21"
                y2="21"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#34D399" />
                <stop offset="1" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* ─── Compact "CH" Brand Mark Badge ───────────────────────────────── */}
      {showCHMark && (
        <span
          className={`font-black tracking-widest rounded-lg uppercase ${currentSize.ch} ${
            isLight
              ? 'bg-[#10B981]/15 text-[#059669] border border-[#10B981]/30'
              : 'bg-[#10B981]/20 text-[#6ee7b7] border border-[#10B981]/40 shadow-xs shadow-[#10B981]/20'
          }`}
        >
          CH
        </span>
      )}

      {/* ─── Wordmark ──────────────────────────────────────────────────────── */}
      {showWordmark && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center">
            <span
              className={`font-black tracking-tight ${currentSize.text} ${
                isLight ? 'text-[#0f2d1c]' : 'text-white'
              }`}
            >
              Connect
            </span>
            <span
              className={`font-black tracking-tight ${currentSize.text} text-[#10B981] ml-0.5`}
            >
              Hub
            </span>
          </div>

          {showTagline && (
            <span
              className={`${currentSize.sub} font-semibold uppercase tracking-wider text-[#9bb8a8] -mt-0.5`}
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
