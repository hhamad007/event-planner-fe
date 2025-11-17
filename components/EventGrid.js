"use client";

import EventCard from "./EventCard";

export default function EventGrid({ events = [], onSelect }) {
  const buildEvents = () => {
    return events.map((event, index) => {
      return (
        <div key={index}>
          <EventCard key={index} event={event} onSelect={onSelect} />
        </div>
      );
    });
  };

  return (
    <section className="event-grid-container">
      <div className="event-grid">
        {Array.isArray(events) && events.length > 0 ? (
          buildEvents()
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </section>
  );
}
