"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { eventsAPI } from "@/utils/api";
import Image from "next/image";

// Dummy user data (replace with real user context or API)
const user = {
  name: "Neil Armstrong",
  email: "neil@example.com",
};

export default function DashboardPage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "",
    location: {
      address: "",
      city: "",
      postCode: "",
    },
    category: "",
    maxAttendees: "",
    price: "",
    currency: "",
    tags: "",
    image: null,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch organiser's events
    async function fetchMyEvents() {
      try {
        const res = await eventsAPI.getMyEvents();
        setEvents(res.data || []);
      } catch (err) {
        // handle error
      }
    }
    fetchMyEvents();
  }, []);

  // Filter events by search
  const filteredEvents = events.filter(
    (event) =>
      event.title?.toLowerCase().includes(search.toLowerCase()) ||
      event.location?.toLowerCase().includes(search.toLowerCase())
  );

  // Handle create event form change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // If field is part of location, update nested object
    if (["address", "city", "postCode"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
        },
      }));
      return;
    }

    // Regular fields
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle create event form submit
  const handleSubmit = async (e) => {
    console.log(form);
    e.preventDefault();
    if (
      !form.title ||
      !form.description ||
      !form.date ||
      !form.time ||
      !form.duration ||
      !form.location.address ||
      !form.location.city ||
      !form.location.postCode ||
      !form.category ||
      !form.maxAttendees ||
      !form.price ||
      !form.currency
    ) {
      setError("Please fill all required fields.");
      return;
    }
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("date", form.date);
      formData.append("time", form.time);
      formData.append("duration", Number(form.duration));
      formData.append("category", form.category);
      formData.append("maxAttendees", Number(form.maxAttendees));
      formData.append("price", Number(form.price));
      formData.append("currency", form.currency);
      formData.append(
        "tags",
        JSON.stringify(
          form.tags
            ?.split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        )
      );
      if (form.image) formData.append("image", form.image);

      // For nested location object, stringify it
      formData.append(
        "location",
        JSON.stringify({
          address: form.location.address,
          city: form.location.city,
          postCode: form.location.postCode,
        })
      );

      await eventsAPI.createEvent(formData); // Make sure your API client sends FormData

      setShowCreateForm(false);
      setForm({
        title: "",
        description: "",
        date: "",
        time: "",
        duration: "",
        location: {
          address: "",
          city: "",
          postCode: "",
        },
        category: "",
        maxAttendees: "",
        price: "",
        currency: "",
        tags: "",
        image: null,
      });
    } catch (err) {
      setError("Failed to create event.");
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      {/* Dashboard Header */}
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#101014" }}>
          Welcome, {user.name}!
        </h1>
        <p style={{ color: "#555", marginTop: 8 }}>
          Manage your events, create new ones, and view their locations.
        </p>
      </header>

      {/* Create Event Button */}
      <div style={{ marginBottom: 24 }}>
        <Button onClick={() => setShowCreateForm(true)}>+ Create Event</Button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: 24 }}>
        <Input
          placeholder="Search events by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            maxWidth: 400,
            color: "#101014",
            background: "#f9fafb",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            padding: "10px 12px",
            fontSize: "1rem",
          }}
        />
      </div>

      {/* Create Event Form Modal */}
      {showCreateForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fafafa",
            padding: 24,
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            marginBottom: 32,
            color: "#101014",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              marginBottom: 16,
              textAlign: "center",
              color: "#101014",
            }}
          >
            Create New Event
          </h2>
          <div style={{ marginBottom: 12 }}>
            <Label
              style={{
                display: "block",
                marginBottom: 6,
                fontWeight: 500,
                color: "#101014",
              }}
            >
              Event Name
            </Label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                fontSize: "1rem",
                background: "#fff",
                color: "#101014",
                outline: "none",
                marginBottom: 2,
              }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Label
              style={{
                display: "block",
                marginBottom: 6,
                fontWeight: 500,
                color: "#101014",
              }}
            >
              Description
            </Label>
            <Input
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                fontSize: "1rem",
                background: "#fff",
                color: "#101014",
                outline: "none",
                marginBottom: 2,
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <Label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 500,
                  color: "#101014",
                }}
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
                  background: "#fff",
                  color: "#101014",
                  outline: "none",
                  marginBottom: 2,
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 500,
                  color: "#101014",
                }}
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
                  background: "#fff",
                  color: "#101014",
                  outline: "none",
                  marginBottom: 2,
                }}
              />
            </div>
          </div>
          {/* Location fields */}
          <div style={{ marginBottom: 12 }}>
            <Label
              style={{
                display: "block",
                marginBottom: 6,
                fontWeight: 500,
                color: "#101014",
              }}
            >
              Address
            </Label>
            <Input
              name="address"
              value={form.location.address || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  location: { ...f.location, address: e.target.value },
                }))
              }
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                fontSize: "1rem",
                background: "#fff",
                color: "#101014",
                outline: "none",
                marginBottom: 2,
              }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Label
              style={{
                display: "block",
                marginBottom: 6,
                fontWeight: 500,
                color: "#101014",
              }}
            >
              City
            </Label>
            <Input
              name="city"
              value={form.location.city || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  location: { ...f.location, city: e.target.value },
                }))
              }
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                fontSize: "1rem",
                background: "#fff",
                color: "#101014",
                outline: "none",
                marginBottom: 2,
              }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Label
              style={{
                display: "block",
                marginBottom: 6,
                fontWeight: 500,
                color: "#101014",
              }}
            >
              Post Code
            </Label>
            <Input
              name="postCode"
              value={form.location.postCode || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  location: { ...f.location, postCode: e.target.value },
                }))
              }
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                fontSize: "1rem",
                background: "#fff",
                color: "#101014",
                outline: "none",
                marginBottom: 2,
              }}
            />
          </div>
          {/* Duration */}
          <div style={{ marginBottom: 12 }}>
            <Label
              style={{
                display: "block",
                marginBottom: 6,
                fontWeight: 500,
                color: "#101014",
              }}
            >
              Duration (hours)
            </Label>
            <Input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                fontSize: "1rem",
                background: "#fff",
                color: "#101014",
                outline: "none",
                marginBottom: 2,
              }}
            />
          </div>
          {/* Price */}
          <div style={{ marginBottom: 12 }}>
            <Label
              style={{
                display: "block",
                marginBottom: 6,
                fontWeight: 500,
                color: "#101014",
              }}
            >
              Price
            </Label>
            <Input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                fontSize: "1rem",
                background: "#fff",
                color: "#101014",
                outline: "none",
                marginBottom: 2,
              }}
            />
          </div>
          {/* Currency */}
          <div style={{ marginBottom: 12 }}>
            <Label
              style={{
                display: "block",
                marginBottom: 6,
                fontWeight: 500,
                color: "#101014",
              }}
            >
              Currency
            </Label>
            <Input
              name="currency"
              value={form.currency}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                fontSize: "1rem",
                background: "#fff",
                color: "#101014",
                outline: "none",
                marginBottom: 2,
              }}
            />
          </div>
          {/* Tags (comma separated) */}
          <div style={{ marginBottom: 12 }}>
            <Label
              style={{
                display: "block",
                marginBottom: 6,
                fontWeight: 500,
                color: "#101014",
              }}
            >
              Tags
            </Label>
            <Input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="e.g. technology,innovation,AI"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                fontSize: "1rem",
                background: "#fff",
                color: "#101014",
                outline: "none",
                marginBottom: 2,
              }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Label
              style={{
                display: "block",
                marginBottom: 6,
                fontWeight: 500,
                color: "#101014",
              }}
            >
              Image (optional)
            </Label>
            <Input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                fontSize: "1rem",
                background: "#fff",
                color: "#101014",
                outline: "none",
                marginBottom: 2,
              }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Label
              style={{
                display: "block",
                marginBottom: 6,
                fontWeight: 500,
                color: "#101014",
              }}
            >
              Max Attendees
            </Label>
            <Input
              type="number"
              name="maxAttendees"
              value={form.maxAttendees}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                fontSize: "1rem",
                background: "#fff",
                color: "#101014",
                outline: "none",
                marginBottom: 2,
              }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <Label
              style={{
                display: "block",
                marginBottom: 6,
                fontWeight: 500,
                color: "#101014",
              }}
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
                background: "#fff",
                color: "#101014",
                outline: "none",
                marginBottom: 2,
              }}
            >
              <option value="">Select category</option>
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
              <option value="social">Social</option>
              <option value="sports">Sports</option>
              <option value="music">Music</option>
              <option value="business">Business</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>
          {error && (
            <div style={{ color: "red", marginBottom: 12 }}>{error}</div>
          )}
          <Button type="submit" style={{ width: "100%", marginTop: 8 }}>
            Create Event
          </Button>
          <Button
            type="button"
            style={{
              width: "100%",
              marginTop: 8,
              background: "#eee",
              color: "#333",
            }}
            onClick={() => setShowCreateForm(false)}
          >
            Cancel
          </Button>
        </form>
      )}

      {/* Events List/Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 24,
          marginBottom: 32,
        }}
      >
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            style={{
              background: "#fff",
              borderRadius: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              padding: 18,
              cursor: "pointer",
              border:
                selectedEvent?.id === event.id
                  ? "2px solid #6B21A8"
                  : "1px solid #e5e7eb",
              color: "#101014",
            }}
            onClick={() => setSelectedEvent(event)}
          >
            {/* Render image if available */}
            {event.image?.url && (
              <Image
                src={event.image.url}
                alt={event.title}
                style={{ width: "100%", borderRadius: 8, marginBottom: 8 }}
              />
            )}
            <h3
              style={{ fontWeight: 600, fontSize: "1.1rem", color: "#101014" }}
            >
              {event.title}
            </h3>
            <div style={{ color: "#555", marginBottom: 4 }}>
              {typeof event.location === "object"
                ? `${event.location.address}, ${event.location.city}, ${event.location.postCode}`
                : event.location}
            </div>
            <div style={{ fontSize: "0.95rem" }}>
              {event.date} {event.time}
            </div>
            <div style={{ fontSize: "0.95rem", color: "#6B21A8" }}>
              {event.category}
            </div>
            <div style={{ fontSize: "0.95rem", color: "#333" }}>
              Max Attendees: {event.maxAttendees}
            </div>
          </div>
        ))}
      </div>

      {/* Event Details & Map */}
      {selectedEvent && (
        <div
          style={{
            marginTop: 32,
            padding: 24,
            background: "#f9fafb",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            color: "#101014",
          }}
        >
          {/* Render image if available */}
          {selectedEvent.image?.url && (
            <Image
              src={selectedEvent.image.url}
              alt={selectedEvent.title}
              style={{ width: "100%", borderRadius: 8, marginBottom: 8 }}
            />
          )}
          <h2
            style={{ fontSize: "1.25rem", fontWeight: 600, color: "#101014" }}
          >
            {selectedEvent.title}
          </h2>
          <p>{selectedEvent.description}</p>
          <p>
            <strong>Date:</strong> {selectedEvent.date} {selectedEvent.time}
          </p>
          <p>
            <strong>Location:</strong>{" "}
            {typeof selectedEvent.location === "object"
              ? `${selectedEvent.location.address}, ${selectedEvent.location.city}, ${selectedEvent.location.postCode}`
              : selectedEvent.location}
          </p>
          <p>
            <strong>Category:</strong> {selectedEvent.category}
          </p>
          <p>
            <strong>Max Attendees:</strong> {selectedEvent.maxAttendees}
          </p>
          {/* TODO: Add map component here */}
          <Button
            style={{ marginTop: 16 }}
            onClick={() => setSelectedEvent(null)}
          >
            Close Details
          </Button>
        </div>
      )}
    </div>
  );
}
