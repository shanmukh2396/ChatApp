import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ShieldCheck, Zap, Users, Sparkles, CheckCircle2 } from 'lucide-react';

const AuthBrandPanel = ({ mode = 'login' }) => {
  const isLogin = mode === 'login';

  return (
    <div className="relative hidden lg:flex flex-col justify-between w-1/2 p-10 xl:p-12 overflow-hidden bg-gradient-to-br from-[#090d16] via-[#0f172a] to-[#0c1527] text-white select-none border-r border-slate-800/60">
      {/* ─── Abstract Digital Communication Background Graphics ───────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Ambient Neon Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl" />

        {/* SVG Futuristic Network & Constellation Nodes */}
        <svg
          className="absolute inset-0 w-full h-full opacity-25"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
            </linearGradient>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid pattern */}
          <pattern id="authGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#authGrid)" />

          {/* Connection Lines */}
          <path
            d="M 60 120 Q 200 180 320 140 T 480 260"
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path
            d="M 100 420 Q 260 360 380 440 T 520 380"
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="1.5"
          />
          <path
            d="M 320 140 L 380 440"
            fill="none"
            stroke="rgba(99, 102, 241, 0.25)"
            strokeWidth="1"
          />

          {/* Glowing Network Nodes */}
          <circle cx="60" cy="120" r="4" fill="#38bdf8" />
          <circle cx="60" cy="120" r="10" fill="url(#nodeGlow)" />

          <circle cx="320" cy="140" r="5" fill="#818cf8" />
          <circle cx="320" cy="140" r="12" fill="url(#nodeGlow)" />

          <circle cx="480" cy="260" r="4" fill="#38bdf8" />
          <circle cx="100" cy="420" r="4" fill="#60a5fa" />

          <circle cx="380" cy="440" r="6" fill="#06b6d4" />
          <circle cx="380" cy="440" r="14" fill="url(#nodeGlow)" />
        </svg>
      </div>

      {/* ─── Top Bar: Brand Label & Quick Switch ───────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/30">
            <div className="w-full h-full bg-[#0c1322] rounded-[11px] flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              ConnectHub
            </span>
            <span className="block text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">
              Real-time Messenger
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-400 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <span>{isLogin ? "New to Hub?" : "Have an account?"} </span>
          <Link
            to={isLogin ? "/signup" : "/login"}
            className="text-cyan-400 font-semibold hover:text-cyan-300 hover:underline transition-colors ml-1"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </Link>
        </div>
      </div>

      {/* ─── Middle Section: Tagline & Highlights ─────────────────────────── */}
      <div className="relative z-10 my-auto py-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Next-Generation Team & Social Chat</span>
        </div>

        <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Connect. Chat. <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Share Without Limits.
          </span>
        </h1>

        <p className="mt-3 text-slate-300 text-sm xl:text-base leading-relaxed max-w-md">
          Experience ultra-responsive real-time conversations, rich media uploads, and synchronized presence across all your devices.
        </p>

        {/* Feature Pills */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-cyan-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Live WebSockets</p>
              <p className="text-[11px] text-slate-400">Instant message delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Secure JWT Auth</p>
              <p className="text-[11px] text-slate-400">Encrypted token channels</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Decorative Testimonial / Live Chat Widget ────────────── */}
      <div className="relative z-10">
        <div className="p-4 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Sarah Jenkins"
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/40"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0f172a] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Sarah Jenkins</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-500/20 text-cyan-300">
                    Active
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">Product Designer @ Wave</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              <span>Connected</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed italic">
            "ConnectHub feels blazing fast and modern. The real-time typing indicators and seamless media sharing make daily communication feel effortless."
          </p>
        </div>

        {/* Footer copyright */}
        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
          <span>© 2026 ConnectHub Inc.</span>
          <span>Privacy & Terms</span>
        </div>
      </div>
    </div>
  );
};

export default AuthBrandPanel;
