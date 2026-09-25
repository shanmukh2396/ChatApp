import React from 'react';
import { Loader2 } from 'lucide-react';

const AuthButton = ({
  children,
  type = 'submit',
  loading = false,
  loadingText,
  disabled = false,
  icon: Icon,
  onClick,
  className = '',
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`w-full inline-flex items-center justify-center gap-2 
        bg-gradient-to-r from-[#F20D3A] via-[#E80B36] to-[#D90B32] 
        hover:from-[#D90B32] hover:via-[#C7092D] hover:to-[#A80729] 
        text-white font-bold text-sm py-3 px-5 rounded-xl
        shadow-lg shadow-[#F20D3A]/25 hover:shadow-xl hover:shadow-[#F20D3A]/35
        transition-all duration-200 active:scale-[0.99]
        focus:outline-none focus:ring-4 focus:ring-[#F20D3A]/20
        disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100
        ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{loadingText || 'Processing...'}</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default AuthButton;
