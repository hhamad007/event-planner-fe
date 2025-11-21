"use client";

import EventCard from "./EventCard";

// Define your preferred category order
const CATEGORY_ORDER = [
  "Social",
  "Business",
  "Networking",
  "Conference",
  "Workshop",
  "Sports",
  "Music",
  "Education",
  "Other",
];

function groupByCategory(events) {
  return events.reduce((groups, event) => {
    const cat = event.category
      ? event.category.charAt(0).toUpperCase() + event.category.slice(1)
      : "Other";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(event);
    return groups;
  }, {});
}

export default function EventGrid({ events = [], onSelect }) {
  const grouped = groupByCategory(events);

  return (
    <section
      className="event-grid-container"
      style={{ flexDirection: "column", alignItems: "stretch" }}
    >
      {CATEGORY_ORDER.map((category) => (
        <div key={category} style={{ marginBottom: "32px" }}>
          <h2
            style={{
              margin: "24px 0 12px",
              color: "#2563eb",
              fontSize: "1.3rem",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            {category}
          </h2>
          <div className="event-row-scroll">
            {(grouped[category] || []).length > 0 ? (
              grouped[category].map((event, idx) => (
                <EventCard
                  key={event._id || idx}
                  event={event}
                  onSelect={onSelect}
                />
              ))
            ) : (
              <div className="event-card event-card-empty">
                <span className="text-muted">No events in this category</span>
              </div>
            )}
          </div>
        </div>
      ))}
      {events.length === 0 && <p>No events found.</p>}
    </section>
  );
}
