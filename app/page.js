"use client";

import { useEffect, useState } from "react";
import { eventsAPI } from "@/utils/api";
import EventGrid from "@/components/EventGrid";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      const res = await eventsAPI.getAll();
      setEvents(res?.data || []);
      setLoading(false);
    }
    loadEvents();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center py-24 px-6 bg-gradient-to-b from-black via-gray-900 to-gray-800">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white text-center drop-shadow-lg">
          Welcome to <span className="text-gray-300">EventPlanner</span>
        </h1>
        <p className="text-lg text-gray-400 mb-10 text-center max-w-2xl">
          Discover, create, and manage events with ease. Your professional event planning platform.
        </p>
      </section>

      {/* EVENTS SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Upcoming Events</h2>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 shadow-xl">
          {loading ? (
            <div className="text-center text-gray-400 py-10">
              Loading events...
            </div>
          ) : events.length > 0 ? (
            <EventGrid events={events} />
          ) : (
            <div className="text-center text-gray-500 py-10">
              No events yet. Be the first to create one!
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-gray-500 text-center py-8 border-t border-gray-800">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} EventPlanner &mdash; All Rights Reserved
        </p>
      </footer>
    </main>
  );
}