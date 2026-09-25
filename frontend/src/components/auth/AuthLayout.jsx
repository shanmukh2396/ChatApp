import React from 'react';
import AuthBrandPanel from './AuthBrandPanel';
import { MessageSquare } from 'lucide-react';

const AuthLayout = ({ children, mode = 'login' }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#070b14] px-4 py-8 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* ─── Ambient Glow Background Orbs ─────────────────────────────────── */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ─── Central Rounded Authentication Card ───────────────────────────── */}
      <div className="w-full max-w-5xl min-h-[620px] bg-white rounded-3xl overflow-hidden shadow-2xl shadow-black/70 border border-slate-800/60 flex flex-col lg:flex-row relative z-10 animate-fade-in">
        {/* Left Rich Brand Panel (Desktop) */}
        <AuthBrandPanel mode={mode} />

        {/* Right Authentication Form Panel */}
        <div className="w-full lg:w-1/2 bg-white text-slate-900 p-6 sm:p-10 xl:p-12 flex flex-col justify-between">
          {/* Mobile Header Banner (Only visible on small screens < 1024px) */}
          <div className="lg:hidden flex items-center justify-between pb-6 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-[1px] shadow-sm">
                <div className="w-full h-full bg-[#0c1322] rounded-[11px] flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="font-bold text-base text-slate-900">ConnectHub</span>
                <span className="block text-[10px] text-blue-600 font-semibold uppercase tracking-wider">
                  Real-time Messenger
                </span>
              </div>
            </div>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              {mode === 'login' ? 'Sign In' : 'Register'}
            </span>
          </div>

          {/* Form Content */}
          <div className="my-auto">{children}</div>

          {/* Bottom Security / Trust indicator */}
          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Protected by 256-bit SSL encryption</span>
            <span>ConnectHub Auth v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
