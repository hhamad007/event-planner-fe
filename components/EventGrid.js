"use client";
import EventCard from "@/components/EventCard";

export default function EventGrid({ events = [] }) {
  if (!events.length) {
    return (
      <p className="text-center text-gray-500 mt-10">
        No events available right now.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center px-6 py-10">
      {events.map((event) => (
        <EventCard key={event._id || event.id} event={event} />
      ))}
    </div>
  );
}
