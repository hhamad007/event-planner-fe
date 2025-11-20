"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";

const NavBar = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <div className="navbar-inner">
        {user ? (
          <>
            <span className="navbar-user">{user.firstName || user.email}</span>
            <Button onClick={logout}>Logout</Button>
          </>
        ) : (
          <>
            <Link href="/login" passHref>
              <Button className="navbar-btn-space">Login</Button>
            </Link>
            <Link href="/signup" passHref>
              <Button>Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
