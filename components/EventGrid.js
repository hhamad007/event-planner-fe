'use client';

import EventCard from './EventCard';

export default function EventGrid({ events = [], loading = false }) {
  // Ensure events is always an array
  const safeEvents = Array.isArray(events) ? events : [];

  if (loading) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Loading events...
      </div>
    );
  }

  if (safeEvents.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10">
        No events available. Try adjusting your filters or create a new event.
      </div>
    );
  }

  return (
    <section className="event-grid-container">
      <div className="event-grid">
        {safeEvents.map((event, index) => (
          <EventCard key={event._id || index} event={event} />
        ))}
      </div>
    </section>
  );
}
