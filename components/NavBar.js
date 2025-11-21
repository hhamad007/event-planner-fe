"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const NavBar = () => {
  const { user, logout } = useAuth();
  console.log("NavBar user:", user);

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
              className="navbar-pill-btn navbar-login-btn"
              style={{ marginLeft: "18px" }}
            >
              Home
            </button>
          </Link>
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
