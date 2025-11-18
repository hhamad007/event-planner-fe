"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";

export default function EventCard({ event, onSelect }) {
  const {
    title,
    date,
    time,
    location,
    image,
    description,
    latitude,
    longitude,
  } = event || {};

  const handleClick = () => {
    if (onSelect) onSelect(event);
  };

  return (
    <motion.div
      onClick={handleClick}
      className="event-card"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* ==== Event Image ==== */}
      <div className="event-image">
        <Image
          src={image?.url || "/default-event.jpg"}
          alt={title || "Event Image"}
          width={400}
          height={200}
          className="w-full h-[200px] object-cover"
        />
      </div>

      {/* ==== Event Info ==== */}
      <div className="event-info">
        <h3 className="event-title">{title || "Untitled Event"}</h3>

        <div className="event-meta flex items-center gap-2">
          <Calendar size={16} />
          <span>{date ? new Date(date).toLocaleDateString() : "Date TBD"}</span>
        </div>

        <div className="event-location flex items-center gap-2 mt-1">
          <MapPin size={16} />
          <span>{location?.address || "Location TBD"}</span>
        </div>

        {description && (
          <p className="event-description mt-2">
            {description.length > 80
              ? description.substring(0, 80) + "..."
              : description}
          </p>
        )}

        {latitude && longitude && (
          <p className="event-map-indicator mt-3 text-blue-600 font-medium">
            📍 View on map
          </p>
        )}
      </div>
    </motion.div>
  );
}
