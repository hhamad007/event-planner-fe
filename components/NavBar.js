'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";
import { 
  Calendar, 
  Home, 
  PlusCircle, 
  User, 
  Settings, 
  Users, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";

/* Build the main navigation bar that shows different content for logged-in vs logged-out users. Include app logo, navigation links, and login/logout buttons. Make it responsive for mobile and desktop. */

const NavBar = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error, 
    successMessage, 
    logout, 
    clearError, 
    clearSuccessMessage 
  } = useAuth();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'signup'
  const [authModalKey, setAuthModalKey] = useState(0); // Force re-render of modal

  // Listen for authentication events from AuthContext
  useEffect(() => {
    const handleAuthChange = (event) => {
      if (event.type === 'auth:logout') {
        setShowUserMenu(false);
        setIsMobileMenuOpen(false);
        setShowAuthModal(false);
      }
    };

    window.addEventListener('auth:logout', handleAuthChange);
    return () => window.removeEventListener('auth:logout', handleAuthChange);
  }, []);

  // Auto-hide messages after a delay
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        clearSuccessMessage();
      }, 5000); // Hide success message after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccessMessage]);

  useEffect(() => {
    if (error && !showAuthModal) {
      const timer = setTimeout(() => {
        clearError();
      }, 8000); // Hide error message after 8 seconds
      return () => clearTimeout(timer);
    }
  }, [error, showAuthModal, clearError]);

  // Enhanced keyboard shortcuts for auth modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl+L or Cmd+L to open login modal
      if ((event.ctrlKey || event.metaKey) && event.key === 'l' && !isAuthenticated) {
        event.preventDefault();
        openAuthModal('login');
      }
      
      // Ctrl+R or Cmd+R to open register modal (only if not authenticated)
      if ((event.ctrlKey || event.metaKey) && event.key === 'r' && !isAuthenticated) {
        event.preventDefault();
        openAuthModal('register');
      }
      
      // Escape key to close modal
      if (event.key === 'Escape') {
        if (showAuthModal) {
          closeAuthModal();
        } else if (showUserMenu) {
          setShowUserMenu(false);
        } else if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated, showAuthModal, showUserMenu, isMobileMenuOpen]);

  // Utility function to get user display name
  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.email) {
      return user.email.split('@')[0]; // Use email username part
    }
    return 'User';
  };

  // Utility function to get user initials
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    if (user?.firstName) {
      return user.firstName.charAt(0);
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Handle logout with confirmation
  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
      setIsMobileMenuOpen(false);
      // Success message will be handled by AuthContext
    } catch (error) {
      console.error('Logout error:', error);
      // Error handling is managed by AuthContext
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Enhanced auth modal handlers
  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
    setAuthModalKey(prev => prev + 1); // Force fresh modal instance
    // Clear any existing errors when opening modal
    clearError();
    clearSuccessMessage();
    // Close other menus
    setShowUserMenu(false);
    setIsMobileMenuOpen(false);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    // Clear form-related errors when closing
    clearError();
    clearSuccessMessage();
  };

  // Handle successful authentication with enhanced feedback
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setShowUserMenu(false);
    setIsMobileMenuOpen(false);
    
    // Show welcome message for new users
    if (authModalMode === 'register' && user?.firstName) {
      // This will trigger the success message from AuthContext
      console.log(`Welcome ${user.firstName}! Your account has been created.`);
    }
    
    // Reset modal key for next time
    setAuthModalKey(prev => prev + 1);
  };

  // Handle authentication errors
  const handleAuthError = (error) => {
    console.error('Authentication error:', error);
    // Keep modal open for user to retry
    // Error display is handled by AuthModal and AuthContext
  };

  return (
    <>
      {/* Global Success/Error Messages */}
      {(successMessage || error) && (
        <div className="relative">
          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex justify-between items-center">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{successMessage}</p>
                  </div>
                </div>
                <button 
                  onClick={clearSuccessMessage} 
                  className="text-green-400 hover:text-green-600"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex justify-between items-center">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
                <button 
                  onClick={clearError} 
                  className="text-red-400 hover:text-red-600"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and brand */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">Event Planner</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/" className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </Button>

              {isAuthenticated && (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/dashboard" className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link href="/create%20event" className="flex items-center space-x-2">
                      <PlusCircle className="h-4 w-4" />
                      <span>Create Event</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link href="/dashboard" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>My Events</span>
                    </Link>
                  </Button>
                </>
              )}

              {/* Auth Section */}
              <div className="flex items-center space-x-4">
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm text-gray-500">Loading...</span>
                  </div>
                ) : isAuthenticated ? (
                  <div className="relative" data-user-menu>
                    <Button
                      variant="ghost"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-3 text-sm focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={user?.profileImage} 
                          alt={getUserDisplayName()} 
                        />
                        <AvatarFallback className="bg-indigo-600 text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:flex lg:flex-col lg:items-start">
                        <span className="font-medium text-gray-700">
                          {getUserDisplayName()}
                        </span>
                        <div className="flex items-center space-x-1">
                          {user?.isEmailVerified === false && (
                            <Badge variant="outline" className="text-xs text-orange-600">
                              Unverified
                            </Badge>
                          )}
                        </div>
                      </div>
                      <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </Button>

                    {/* User Dropdown Menu */}
                    {showUserMenu && (
                      <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none border">
                        <div className="py-2">
                          <div className="px-4 py-2 border-b">
                            <p className="text-sm font-medium text-gray-900">
                              {getUserDisplayName()}
                            </p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                            {user?.role && (
                              <div className="flex items-center mt-1">
                              </div>
                            )}
                          </div>
                          
                          <Link
                            href="/dashboard"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <User className="mr-3 h-4 w-4" />
                            My Events
                          </Link>
                          
                          <Link
                            href="/create%20event"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Edit className="mr-3 h-4 w-4" />
                            Create Event
                          </Link>
                          
                          <Separator className="my-1" />
                          <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="flex items-center w-full justify-start px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <LogOut className="mr-3 h-4 w-4" />
                            Sign out
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      onClick={() => openAuthModal('login')}
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => openAuthModal('signup')}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Home
                </Link>

                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={closeMobileMenu}
                      className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/create%20event"
                      onClick={closeMobileMenu}
                      className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Create Event
                    </Link>
                    
                    <div className="border-t border-gray-200 pt-2">
                      <div className="px-3 py-2">
                        <span className="text-sm font-medium text-gray-500">
                          Signed in as {getUserDisplayName()}
                        </span>
                       
                      </div>
                      <button
                        onClick={handleLogout}
                        className="text-red-600 hover:text-red-700 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="border-t border-gray-200 pt-2">
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        openAuthModal('login');
                      }}
                      className="text-gray-700 hover:text-indigo-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        openAuthModal('register');
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      
      {/* Enhanced Auth Modal with better integration */}
      <AuthModal 
        key={authModalKey} // Force fresh instance when key changes
        isOpen={showAuthModal}
        onClose={closeAuthModal}
        mode={authModalMode}
        onSwitchMode={(newMode) => {
          setAuthModalMode(newMode);
          clearError(); // Clear errors when switching between login/register
          clearSuccessMessage();
        }}
        onSuccess={handleAuthSuccess}
        onError={handleAuthError}
        // Pass additional context for better integration
        initialData={{
          rememberMe: false,
          redirectAfterSuccess: '/' // Could be dynamic based on where user came from
        }}
      />
    </>
  );
};

export default NavBar;


