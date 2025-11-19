"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthModal({ isOpen, onClose, mode = "login" }) {
  const [authMode, setAuthMode] = useState(mode);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setAuthMode(mode);
  }, [mode]);

  useEffect(() => {
    if (isOpen) {
      setForm({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        confirmPassword: "",
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      authMode === "login"
        ? `Logging in as ${form.email}`
        : `Registering ${form.firstName} ${form.lastName}`
    );
    onClose();
    
  };

  const isLogin = authMode === "login";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby="auth-modal-desc">
        <DialogHeader>
          <DialogTitle>{isLogin ? "Login" : "Sign Up"}</DialogTitle>
        </DialogHeader>
        <DialogDescription id="auth-modal-desc">
          {isLogin
            ? "Enter your email and password to log in."
            : "Fill in your details to create a new account."}
        </DialogDescription>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {!isLogin && (
            <>
              <div>
                <Label>First Name</Label>
                <Input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <Button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="mt-2"
            >
              {showPassword ? "Hide" : "Show"} Password
            </Button>
          </div>
          {!isLogin && (
            <div>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <Button type="submit" className="w-full">
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>
        <div className="text-center mt-4">
          <Button
            type="button"
            variant="link"
            onClick={() => setAuthMode(isLogin ? "register" : "login")}
          >
            {isLogin
              ? "Need an account? Sign Up"
              : "Already have an account? Login"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
