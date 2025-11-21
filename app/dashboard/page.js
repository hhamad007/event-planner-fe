"use client";

import { useAuth } from "@/context/AuthContext"; // <-- Import useAuth
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authAPI, eventsAPI } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth(); // <-- Use context
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "",
    location: { address: "", city: "", postCode: "" },
    category: "",
    maxAttendees: "",
    price: "",
    currency: "",
    tags: "",
    image: null,
  });
  const [error, setError] = useState("");
  const router = useRouter();

  function handleChange(e) {
    const { name, value } = e.target;
    if (["address", "city", "postCode"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      // Prepare FormData for multipart/form-data
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append(
        "date",
        new Date(form.date + "T" + form.time).toISOString()
      );
      formData.append("time", form.time);
      formData.append("duration", Number(form.duration));
      formData.append("category", form.category);
      formData.append("maxAttendees", Number(form.maxAttendees));
      formData.append("price", Number(form.price));
      formData.append("currency", form.currency);
      formData.append(
        "tags",
        JSON.stringify(form.tags.split(",").map((tag) => tag.trim()))
      );
      formData.append("location", JSON.stringify(form.location));
      if (form.image) {
        formData.append("image", form.image);
      }

      // Send to backend (make sure your eventsAPI.create uses FormData)
      const response = await eventsAPI.create(formData);
      console.log("API response:", response);

      setShowForm(false);
      setForm({
        title: "",
        description: "",
        date: "",
        time: "",
        duration: "",
        location: { address: "", city: "", postCode: "" },
        category: "",
        maxAttendees: "",
        price: "",
        currency: "",
        tags: "",
        image: null,
      });
    } catch (err) {
      console.error("Error creating event:", err);
      if (err.response) {
        console.log("Backend error response:", err.response.data);
        setError(
          err.response.data.message ||
            "Failed to create event. Please check your input."
        );
      } else {
        setError("Failed to create event.");
      }
    }
  }

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
          maxWidth: 500,
          width: "100%",
          padding: 32,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          color: "#101014",
          border: "1px solid #e5e7eb",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "#2563eb",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Welcome, {user && user.name ? user.name : "Guest"}!
        </h1>
        <p
          style={{
            margin: "16px 0 32px",
            color: "#555",
            fontSize: "1.1rem",
            textAlign: "center",
          }}
        >
          {user
            ? "Plan your next event with ease. Fill out the details below to create a new event."
            : "Please log in to create events."}
        </p>
        {user && !showForm && (
          <Button
            onClick={() => setShowForm(true)}
            style={{
              width: "100%",
              fontSize: "1.1rem",
              padding: "12px 0",
              background: "linear-gradient(90deg,#2563eb,#6b21a8)",
              color: "#fff",
              borderRadius: 8,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            + Create Event
          </Button>
        )}
        {showForm && (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <Label
                style={{ display: "block", marginBottom: 6, fontWeight: 500 }}
              >
                Event Title
              </Label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. London Meetup"
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
                Description
              </Label>
              <Input
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                placeholder="Brief description of your event"
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
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <Label
                  style={{ display: "block", marginBottom: 6, fontWeight: 500 }}
                >
                  Date
                </Label>
                <Input
                  type="date"
                  name="date"
                  value={form.date}
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
                <Label
                  style={{ display: "block", marginBottom: 6, fontWeight: 500 }}
                >
                  Time
                </Label>
                <Input
                  type="time"
                  name="time"
                  value={form.time}
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
                Duration (hours)
              </Label>
              <Input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                required
                min={1}
                placeholder="e.g. 2"
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
                Address
              </Label>
              <Input
                name="address"
                value={form.location.address}
                onChange={handleChange}
                required
                placeholder="e.g. 123 Main St"
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
                City
              </Label>
              <Input
                name="city"
                value={form.location.city}
                onChange={handleChange}
                required
                placeholder="e.g. London"
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
                Post Code
              </Label>
              <Input
                name="postCode"
                value={form.location.postCode}
                onChange={handleChange}
                required
                placeholder="e.g. SW1A 1AA"
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
                Category
              </Label>
              <select
                name="category"
                value={form.category}
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
              >
                <option value="">Select category</option>
                <option value="social">Social</option>
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="sports">Sports</option>
                <option value="music">Music</option>
                <option value="business">Business</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <Label
                style={{ display: "block", marginBottom: 6, fontWeight: 500 }}
              >
                Max Attendees
              </Label>
              <Input
                type="number"
                name="maxAttendees"
                value={form.maxAttendees}
                onChange={handleChange}
                required
                min={1}
                placeholder="e.g. 50"
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
                Price
              </Label>
              <Input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min={0}
                placeholder="e.g. 0"
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
                Currency
              </Label>
              <Input
                name="currency"
                value={form.currency}
                onChange={handleChange}
                required
                placeholder="e.g. GBP"
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
                Tags (comma separated)
              </Label>
              <Input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="e.g. meetup,networking"
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
                Event Image
              </Label>
              <Input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, image: e.target.files[0] }))
                }
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
                background: "linear-gradient(90deg,#2563eb,#6b21a8)",
                color: "#fff",
              }}
            >
              Create Event
            </Button>
            <Button
              type="button"
              style={{
                width: "100%",
                padding: "12px 0",
                fontSize: "1rem",
                borderRadius: 6,
                fontWeight: 600,
                marginTop: 8,
                background: "#eee",
                color: "#333",
              }}
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
