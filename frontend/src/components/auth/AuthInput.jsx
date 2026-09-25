import React from 'react';

const AuthInput = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  icon: Icon,
  error,
  required = false,
  autoComplete,
  disabled = false,
  className = '',
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id || name}
          className="block text-xs font-bold text-[#26332B] tracking-wide mb-1"
        >
          {label} {required && <span className="text-[#547A60]">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-2xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5C6D63]">
            <Icon className="w-4 h-4 transition-colors group-focus-within:text-[#547A60]" />
          </div>
        )}

        <input
          id={id || name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`w-full text-xs sm:text-sm text-[#26332B] bg-white placeholder-[#809187] 
            border rounded-xl py-2 sm:py-2.5 transition-all duration-150 
            outline-none focus:ring-2 
            ${Icon ? 'pl-9 sm:pl-10 pr-3.5' : 'px-3.5'}
            ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15 text-red-900'
                : 'border-[#D8E2D7] hover:border-[#B8CEBD] focus:border-[#547A60] focus:ring-[#547A60]/15'
            }
            disabled:bg-[#F4F6F2] disabled:text-[#809187] disabled:cursor-not-allowed
            ${className}`}
        />
      </div>

      {error && (
        <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium animate-fade-in">
          <span>•</span> {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput;

