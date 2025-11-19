"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authAPI } from "@/utils/api";

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
  const [portalContainer, setPortalContainer] = useState(null);

  useEffect(() => {
    setAuthMode(mode);
  }, [mode]);

  useEffect(() => {
    console.log("AuthModal isOpen:", isOpen);
  }, [isOpen]);

  useEffect(() => {
    const el = document.getElementById("modal-root") || document.body;
    setPortalContainer(el);
  }, []);

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

  const login = async (email, password) => {
    const res = authAPI.login({email: email, password: password});
  };

  const register = async (firstName, lastName, email, password) => {
    const res =  authAPI.register(firstName, lastName, email, password);
    console.log("Registration response:", res);
  };  

  const handleSubmit = (e) => {
    e.preventDefault();
    authMode === "login"
        ? login(form.email,form.password)
        : register(form.firstName,form.lastName,form.email,form.password);

    onClose();
  };

  const isLogin = authMode === "login";

  return (
    <>
      {portalContainer &&
        createPortal(
          // only render wrapper when open
          isOpen && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center">
              {/* backdrop */}
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
              />
              {/* modal content */}
              <div
                className="relative z-[100000] w-full max-w-lg mx-4 bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-6"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth-modal-title"
                aria-describedby="auth-modal-desc"
              >
                <header className="mb-4">
                  <h2 id="auth-modal-title" className="text-xl font-semibold">
                    {isLogin ? "Login" : "Sign Up"}
                  </h2>
                  <p id="auth-modal-desc" className="text-sm text-muted-foreground">
                    {isLogin
                      ? "Enter your email and password to log in."
                      : "Fill in your details to create a new account."}
                  </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  {!isLogin && (
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>
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
              </div>
            </div>
          ),
          portalContainer
        )}
    </>
  );
}
