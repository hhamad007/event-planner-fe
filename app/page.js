"use client";

import { useEffect, useState } from "react";
import EventGrid from "@/components/EventGrid";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("http://localhost:5001/api/events");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data.events || data); // depends on backend structure
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Unable to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F6FF]">
      <main className="max-w-7xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Loading events...</p>
        ) : error ? (
          <p className="text-center text-red-500 mt-10">{error}</p>
        ) : (
          <EventGrid events={events} />
        )}
      </main>
    </div>
  );
}
