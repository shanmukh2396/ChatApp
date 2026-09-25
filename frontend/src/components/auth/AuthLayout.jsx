import React from 'react';
import AuthBrandPanel from './AuthBrandPanel';
import ConnectHubLogo from '../common/ConnectHubLogo';

const AuthLayout = ({ children, mode = 'login' }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#11121d] px-4 py-8 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* ─── Ambient Glow Accents ─────────────────────────────────────────── */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#F20D3A]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#A80729]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* ─── Central Authentication Split Card ─────────────────────────────── */}
      <div className="w-full max-w-5xl min-h-[640px] bg-white rounded-3xl overflow-hidden shadow-2xl shadow-black/80 border border-[#202235] flex flex-col lg:flex-row relative z-10 animate-fade-in">
        {/* Left Rich Brand Panel with Animated Topography Background */}
        <AuthBrandPanel mode={mode} />

        {/* Right Authentication Form Panel (Clean White / Light Surface) */}
        <div className="w-full lg:w-1/2 bg-white text-[#222333] p-6 sm:p-10 xl:p-12 flex flex-col justify-between">
          {/* Mobile Brand Header (Visible on < 1024px screens) */}
          <div className="lg:hidden flex items-center justify-between pb-5 mb-4 border-b border-slate-100">
            <ConnectHubLogo size="sm" variant="light" />
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-50 text-[#F20D3A] border border-red-100">
              {mode === 'login' ? 'Sign In' : 'Sign Up'}
            </span>
          </div>

          {/* Form Content */}
          <div className="my-auto">{children}</div>

          {/* Bottom Security Footer */}
          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#9293A5]">
            <span>Protected by 256-bit SSL encryption</span>
            <span>ConnectHub Auth v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
