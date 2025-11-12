'use client';

import { useEffect, useState } from 'react';
import { getAllEvents } from '@/utils/api';  
import EventCard from '@/components/EventCard';

export default function HomePage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function loadEvents() {
      const data = await getAllEvents();
      setEvents(data || []);
    }
    loadEvents();
  }, []);

  return (
    <main className="home-container">
      <h1 className="home-title">Discover Events</h1>
      <section className="event-grid">
        {events.length > 0 ? (
          events.map((event, idx) => <EventCard key={idx} event={event} />)
        ) : (
          <p>No events found.</p>
        )}
      </section>
    </main>
  );
}
