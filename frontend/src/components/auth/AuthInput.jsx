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
          className="block text-xs font-semibold text-slate-700 tracking-wide mb-1.5"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4 transition-colors group-focus-within:text-blue-600" />
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
          className={`w-full text-sm text-slate-900 bg-white placeholder-slate-400 
            border rounded-xl py-2.5 transition-all duration-200 
            outline-none focus:ring-4 
            ${Icon ? 'pl-10 pr-3.5' : 'px-3.5'}
            ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15 text-red-900'
                : 'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-blue-600/10'
            }
            disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            ${className}`}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 font-medium animate-fade-in">
          <span>•</span> {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput;
