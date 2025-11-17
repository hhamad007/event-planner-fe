'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  Calendar 
} from "lucide-react";

/* Create a popup modal with login and register forms. Use the shadcn Dialog component with input fields for email/password. Handle form submission and connect to the AuthContext for user authentication. */

const AuthModal = ({ isOpen, onClose, mode = 'login', onSwitchMode, onSuccess }) => {
  const { 
    login, 
    signup, 
    isLoading,
    isAuthenticated, 
    error, 
    successMessage, 
    clearError, 
    clearSuccessMessage 
  } = useAuth();

  const [authMode, setAuthMode] = useState(mode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });
  const [formErrors, setFormErrors] = useState({});

  // Update mode when prop changes
  useEffect(() => {
    setAuthMode(mode);
  }, [mode]);

  // Close modal when user becomes authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated && !isLoading && !error) {
      // Small delay to allow user to see any success message
      const timer = setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, error, isOpen, onSuccess, onClose]);

  // Clear form and errors when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      resetForm();
      clearError();
      clearSuccessMessage();
    }
  }, [isOpen, authMode, clearError, clearSuccessMessage]);

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      rememberMe: false
    });
    setFormErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear global errors when user starts typing
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Registration-specific validation
    if (authMode === 'register') {
      // First name validation
      if (!formData.firstName.trim()) {
        errors.firstName = 'First name is required';
      } else if (formData.firstName.trim().length < 2) {
        errors.firstName = 'First name must be at least 2 characters';
      }

      // Last name validation
      if (!formData.lastName.trim()) {
        errors.lastName = 'Last name is required';
      } else if (formData.lastName.trim().length < 2) {
        errors.lastName = 'Last name must be at least 2 characters';
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    clearSuccessMessage();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      if (authMode === 'login') {
        await login({
          email: formData.email.trim(),
          password: formData.password,
          rememberMe: formData.rememberMe
        });
        // Call success callback if provided, otherwise just close
        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
        }
      } else {
        await signup({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          rememberMe: formData.rememberMe
        });
        // Call success callback if provided, otherwise just close
        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
        }
      }
    } catch (err) {
      // Error is handled by AuthContext
      console.error('Authentication error:', err);
    }
  };

  const switchMode = () => {
    const newMode = authMode === 'login' ? 'register' : 'login';
    setAuthMode(newMode);
    if (onSwitchMode) {
      onSwitchMode(newMode);
    }
    resetForm();
    clearError();
    clearSuccessMessage();
  };

  const handleClose = () => {
    resetForm();
    clearError();
    clearSuccessMessage();
    onClose();
  };

  const isLogin = authMode === 'login';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {isLogin ? 'Welcome Back!' : 'Create Your Account'}
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            {isLogin 
              ? 'Sign in to access your event planning dashboard' 
              : 'Join us to start planning amazing events'
            }
          </p>
        </DialogHeader>

        {/* Error/Success Messages */}
        {error && (
          <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Authentication Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Success!</p>
              <p className="text-sm mt-1">{successMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name fields for registration */}
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`pl-10 ${formErrors.firstName ? 'border-red-500 focus:ring-red-500' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {formErrors.firstName && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{formErrors.firstName}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`pl-10 ${formErrors.lastName ? 'border-red-500 focus:ring-red-500' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {formErrors.lastName && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{formErrors.lastName}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className={`pl-10 ${formErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            {formErrors.email && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{formErrors.email}</span>
              </p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password *
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className={`pl-10 pr-10 ${formErrors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                disabled={isLoading}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {formErrors.password && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{formErrors.password}</span>
              </p>
            )}
            {!isLogin && !formErrors.password && (
              <p className="text-xs text-gray-500">
                Must be 8+ characters with uppercase, lowercase, and number
              </p>
            )}
          </div>

          {/* Confirm Password field for registration */}
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`pl-10 pr-10 ${formErrors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{formErrors.confirmPassword}</span>
                </p>
              )}
            </div>
          )}

          {/* Remember me checkbox */}
          <div className="flex items-center space-x-2">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              disabled={isLoading}
            />
            <Label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer">
              Remember me for 30 days
            </Label>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </span>
              </div>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </Button>
        </form>

        {/* Forgot password link for login */}
        {isLogin && (
          <div className="text-center">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              onClick={() => {
                // TODO: Implement forgot password functionality
                console.log('Forgot password clicked');
              }}
              disabled={isLoading}
            >
              Forgot your password?
            </button>
          </div>
        )}

        <Separator />

        {/* Switch between login and register */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            {isLogin ? "Don't have an account yet?" : "Already have an account?"}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={switchMode}
            disabled={isLoading}
            className="w-full border-gray-300 hover:bg-gray-50"
          >
            {isLogin ? 'Create New Account' : 'Sign In Instead'}
          </Button>
        </div>

        {/* Terms and Privacy for registration */}
        {!isLogin && (
          <div className="text-xs text-gray-500 text-center">
            By creating an account, you agree to our{' '}
            <span className="text-blue-600 cursor-pointer hover:underline">Terms of Service</span>
            {' '}and{' '}
            <span className="text-blue-600 cursor-pointer hover:underline">Privacy Policy</span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;

