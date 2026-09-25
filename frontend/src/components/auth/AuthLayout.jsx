import React from 'react';
import AuthBrandPanel from './AuthBrandPanel';
import ConnectHubLogo from '../common/ConnectHubLogo';
import PrismaticBurst from '../backgrounds/PrismaticBurst';

const AuthLayout = ({ children, mode = 'login' }) => {
  return (
    <div className="min-h-[100svh] min-h-screen w-full flex items-center justify-center bg-[#F4F6F2] px-3 sm:px-6 py-4 sm:py-6 relative overflow-y-auto">
      {/* ─── Animated PrismaticBurst Subtle Sage Background ───────────────── */}
      <PrismaticBurst
        color1="#547A60"
        color2="#E3EBE2"
        color3="#D5E5D5"
        color4="#F4F6F2"
        speed={0.15}
        intensity={0.35}
        rays={10.0}
        grain={0.01}
        mouseInfluence={0.1}
        opacity={0.3}
      />

      {/* ─── Central Authentication Split Card (Sleek Viewport Fit) ───────── */}
      <div className="w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl shadow-[#26332B]/5 border border-[#D8E2D7] flex flex-col lg:flex-row relative z-10 animate-fade-in my-auto">
        {/* Left Rich Brand Panel */}
        <AuthBrandPanel mode={mode} />

        {/* Right Authentication Form Panel */}
        <div className="w-full lg:w-1/2 bg-white text-[#26332B] p-5 sm:p-7 xl:p-8 flex flex-col justify-between">
          {/* Mobile Brand Header */}
          <div className="lg:hidden flex items-center justify-between pb-3 mb-3 border-b border-[#E3EBE2]">
            <ConnectHubLogo size="sm" variant="light" showCHMark={true} />
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E3EBE2] text-[#547A60] border border-[#D8E2D7]">
              {mode === 'login' ? 'Sign In' : 'Sign Up'}
            </span>
          </div>

          {/* Form Content */}
          <div className="my-auto w-full">{children}</div>

          {/* Bottom Security Footer */}
          <div className="pt-4 mt-4 border-t border-[#E3EBE2] flex items-center justify-between text-[11px] text-[#5C6D63]">
            <span>256-bit SSL encrypted</span>
            <span>ConnectHub v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;


