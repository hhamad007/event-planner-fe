'use client';

import EventCard from './EventCard';

export default function EventGrid({ events = [], onSelect }) {
  return (
    <section className="event-grid-container">
      <div className="event-grid">
        {Array.isArray(events) && events.length > 0 ? (
          events.map((event, index) => (
            <EventCard key={index} event={event} onSelect={onSelect} />
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </section>
  );
}
