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
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = showStrength ? getStrength(value) : null;

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor={id || name}
            className="block text-xs font-bold text-[#0f2d1c] tracking-wide"
          >
            {label} {required && <span className="text-[#10B981]">*</span>}
          </label>
          {showStrength && value && (
            <span className={`text-[11px] font-bold ${
              strength.score === 1 ? 'text-red-500' :
              strength.score === 2 ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {strength.label}
            </span>
          )}
        </div>
      )}

      <div className="relative rounded-xl shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9bb8a8]">
          <Lock className="w-4 h-4 transition-colors group-focus-within:text-[#10B981]" />
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
          className={`w-full text-sm text-[#0f2d1c] bg-white placeholder-[#9bb8a8] 
            border rounded-xl py-2.5 pl-10 pr-11 transition-all duration-200 
            outline-none focus:ring-4 
            ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15 text-red-900'
                : 'border-slate-200 hover:border-slate-300 focus:border-[#10B981] focus:ring-[#10B981]/10'
            }
            disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            ${className}`}
        />

        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9bb8a8] hover:text-[#0f2d1c] focus:outline-none transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {showStrength && value && (
        <div className="mt-1.5 flex gap-1 h-1 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${(strength.score / 3) * 100}%` }}
          />
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 font-medium animate-fade-in">
          <span>•</span> {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
