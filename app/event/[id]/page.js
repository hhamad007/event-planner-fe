'use client';

import { useEffect, useState } from 'react';
import { getEventById } from '@/utils/api';
import { useParams } from 'next/navigation';

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      const result = await getEventById(id);
      setEvent(result);
      setLoading(false);
    }
    fetchEvent();
  }, [id]);

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading event...</p>;
  if (!event) return <p className="text-center mt-10 text-red-500">Event not found.</p>;

  return (
    <div className="min-h-screen bg-[#f8f6ff] px-6 py-10 flex justify-center">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-3xl w-full">
        {/* Event Image */}
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-60 object-cover rounded-xl mb-6"
          />
        )}

        {/* Title and Info */}
        <h1 className="text-3xl font-bold text-[var(--color-accent)] mb-3">
          {event.title}
        </h1>
        <p className="text-gray-600 mb-4">{event.description}</p>

        {/* Date, Time, and Location */}
        <div className="flex flex-wrap gap-6 text-sm text-gray-700 mb-6">
          <p>📅 {new Date(event.date).toLocaleDateString()}</p>
          {event.time && <p>⏰ {event.time}</p>}
          {event.location && <p>📍 {event.location}</p>}
        </div>

        {/* Organizer */}
        {event.createdBy && (
          <p className="text-sm text-gray-500 mb-6">
            Organized by <span className="font-semibold">{event.createdBy.name}</span>
          </p>
        )}

        {/* Attendees */}
        {event.attendees?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Attendees</h2>
            <div className="flex items-center gap-2 flex-wrap">
              {event.attendees.map((a, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center text-[var(--color-accent)] text-xs font-semibold"
                  title={a.name}
                >
                  {a.name.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
