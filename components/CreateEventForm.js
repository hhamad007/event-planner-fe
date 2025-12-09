"use client";

import { useState } from "react";
// import { createEvent } from '@/utils/api';
import { eventsAPI } from "@/utils/api";
import LocationPicker from "./LocationPicker";

export default function CreateEventForm() {
  const [form, setForm] = useState({
    title: "",
    date: "",
    venue: "",
    description: "",
    location: null,
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await eventsAPI.create(FormData);
      if (res) alert(" Event created successfully!");
    } catch (err) {
      alert(" Failed to create event.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="create-event-form">
      <h2>Create Event</h2>

      <input
        type="text"
        placeholder="Event Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <input
        type="datetime-local"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Venue / Address"
        value={form.venue}
        onChange={(e) => setForm({ ...form, venue: e.target.value })}
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? "Creating..." : "Create Event"}
      </button>
    </form>
  );
}
