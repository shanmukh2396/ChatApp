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
        <div className="mb-4 sm:mb-5">
          <div className="hidden lg:block mb-3">
            <ConnectHubLogo size="sm" variant="light" showTagline={false} showCHMark={true} />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#26332B] tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-[#5C6D63] mt-1 leading-relaxed">
            Sign in to continue to ConnectHub.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5" noValidate>
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
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#26332B] font-medium">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-3.5 h-3.5 text-[#547A60] rounded border-[#D8E2D7] focus:ring-[#547A60] transition"
              />
              <span>Remember this device</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-1.5">
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
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#D8E2D7]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-white px-2.5 text-[#809187] font-semibold tracking-wider">
              or
            </span>
          </div>
        </div>

        {/* Switch to Signup */}
        <div className="text-center">
          <p className="text-xs text-[#26332B]">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-bold text-[#547A60] hover:underline inline-flex items-center gap-1 transition-colors"
            >
              Sign Up <ArrowRight className="w-3 h-3 inline" />
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;

