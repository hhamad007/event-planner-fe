"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getEventById } from "@/utils/api"; // same API handler you’re using for Ticketmaster
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const data = await getEventById(id);
        setEvent(data);
      } catch (err) {
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--color-accent)] font-medium">
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--color-error)] font-semibold">
        Event not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-3xl overflow-hidden">
        {/* Hero Image */}
        <div className="relative">
          <img
            src={event.image || "https://dummyimage.com/900x400/edeaff/bfa2ff.png&text=Event+Image"}
            alt={event.title}
            className="w-full h-72 object-cover"
          />
          {event.category && (
            <span className="absolute top-5 left-5 bg-[var(--color-primary-light)] text-[var(--color-accent)] text-xs font-medium px-3 py-1 rounded-md shadow">
              {event.category}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Title and Date */}
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-accent)] mb-2">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2 text-[var(--color-accent)]" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2 text-[var(--color-accent)]" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-2 text-[var(--color-accent)]" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
              About this Event
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {event.description || "No description provided."}
            </p>
          </div>

          {/* Attendees */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
              Attendees
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {(event.attendees || []).slice(0, 5).map((att, i) => (
                <img
                  key={i}
                  src={att.avatar || "https://i.pravatar.cc/40?img=" + i}
                  alt={att.name}
                  className="w-7 h-7 rounded-full border-2 border-white shadow"
                  title={att.name}
                />
              ))}
              {event.attendees?.length > 5 && (
                <span className="text-xs text-gray-600 ml-2">
                  +{event.attendees.length - 5} more
                </span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-[var(--color-primary)] text-white px-5 py-2 rounded-xl font-medium hover:bg-[var(--color-accent)] transition"
            >
              Join Event
            </motion.button>

            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                event.location
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--color-primary-light)] text-[var(--color-accent)] px-5 py-2 rounded-xl font-medium hover:bg-[var(--color-primary)] hover:text-white transition"
            >
              View on Google Maps
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-gray-100 text-gray-700 px-5 py-2 rounded-xl font-medium hover:bg-gray-200 transition"
            >
              Share Event
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
