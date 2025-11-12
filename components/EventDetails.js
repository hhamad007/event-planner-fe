'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getEventById } from '@/utils/api';
import AttendeeList from './AttendeeList';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  //  Fetch single event details
  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await getEventById(id);
        if (!res) throw new Error('Event not found');
        setEvent(res);
      } catch (err) {
        console.error(err);
        setError('❌ Unable to load event.');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchEvent();
  }, [id]);

  //  Handle Join Event (RSVP)
  const handleJoin = async () => {
    setJoining(true);
    try {
      // Placeholder — integrate POST /events/:id/join if available
      alert(' RSVP joined successfully!');
      setJoined(true);
    } catch {
      alert(' Failed to join event');
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <p className="loading-text">Loading event...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!event) return <p className="no-events-text">No event found.</p>;

  return (
    <section className="event-details-container">
      {/* === Event Image === */}
      <div className="event-details-header">
        <img
          src={event.image || 'https://dummyimage.com/800x400/edeaff/bfa2ff.png&text=Event'}
          alt={event.title}
          className="event-details-image"
        />
      </div>

      {/* === Event Info === */}
      <div className="event-details-content">
        <h1 className="event-details-title">{event.title}</h1>

        <p className="event-details-meta">
          📅 {event.date} • 🕒 {event.time} • 📍 {event.location}
        </p>

        <p className="event-details-description">{event.description}</p>

        {/* === Join Event Button === */}
        <button
          className={`join-btn ${joined ? 'joined' : ''}`}
          onClick={handleJoin}
          disabled={joined || joining}
        >
          {joining
            ? 'Joining...'
            : joined
            ? '✔ Joined'
            : 'Join Event'}
        </button>

        {/* === Attendees === */}
        <AttendeeList attendees={event.attendees || []} />
      </div>
    </section>
  );
}
