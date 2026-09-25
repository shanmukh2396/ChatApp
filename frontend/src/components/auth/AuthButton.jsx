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
        bg-gradient-to-r from-[#059669] via-[#10B981] to-[#047857] 
        hover:from-[#047857] hover:via-[#059669] hover:to-[#065f46] 
        text-white font-bold text-sm py-3 px-5 rounded-xl
        shadow-lg shadow-[#10B981]/25 hover:shadow-xl hover:shadow-[#10B981]/35
        transition-all duration-200 active:scale-[0.99]
        focus:outline-none focus:ring-4 focus:ring-[#10B981]/20
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
