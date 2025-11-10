'use client';
import React from "react";
import Link from "next/link";

export default function EventCard({ event }) {
  if (!event) return null;

  // Safely extract event data from Ticketmaster
  const image =
    event.images?.find((img) => img.ratio === "16_9")?.url ||
    event.images?.[0]?.url ||
    "https://via.placeholder.com/300x200.png?text=Event+Image";

  const eventName = event.name || "Unnamed Event";

  const dateObj = event.dates?.start?.localDate
    ? new Date(event.dates.start.localDate)
    : null;

  const date = dateObj ? dateObj.toDateString() : "TBD";
  const time = event.dates?.start?.localTime
    ? ` @ ${event.dates.start.localTime}`
    : "";

  const venue = event._embedded?.venues?.[0]?.name || "Location TBD";

  return (
    <div className="event-card">
      {/* === Event Image === */}
      <div className="event-image">
        <img src={image} alt={eventName} />
      </div>

      {/* === Event Info === */}
      <div className="event-info">
        <div className="event-meta">
          <span>{date + time}</span>
        </div>

        <h3>{eventName}</h3>
        <p style={{ fontSize: "0.8rem", color: "#777" }}>{venue}</p>

        <div className="attendees">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="attendee-circle"></div>
          ))}
          <span className="attendee-count">39 attendees</span>
        </div>
      </div>

      {/* === Clickable Link === */}
      <Link
        href={`/event/${event.id}`}
        className="event-link"
        aria-label={`View details for ${eventName}`}
      />
    </div>
  );
}
