import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';
import AuthInput from '../components/auth/AuthInput';
import PasswordInput from '../components/auth/PasswordInput';
import AuthButton from '../components/auth/AuthButton';
import ConnectHubLogo from '../components/common/ConnectHubLogo';
import { Mail, LogIn, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    const result = await login(formData.email.trim(), formData.password);
    setSubmitting(false);

    if (result.success) {
      navigate('/');
    }
  };

  return (
    <AuthLayout mode="login">
      <div className="max-w-md mx-auto w-full">
        {/* Right Panel Header: Logo & Greeting */}
        <div className="mb-6 sm:mb-8">
          <div className="hidden lg:block mb-4">
            <ConnectHubLogo size="md" variant="light" showTagline={false} showCHMark={true} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222333] tracking-tight">
            Welcome Back!
          </h1>
          <p className="text-sm text-[#9293A5] mt-1.5 leading-relaxed">
            Sign in to continue your conversations on ConnectHub.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email */}
          <AuthInput
            id="email"
            name="email"
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            icon={Mail}
            error={errors.email}
            required
            autoComplete="email"
            disabled={submitting}
          />

          {/* Password */}
          <PasswordInput
            id="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            autoComplete="current-password"
            disabled={submitting}
          />

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#222333] font-medium">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 text-[#10B981] rounded border-slate-300 focus:ring-[#10B981] transition"
              />
              <span>Remember this device</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <AuthButton
              type="submit"
              loading={submitting}
              loadingText="Signing in to ConnectHub..."
              icon={LogIn}
            >
              Log In
            </AuthButton>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-[#9293A5] font-semibold tracking-wider">
              or
            </span>
          </div>
        </div>

        {/* Switch to Signup */}
        <div className="text-center">
          <p className="text-xs sm:text-sm text-[#222333]">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-bold text-[#059669] hover:text-[#047857] hover:underline inline-flex items-center gap-1 transition-colors"
            >
              Sign Up <ArrowRight className="w-3.5 h-3.5 inline" />
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
