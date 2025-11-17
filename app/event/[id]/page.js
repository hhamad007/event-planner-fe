'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getEventById } from '@/utils/api';
import MapComponent from '@/components/MapComponent';

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      if (!id) return;
      setLoading(true);
      const data = await getEventById(id);
      setEvent(data);
      setLoading(false);
    }
    fetchEvent();
  }, [id]);

  if (loading) return <div className="loading-text">Loading event details...</div>;

  if (!event)
    return (
      <div className="no-events-text">
        Event not found. Please check if it still exists.
      </div>
    );

  return (
    <main className="event-details-container">
      {/* Header Section */}
      <header className="event-header">
        <h1 className="event-title">{event.title}</h1>
        <p className="event-date">
          {new Date(event.date).toLocaleString()}
        </p>
        <p className="event-location">{event.venue || 'Location not specified'}</p>
      </header>

      {/* Image */}
      {event.image && (
        <div className="event-image-wrapper">
          <img src={event.image} alt={event.title} className="event-image" />
        </div>
      )}

      {/* Description */}
      <section className="event-description">
        <h3>About this event</h3>
        <p>{event.description || 'No description provided.'}</p>
      </section>

      {/* Map (if location exists) */}
      {event.location && (
        <section className="event-map">
          <h3>📍 Event Location</h3>
          <MapComponent events={[event]} selectedEvent={event} />
        </section>
      )}
    </main>
  );
}
