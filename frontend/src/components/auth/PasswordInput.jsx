import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({
  id,
  name,
  label = 'Password',
  value,
  onChange,
  onBlur,
  placeholder = '••••••••',
  error,
  required = false,
  autoComplete = 'current-password',
  disabled = false,
  showStrength = false,
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Password strength gauge
  const getStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score === 2 || score === 3) return { score: 2, label: 'Good', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-[#547A60]' };
  };

  const strength = showStrength ? getStrength(value) : null;

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1">
          <label
            htmlFor={id || name}
            className="block text-xs font-bold text-[#26332B] tracking-wide"
          >
            {label} {required && <span className="text-[#547A60]">*</span>}
          </label>
          {showStrength && value && (
            <span className={`text-[10px] font-bold ${
              strength.score === 1 ? 'text-red-500' :
              strength.score === 2 ? 'text-amber-600' : 'text-[#547A60]'
            }`}>
              {strength.label}
            </span>
          )}
        </div>
      )}

      <div className="relative rounded-xl shadow-2xs">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5C6D63]">
          <Lock className="w-4 h-4 transition-colors group-focus-within:text-[#547A60]" />
        </div>

        <input
          id={id || name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`w-full text-xs sm:text-sm text-[#26332B] bg-white placeholder-[#809187] 
            border rounded-xl py-2 sm:py-2.5 pl-9 sm:pl-10 pr-10 transition-all duration-150 
            outline-none focus:ring-2 
            ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15 text-red-900'
                : 'border-[#D8E2D7] hover:border-[#B8CEBD] focus:border-[#547A60] focus:ring-[#547A60]/15'
            }
            disabled:bg-[#F4F6F2] disabled:text-[#809187] disabled:cursor-not-allowed
            ${className}`}
        />

        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5C6D63] hover:text-[#26332B] focus:outline-none transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {showStrength && value && (
        <div className="mt-1 flex gap-1 h-1 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${(strength.score / 3) * 100}%` }}
          />
        </div>
      )}

      {error && (
        <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium animate-fade-in">
          <span>•</span> {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;

