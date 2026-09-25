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
        bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 
        hover:from-blue-700 hover:via-indigo-700 hover:to-blue-700 
        text-white font-semibold text-sm py-3 px-5 rounded-xl
        shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35
        transition-all duration-200 active:scale-[0.99]
        focus:outline-none focus:ring-4 focus:ring-blue-500/20
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
