import React from 'react';
import { Link } from 'react-router-dom';
import ConnectHubLogo from '../common/ConnectHubLogo';
import { ShieldCheck, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

const AuthBrandPanel = ({ mode = 'login' }) => {
  const isLogin = mode === 'login';

  return (
    <div className="relative hidden lg:flex flex-col justify-between w-1/2 p-6 sm:p-8 xl:p-9 bg-[#E3EBE2] text-[#26332B] select-none border-r border-[#D8E2D7]">
      {/* ─── Top Bar: Logo with CH Mark & Switch Navigation ─────────────────── */}
      <div className="relative z-10 flex items-center justify-between">
        <ConnectHubLogo size="md" variant="light" showTagline={false} />

        <div className="text-xs text-[#5C6D63] bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#D8E2D7] shadow-sm">
          <span>{isLogin ? "New here?" : "Joined us?"} </span>
          <Link
            to={isLogin ? "/signup" : "/login"}
            className="text-[#547A60] font-bold hover:underline ml-1"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </Link>
        </div>
      </div>

      {/* ─── Middle Section: Tagline & Value Props ─────────────────────────── */}
      <div className="relative z-10 my-auto py-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#547A60]/10 border border-[#547A60]/20 text-[#547A60] text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#547A60]" />
          <span>Real-Time Messenger & WebRTC</span>
        </div>

        <h1 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-[#26332B] leading-tight">
          Connect. Chat. <br />
          <span className="text-[#547A60]">
            Share Without Limits.
          </span>
        </h1>

        <p className="mt-2 text-[#5C6D63] text-xs sm:text-sm leading-relaxed max-w-sm">
          A calm and pleasant messaging workspace with live messaging, media sharing, and instant voice & video calls.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-[#D8E2D7] shadow-sm">
            <div className="p-1.5 rounded-lg bg-[#E3EBE2] text-[#547A60]">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#26332B]">Live Messages</p>
              <p className="text-[10px] text-[#5C6D63]">Instant delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-[#D8E2D7] shadow-sm">
            <div className="p-1.5 rounded-lg bg-[#E3EBE2] text-[#547A60]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#26332B]">P2P Calling</p>
              <p className="text-[10px] text-[#5C6D63]">Encrypted WebRTC</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Decorative Testimonial Card ────────────────────────────── */}
      <div className="relative z-10">
        <div className="p-3.5 rounded-2xl bg-white/90 border border-[#D8E2D7] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Elena Vasquez"
                  className="w-8 h-8 rounded-full object-cover border border-[#D8E2D7]"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-[#26332B]">Elena Vasquez</span>
                </div>
                <span className="text-[10px] text-[#5C6D63]">Product Designer</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-[#547A60] bg-[#E3EBE2] px-2 py-0.5 rounded-full font-semibold border border-[#D8E2D7]">
              <CheckCircle2 className="w-3 h-3 text-[#547A60]" />
              <span>Online</span>
            </div>
          </div>

          <p className="text-xs text-[#5C6D63] leading-relaxed italic">
            "ConnectHub's clean interface and crystal clear calls make collaboration effortless."
          </p>
        </div>

        {/* Footer copyright */}
        <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#809187]">
          <span>© 2026 ConnectHub Inc.</span>
          <span>Privacy & Terms</span>
        </div>
      </div>
    </div>
  );
};

export default AuthBrandPanel;

