import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';
import AuthInput from '../components/auth/AuthInput';
import PasswordInput from '../components/auth/PasswordInput';
import AuthButton from '../components/auth/AuthButton';
import ConnectHubLogo from '../components/common/ConnectHubLogo';
import { User, Mail, UserPlus, ArrowRight } from 'lucide-react';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    const result = await register(
      formData.name.trim(),
      formData.email.trim(),
      formData.password
    );
    setSubmitting(false);

    if (result.success) {
      navigate('/');
    }
  };

  return (
    <AuthLayout mode="signup">
      <div className="max-w-md mx-auto w-full">
        {/* Header with ConnectHub Logo */}
        <div className="mb-3.5 sm:mb-4">
          <div className="hidden lg:block mb-2.5">
            <ConnectHubLogo size="sm" variant="light" showTagline={false} />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#26332B] tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-[#5C6D63] mt-0.5 leading-relaxed">
            Join ConnectHub and connect with your team.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3" noValidate>
          {/* Full Name */}
          <AuthInput
            id="name"
            name="name"
            label="Full Name"
            type="text"
            placeholder="e.g. John Doe"
            value={formData.name}
            onChange={handleChange}
            icon={User}
            error={errors.name}
            required
            autoComplete="name"
            disabled={submitting}
          />

          {/* Email Address */}
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
            placeholder="Min. 6 characters"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            showStrength={true}
            autoComplete="new-password"
            disabled={submitting}
          />

          {/* Confirm Password */}
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
            disabled={submitting}
          />

          {/* Submit Button */}
          <div className="pt-1">
            <AuthButton
              type="submit"
              loading={submitting}
              loadingText="Creating your account..."
              icon={UserPlus}
            >
              Create Account
            </AuthButton>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#D8E2D7]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-white px-2.5 text-[#809187] font-semibold tracking-wider">
              or
            </span>
          </div>
        </div>

        {/* Switch to Login */}
        <div className="text-center">
          <p className="text-xs text-[#26332B]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-[#547A60] hover:underline inline-flex items-center gap-1 transition-colors"
            >
              Log In <ArrowRight className="w-3 h-3 inline" />
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;

