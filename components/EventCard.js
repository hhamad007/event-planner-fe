'use client';

export default function EventCard({ event, onViewMap }) {
  return (
    <div className="event-card">
      <div className="event-image">
        <img src={event.image || '/placeholder.jpg'} alt={event.title} />
      </div>

      <div className="event-info">
        <h3>{event.title}</h3>
        <p>{new Date(event.date).toLocaleString()}</p>
        <p>{event.venue || 'No venue specified'}</p>
      </div>

      <div className="event-actions">
        {event.location && (
          <button
            onClick={() => onViewMap(event)}
            className="view-map-btn"
          >
            📍 View on Map
          </button>
        )}
      </div>
    </div>
  );
}
