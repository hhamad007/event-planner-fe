"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const NavBar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isDashboard = pathname === "/dashboard";

  useEffect(() => {
    console.log("NavBar user changed:", user);
  }, [user]);

  return (
    <nav className="navbar-fancy">
      <div className="navbar-fancy-inner">
        <span className="navbar-logo-fancy">
          <span className="navbar-logo-icon">🎉</span>
          <span className="navbar-logo-text">EventSocial</span>
          <Link href="/" passHref>
            <button
              className={`navbar-pill-btn navbar-login-btn${
                isHome ? " active" : ""
              }`}
              aria-label="Go to Home"
              style={{ marginLeft: "18px" }}
            >
              Home
            </button>
          </Link>
          {user && (
            <Link href="/dashboard" passHref>
              <button
                className={`navbar-pill-btn navbar-login-btn${
                  isDashboard ? " active" : ""
                }`}
                aria-label="Go to Dashboard"
                style={{ marginLeft: "8px" }}
              >
                Dashboard
              </button>
            </Link>
          )}
        </span>
        <div className="navbar-actions-fancy">
          {user ? (
            <>
              <span className="navbar-user-fancy">
                {user.firstName || user.email}
              </span>
              <button
                className="navbar-pill-btn navbar-logout-btn"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" passHref>
                <button className="navbar-pill-btn navbar-login-btn">
                  Login
                </button>
              </Link>
              <Link href="/signup" passHref>
                <button className="navbar-pill-btn navbar-signup-btn">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
