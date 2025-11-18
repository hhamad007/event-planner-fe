"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Loader2, Calendar, Eye, EyeOff } from "lucide-react";

export default function AuthModal({ isOpen, onClose, mode = "login" }) {
  const { login, signup, isLoading, error, clearError } = useAuth();

  const [authMode, setAuthMode] = useState(mode);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
  });

  useEffect(() => setAuthMode(mode), [mode]);

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      confirmPassword: "",
    });
    clearError();
  }, [isOpen, authMode, clearError]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (authMode === "login") {
      await login({
        email: form.email,
        password: form.password,
      });
    } else {
      if (form.password !== form.confirmPassword) {
        alert("Passwords must match.");
        return;
      }
      await signup({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
    }
  };

  const isLogin = authMode === "login";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-black border border-neutral-800 text-white">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>

          <DialogTitle className="text-2xl font-bold">
            {isLogin ? "Welcome Back" : "Create Account"}
          </DialogTitle>

          <p className="text-neutral-400 text-sm mt-1">
            {isLogin
              ? "Log in to continue planning your events"
              : "Register to start creating amazing events"}
          </p>
        </DialogHeader>

        {error && (
          <p className="text-red-500 bg-red-900/20 border border-red-700 px-3 py-2 rounded-md text-sm">
            {error}
          </p>
        )}

        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>First Name</Label>
                  <Input
                    className="bg-neutral-900 text-white border-neutral-700"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>Last Name</Label>
                  <Input
                    className="bg-neutral-900 text-white border-neutral-700"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <Label>Email</Label>
            <Input
              className="bg-neutral-900 text-white border-neutral-700"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <Label>Password</Label>
            <div className="relative">
              <Input
                className="bg-neutral-900 text-white border-neutral-700"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <Label>Confirm Password</Label>
              <Input
                className="bg-neutral-900 text-white border-neutral-700"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
          )}

          <Button
            disabled={isLoading}
            className="w-full bg-white text-black font-semibold hover:bg-neutral-200 transition"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Please wait...
              </span>
            ) : isLogin ? (
              "Log In"
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <p className="text-center text-neutral-400 text-sm mt-4">
          {isLogin ? "Don't have an account?" : "Already registered?"}{" "}
          <button
            className="underline text-white"
            onClick={() => setAuthMode(isLogin ? "register" : "login")}
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
