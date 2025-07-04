import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, BookOpen, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onToggleMode: () => void;
  onForgotPassword?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode, onForgotPassword }) => {
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPasswordResetMessage, setShowPasswordResetMessage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>();

  // Check for email verification success or password reset success in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    const hashParams = new URLSearchParams(hash.substring(1));
    
    const accessToken = urlParams.get('access_token') || hashParams.get('access_token');
    const type = urlParams.get('type') || hashParams.get('type');
    
    // Check for password reset success from localStorage
    const passwordResetSuccess = localStorage.getItem('passwordResetSuccess');
    if (passwordResetSuccess) {
      setShowPasswordResetMessage(true);
      localStorage.removeItem('passwordResetSuccess');
      
      // Hide message after successful login or after 10 seconds
      setTimeout(() => {
        setShowPasswordResetMessage(false);
      }, 10000);
    }
    
    if (type === 'signup' && accessToken) {
      setShowSuccessMessage(true);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Hide message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError('');

    try {
      const success = await login(data.email, data.password);
      if (success) {
        // Clear password reset message on successful login
        setShowPasswordResetMessage(false);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-600">Sign in to your Dev Diaries account</p>
        </div>

        {/* Email Verification Success Message */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl border border-green-400/20 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle className="h-6 w-6" />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-sm">Email Verified Successfully!</p>
                    <p className="text-xs opacity-90">Your account has been activated</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Password Reset Success Message */}
        <AnimatePresence>
          {showPasswordResetMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900 text-sm">Your password has been reset.</p>
                  <p className="text-blue-700 text-xs">Please sign in with your new password</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field with Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('password', {
                    required: 'Password is required'
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            {onForgotPassword && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onToggleMode}
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};