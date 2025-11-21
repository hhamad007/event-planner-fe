"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "@/utils/api"; // Make sure this points to your backend

// Create context
const AuthContext = createContext();

// Auth provider component with comprehensive authentication features
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [redirectPath, setRedirectPath] = useState("/");

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Clear success message function
  const clearSuccessMessage = () => {
    setSuccessMessage(null);
  };

  // Set redirect path for post-auth navigation
  const setAuthRedirect = (path) => {
    setRedirectPath(path);
  };

  // Session expiry handling
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [sessionWarning, setSessionWarning] = useState(false);

  // Session expiry management
  const resetSessionTimer = () => {
    const expiryTime = Date.now() + 30 * 60 * 1000; // 30 minutes
    setSessionExpiry(expiryTime);
    localStorage.setItem("sessionExpiry", expiryTime.toString());
  };

  const checkSessionExpiry = () => {
    const storedExpiry = localStorage.getItem("sessionExpiry");
    if (!storedExpiry) return false;

    const expiryTime = parseInt(storedExpiry);
    const currentTime = Date.now();
    const timeLeft = expiryTime - currentTime;

    // Show warning 5 minutes before expiry
    if (timeLeft <= 5 * 60 * 1000 && timeLeft > 0) {
      setSessionWarning(true);
    } else if (timeLeft <= 0) {
      handleSessionExpiry();
      return true;
    }

    return false;
  };

  const handleSessionExpiry = () => {
    setSessionWarning(false);
    setError("Your session has expired. Please log in again.");
    logout();
  };

  const extendSession = () => {
    resetSessionTimer();
    setSessionWarning(false);
  };

  // Login function for real backend
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.login({ email, password });
      console.log("Login API response:", response);
      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(user));
      setUser(user); // <-- This updates context state immediately
      setIsAuthenticated(true); // <-- This updates context state immediately
      console.log("AuthContext login setUser:", user);
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setError(error?.response?.data?.message || "Login failed");
      setIsLoading(false);
      return {
        success: false,
        message: error?.response?.data?.message || "Login failed",
      };
    }
  };

  // Signup function for real backend
  const signup = async (formData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await authAPI.signup(formData);
      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      setSuccessMessage(
        "Account created successfully! Welcome to Event Planner."
      );

      // Set session expiry
      resetSessionTimer();

      setIsLoading(false);
      return { success: true, user: user, redirectTo: redirectPath };
    } catch (error) {
      setError(error?.response?.data?.message || "Signup failed");
      setIsLoading(false);
      return {
        success: false,
        message: error?.response?.data?.message || "Signup failed",
      };
    }
  };

  // Enhanced logout function with complete cleanup
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    setSuccessMessage(null);
    setRedirectPath("/");
    setSessionExpiry(null);
    setSessionWarning(false);

    // Complete session cleanup
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("userPreferences");
    localStorage.removeItem("sessionExpiry");

    // Optional: Clear other app-specific data
    sessionStorage.clear();
  };

  // Session validation function
  const validateSession = async () => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (!token || !userData) {
      setIsLoading(false);
      return false;
    }

    try {
      const parsedUser = JSON.parse(userData);

      // In real app, validate token with backend
      // For demo, check token format and expiry
      if (
        token.startsWith("demo-token-") ||
        token.startsWith("admin-token-") ||
        token.startsWith("signup-token-")
      ) {
        setUser(parsedUser);
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
      }

      // Invalid token
      logout();
      setIsLoading(false);
      return false;
    } catch (error) {
      // Invalid user data
      logout();
      setIsLoading(false);
      return false;
    }
  };

  // Check for existing auth on app load
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  // Session expiry check interval
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        checkSessionExpiry();
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Reset session timer on user activity
  useEffect(() => {
    if (isAuthenticated) {
      const handleActivity = () => {
        if (!sessionWarning) {
          resetSessionTimer();
        }
      };

      // Listen for user activity
      window.addEventListener("mousedown", handleActivity);
      window.addEventListener("keydown", handleActivity);
      window.addEventListener("scroll", handleActivity);

      return () => {
        window.removeEventListener("mousedown", handleActivity);
        window.removeEventListener("keydown", handleActivity);
        window.removeEventListener("scroll", handleActivity);
      };
    }
  }, [isAuthenticated, sessionWarning]);

  // Store user data when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("userData", JSON.stringify(user));
      console.log("Saved userData:", localStorage.getItem("userData"));
    } else {
      localStorage.removeItem("userData");
    }
  }, [user]);

  // Auto-clear messages after timeout
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Update profile function
  const updateProfile = async (profileData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedUser = {
        ...user,
        ...profileData,
        updatedAt: new Date().toISOString(),
      };

      setUser(updatedUser);
      setSuccessMessage("Profile updated successfully!");

      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage =
        error.message || "Profile update failed. Please try again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Password change function
  const changePassword = async (passwordData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!passwordData.currentPassword) {
        throw new Error("Current password is required.");
      }

      if (passwordData.newPassword.length < 8) {
        throw new Error("New password must be at least 8 characters long.");
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error("New passwords do not match.");
      }

      setSuccessMessage("Password changed successfully!");
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.message || "Password change failed. Please try again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Request password reset
  const requestPasswordReset = async (email) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        throw new Error("Please enter a valid email address.");
      }

      setSuccessMessage("Password reset instructions sent to your email.");
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.message || "Password reset request failed. Please try again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    successMessage,
    redirectPath,
    sessionWarning,
    sessionExpiry,

    // Actions
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    validateSession,

    // Session Management
    extendSession,
    checkSessionExpiry,
    resetSessionTimer,

    // Utilities
    clearError,
    clearSuccessMessage,
    setAuthRedirect,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context with enhanced features
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

// Additional auth utilities
export const AuthError = class extends Error {
  constructor(message, code = null) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
};

export default AuthContext;
