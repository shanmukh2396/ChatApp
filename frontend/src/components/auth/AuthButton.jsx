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
        bg-[#547A60] hover:bg-[#45664F] active:bg-[#3A5643] 
        text-white font-bold text-xs sm:text-sm py-2.5 sm:py-3 px-4 rounded-xl
        shadow-sm hover:shadow
        transition-all duration-150 active:scale-[0.99]
        focus:outline-none focus:ring-2 focus:ring-[#547A60] focus:ring-offset-1
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

