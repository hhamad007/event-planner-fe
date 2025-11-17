/* Build the main navigation bar that shows different content for logged-in vs logged-out users. Include app logo, navigation links, and login/logout buttons. Make it responsive for mobile and desktop. */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

// Simple SVG Icons
const MenuIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UserIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogOutIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

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

      <nav className="bg-purple-200 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Logo and brand */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 text-white">
                  <CalendarIcon />
                </div>
                <span className="text-2xl font-bold text-gray-900">Event Planner</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : isAuthenticated ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 text-sm focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImage} alt={user?.firstName || user?.email} />
                      <AvatarFallback className="bg-indigo-600 text-white">
                        {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-gray-900">
                      {user?.firstName 
                        ? `${user.firstName} ${user.lastName || ''}`.trim() 
                        : user?.email || 'User'
                      }
                    </span>
                  </Button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user?.profileImage} alt={user?.firstName || user?.email} />
                            <AvatarFallback className="bg-indigo-600 text-white">
                              {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {user?.firstName 
                                ? `${user.firstName} ${user.lastName || ''}`.trim() 
                                : user?.email || 'User'
                              }
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors"
                        >
                          <UserIcon />
                          <span className="ml-3">Profile</span>
                        </Link>
                        
                        <Link
                          href="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors"
                        >
                          <CalendarIcon />
                          <span className="ml-3">My Events</span>
                        </Link>

                        <Link
                          href="/settings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors"
                        >
                          <SettingsIcon />
                          <span className="ml-3">Settings</span>
                        </Link>
                      </div>
                      
                      <Separator className="my-1" />
                      <div className="py-1">
                        <Button
                          variant="ghost"
                          onClick={handleLogout}
                          className="flex items-center w-full justify-start px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <LogOutIcon />
                          <span className="ml-3">Sign out</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.profileImage} alt={user?.firstName || user?.email} />
                        <AvatarFallback className="bg-indigo-600 text-white">
                          {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-base font-semibold text-gray-900">
                          {user?.firstName 
                            ? `${user.firstName} ${user.lastName || ''}`.trim() 
                            : user?.email || 'User'
                          }
                        </div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                  >
                    Profile
                  </Link>
                  
                  <Link
                    href="/dashboard"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                  >
                    My Events
                  </Link>
                  
                  <Link
                    href="/settings"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                  >
                    Settings
                  </Link>
                  
                  <div className="border-t border-gray-200 pt-2">
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full text-left justify-start px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Sign out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-2 px-3 py-3">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      
      <AuthModal 
        key={authModalKey} // Force fresh instance when key changes
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />
    </>
  );
};

export default Navbar;
