'use client';

import { useEffect, useState } from 'react';
import { getNearbyEvents } from '@/utils/api';
import EventCard from '@/components/EventCard';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await getNearbyEvents();
        setEvents(data || []);
      } catch (err) {
        console.error('Failed to load events', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="home-container">
      {loading ? (
        <p className="loading">Loading events...</p>
      ) : events.length > 0 ? (
        <div className="event-grid-container">
          <div className="event-grid">
            {events.map((event, index) => (
              <EventCard key={index} event={event} />
            ))}
          </div>
        </div>
      ) : (
        <p className="no-events">No events found nearby.</p>
      )}
    </div>
  );
}
