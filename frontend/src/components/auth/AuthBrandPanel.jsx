import React from 'react';
import { Link } from 'react-router-dom';
import PrismaticBurst from '../backgrounds/PrismaticBurst';
import ConnectHubLogo from '../common/ConnectHubLogo';
import { ShieldCheck, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

const AuthBrandPanel = ({ mode = 'login' }) => {
  const isLogin = mode === 'login';

  return (
    <div className="relative hidden lg:flex flex-col justify-between w-1/2 p-10 xl:p-12 overflow-hidden bg-[#071a0f] text-white select-none border-r border-[#18422b]">
      {/* ─── Animated PrismaticBurst Background (Green / Emerald Palette) ─── */}
      <PrismaticBurst
        color1="#042f1a"
        color2="#059669"
        color3="#10b981"
        color4="#6ee7b7"
        speed={0.3}
        intensity={0.8}
        rays={18.0}
        grain={0.02}
        mouseInfluence={0.3}
        opacity={0.85}
      />

      {/* Dark vignette overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#071a0f]/80 via-[#071a0f]/50 to-[#071a0f]/90 pointer-events-none" />

      {/* ─── Top Bar: Logo with CH Mark & Switch Navigation ─────────────────── */}
      <div className="relative z-10 flex items-center justify-between">
        <ConnectHubLogo size="md" variant="dark" showTagline={false} showCHMark={true} />

        <div className="text-xs text-slate-300 bg-[#18422b]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
          <span>{isLogin ? "Don't have an account?" : "Already have an account?"} </span>
          <Link
            to={isLogin ? "/signup" : "/login"}
            className="text-[#10B981] font-bold hover:text-[#6ee7b7] transition-colors ml-1"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </Link>
        </div>
      </div>

      {/* ─── Middle Section: Tagline & Value Props ─────────────────────────── */}
      <div className="relative z-10 my-auto py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#a7f3d0] text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#10B981] animate-pulse" />
          <span>Real-Time Messenger & WebRTC Calls</span>
        </div>

        <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Connect. Chat. <br />
          <span className="bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#A7F3D0] bg-clip-text text-transparent">
            Share Without Limits.
          </span>
        </h1>

        <p className="mt-3 text-slate-300 text-sm xl:text-base leading-relaxed max-w-md">
          Your conversations, audio/video calls, and media sharing all in one seamless place.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#18422b]/70 border border-white/5 backdrop-blur-md">
            <div className="p-2 rounded-xl bg-[#10B981]/20 text-[#10B981]">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Live WebSockets</p>
              <p className="text-[11px] text-[#9bb8a8]">Instant delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#18422b]/70 border border-white/5 backdrop-blur-md">
            <div className="p-2 rounded-xl bg-[#10B981]/20 text-[#10B981]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">P2P Voice & Video</p>
              <p className="text-[11px] text-[#9bb8a8]">Encrypted WebRTC</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Decorative Profile Card ───────────────────────────────── */}
      <div className="relative z-10">
        <div className="p-4 rounded-2xl bg-[#18422b]/80 border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Elena Vasquez"
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#10B981]/60"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#071a0f] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Elena Vasquez</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#10B981]/20 text-[#a7f3d0]">
                    Member
                  </span>
                </div>
                <span className="text-[11px] text-[#9bb8a8]">Product Designer</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              <span>Online Now</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed italic">
            "ConnectHub with crystal clear voice and video calls makes team collaboration fast and effortless."
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
