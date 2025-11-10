'use client';

import EventCard from './EventCard';

export default function EventGrid({ events = [] }) {
  return (
    <section className="event-grid-container">
      <div className="event-grid">
        {events.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>
    </section>
  );
}
