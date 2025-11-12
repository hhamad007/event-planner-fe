'use client';

import MapComponent from './MapComponent';

export default function EventDetails({ event }) {
  if (!event) return <p>No event details available.</p>;

  return (
    <div className="event-details-container">
      <h2>{event.title}</h2>
      <p><b>Date:</b> {new Date(event.date).toLocaleString()}</p>
      <p><b>Venue:</b> {event.venue || 'No venue info provided'}</p>
      <p><b>Description:</b> {event.description || 'No description available.'}</p>

      {/* Map with single event marker */}
      {event.location && (
        <>
          <h3 style={{ marginTop: '20px' }}>📍 Event Location</h3>
          <MapComponent events={[event]} />
        </>
      )}
    </div>
  );
}
