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

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

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

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold"
              onClick={() => openAuthModal("login")}
            >
              Login
            </Button>

            <Button
              variant="default"
              className="bg-pink-500 text-white hover:bg-yellow-400 hover:text-black font-semibold"
              onClick={() => openAuthModal("register")}
            >
              Sign Up
            </Button>
          </div>
        </Card>
      </nav>

      {/* Auth Modal (NO Dialog wrapper!) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={closeAuthModal}
        mode={authMode}
      />
    </>
  );
};

export default NavBar;
