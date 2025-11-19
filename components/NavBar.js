"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Card } from "./ui/card";
import AuthModal from "./AuthModal";

const FancyLogo = () => (
  <div className="flex items-center gap-2">
    <Avatar>
      <AvatarFallback className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-black font-bold">
        EP
      </AvatarFallback>
    </Avatar>
    <span className="text-3xl font-extrabold tracking-wide drop-shadow-lg">
      <span className="text-yellow-400">Event</span>
      <span className="text-pink-500">Planner</span>
    </span>
  </div>
);

const NavBar = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  // Open modal with desired mode
  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  // Close modal
  const closeAuthModal = () => setShowAuthModal(false);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b-4 border-yellow-400 bg-gradient-to-r from-black via-purple-900 to-black shadow-2xl">
        <Card className="max-w-7xl mx-auto flex items-center justify-between py-5 px-8 bg-black/80 border border-gray-700 rounded-b-xl">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-90 transition"
          >
            <FancyLogo />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-white hover:text-pink-500 font-medium transition"
            >
              Dashboard
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-purple-400 font-medium transition"
            >
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4 ml-auto">
        
              <Button
              onClick={() => {
                openAuthModal("login");
                console.log("Login clicked");
              }}
              >
                Login
              </Button>
           
           
              <Button
              onClick={() => {
                openAuthModal("register");
                console.log("Sign Up clicked");
              }}
              >
                Sign Up
              </Button>
           
          </div>
        </Card>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={closeAuthModal}
        mode={authMode}
      />
    </>
  );
};

export default NavBar;
