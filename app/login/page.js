"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await login(form.email, form.password);
      if (result.success) {
        setTimeout(() => router.push("/dashboard"), 100);
      } else {
        setError(result.message || "Login failed.");
        console.log("Login failed message:", result.message); // Log error from context
      }
    } catch (error) {
      console.log("Login error (catch):", error); // Log raw error object
      setError(error?.response?.data?.message || "Login failed");
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
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <Label
              style={{
                display: "block",
                marginBottom: 6,
                fontWeight: 500,
              }}
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
              style={{
                display: "block",
                marginBottom: 6,
                fontWeight: 500,
              }}
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
          {error && (
            <div
              style={{
                color: "red",
                marginBottom: 16,
                textAlign: "center",
              }}
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
            Login
          </Button>
        </form>
        <div
          style={{
            marginTop: 24,
            textAlign: "center",
            fontSize: "1rem",
          }}
        >
          <span style={{ whiteSpace: "nowrap" }}>
            Don&#39;t have an account?{" "}
          </span>
          <Link
            href="/signup"
            style={{
              color: "#6B21A8",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
