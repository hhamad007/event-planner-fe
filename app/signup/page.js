"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authAPI } from "@/utils/api";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    bio: "",
    location: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await authAPI.register({
        name: form.firstName + " " + form.lastName,
        email: form.email,
        password: form.password,
        phone: form.phone,
        bio: form.bio,
        location: form.location,
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f7fa",
      }}
    >
      <div
        style={{
          maxWidth: 400,
          width: "100%",
          padding: 32,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          color: "#101014",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            marginBottom: 24,
            textAlign: "center",
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <Label>First Name</Label>
              <Input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                  fontSize: "1rem",
                  background: "#f9fafb",
                  color: "#101014",
                  outline: "none",
                  marginBottom: 2,
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Label>Last Name</Label>
              <Input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                  fontSize: "1rem",
                  background: "#f9fafb",
                  color: "#101014",
                  outline: "none",
                  marginBottom: 2,
                }}
              />
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <Label
              style={{ display: "block", marginBottom: 6, fontWeight: 500 }}
            >
              Email
            </Label>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                fontSize: "1rem",
                background: "#f9fafb",
                color: "#101014",
                outline: "none",
                marginBottom: 2,
              }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <Label
              style={{ display: "block", marginBottom: 6, fontWeight: 500 }}
            >
              Password
            </Label>
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                fontSize: "1rem",
                background: "#f9fafb",
                color: "#101014",
                outline: "none",
                marginBottom: 2,
              }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                fontSize: "1rem",
                background: "#f9fafb",
                color: "#101014",
                outline: "none",
                marginBottom: 2,
              }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Label>Phone</Label>
            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                fontSize: "1rem",
                background: "#f9fafb",
                color: "#101014",
                outline: "none",
                marginBottom: 2,
              }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Label>Bio</Label>
            <Input
              name="bio"
              value={form.bio}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                fontSize: "1rem",
                background: "#f9fafb",
                color: "#101014",
                outline: "none",
                marginBottom: 2,
              }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Label>Location</Label>
            <Input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                fontSize: "1rem",
                background: "#f9fafb",
                color: "#101014",
                outline: "none",
                marginBottom: 2,
              }}
            />
          </div>
          {error && (
            <div
              style={{ color: "red", marginBottom: 16, textAlign: "center" }}
            >
              {error}
            </div>
          )}
          <Button
            type="submit"
            style={{
              width: "100%",
              padding: "12px 0",
              fontSize: "1rem",
              borderRadius: 6,
              fontWeight: 600,
              marginTop: 8,
            }}
          >
            Sign Up
          </Button>
        </form>
        <div style={{ marginTop: 24, textAlign: "center", fontSize: "1rem" }}>
          <span>Already have an account? </span>
          <Link
            href="/login"
            style={{
              color: "#6B21A8",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
