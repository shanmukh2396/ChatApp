import React from 'react';
import { Link } from 'react-router-dom';
import Topography from '../backgrounds/Topography';
import ConnectHubLogo from '../common/ConnectHubLogo';
import { MessageSquare, ShieldCheck, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

const AuthBrandPanel = ({ mode = 'login' }) => {
  const isLogin = mode === 'login';

  return (
    <div className="relative hidden lg:flex flex-col justify-between w-1/2 p-10 xl:p-12 overflow-hidden bg-[#171827] text-white select-none border-r border-[#202235]">
      {/* ─── Animated Topography Background (Red & Dark-Red Contours) ─────── */}
      <Topography
        lowColor="#500817"
        midColor="#F20D3A"
        highColor="#FF8BA2"
        speed={0.25}
        morphAmount={2.5}
        morphSpeed={0.05}
        bands={2.5}
        thickness={0.012}
        scale={1.1}
        glow={0.35}
        colorMode="elevation"
        contrast={2.5}
        brightness={0.85}
        fillBands={false}
        opacity={0.85}
        grain={true}
        grainIntensity={0.025}
        mouseInteraction={true}
        mouseRadius={0.3}
        mouseStrength={0.25}
      />

      {/* Dark vignette gradient overlay to ensure perfect contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#171827]/85 via-[#171827]/60 to-[#171827]/95 pointer-events-none" />

      {/* ─── Top Bar: ConnectHub Logo & Switch Navigation ──────────────────── */}
      <div className="relative z-10 flex items-center justify-between">
        <ConnectHubLogo size="md" variant="dark" showTagline={false} />

        <div className="text-xs text-slate-300 bg-[#202235]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
          <span>{isLogin ? "Don't have an account?" : "Already have an account?"} </span>
          <Link
            to={isLogin ? "/signup" : "/login"}
            className="text-[#F20D3A] font-bold hover:text-[#FF4D6D] transition-colors ml-1"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </Link>
        </div>
      </div>

      {/* ─── Middle Section: Tagline & Value Props ─────────────────────────── */}
      <div className="relative z-10 my-auto py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F20D3A]/15 border border-[#F20D3A]/30 text-[#FF8BA2] text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#F20D3A] animate-pulse" />
          <span>Real-Time Messaging Experience</span>
        </div>

        <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Connect. Chat. <br />
          <span className="bg-gradient-to-r from-[#F20D3A] via-[#FF4D6D] to-[#FFA8BA] bg-clip-text text-transparent">
            Share Without Limits.
          </span>
        </h1>

        <p className="mt-3 text-slate-300 text-sm xl:text-base leading-relaxed max-w-md">
          Your conversations, all in one place. Experience ultra-fast real-time messaging, instant media sharing, and group chats.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#202235]/70 border border-white/5 backdrop-blur-md">
            <div className="p-2 rounded-xl bg-[#F20D3A]/20 text-[#F20D3A]">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Live WebSockets</p>
              <p className="text-[11px] text-slate-400">Instant delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#202235]/70 border border-white/5 backdrop-blur-md">
            <div className="p-2 rounded-xl bg-[#F20D3A]/20 text-[#F20D3A]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Secure JWT Auth</p>
              <p className="text-[11px] text-slate-400">Encrypted channels</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Decorative Profile Card ───────────────────────────────── */}
      <div className="relative z-10">
        <div className="p-4 rounded-2xl bg-[#202235]/80 border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Elena Vasquez"
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#F20D3A]/50"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#171827] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Elena Vasquez</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#F20D3A]/20 text-[#FF8BA2]">
                    Member
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">Product Designer</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              <span>Online Now</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed italic">
            "ConnectHub keeps our entire community in sync. Fast, seamless, and beautifully designed."
          </p>
        </div>

        {/* Footer info */}
        <div className="mt-3.5 flex items-center justify-between text-[11px] text-slate-500">
          <span>© 2026 ConnectHub Inc.</span>
          <span>Privacy & Terms</span>
        </div>
      </div>
    </div>
  );
};

export default AuthBrandPanel;
