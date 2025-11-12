'use client';

import { useEffect, useState } from 'react';
import EventGrid from '@/components/EventGrid';
import { getAllEvents } from '@/utils/api';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all events on load
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      const res = await getAllEvents();
      setEvents(res || []);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  return (
    <main className="home-container">
      {/* ✅ Collaborator’s NavBar will automatically appear (from layout.js) */}
      <section className="event-grid-section">
        {loading ? (
          <div className="text-center text-gray-500 mt-10">
            Loading events...
          </div>
        ) : events.length > 0 ? (
          <EventGrid events={events} />
        ) : (
          <div className="text-center text-gray-400 mt-10">
            No events yet. Be the first to create one!
          </div>
        )}
      </section>
    </main>
  );
}
