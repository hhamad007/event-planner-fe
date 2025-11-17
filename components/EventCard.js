'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';

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
      style={{
        cursor: 'pointer',
        borderRadius: '14px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ==== Event Image ==== */}
      <div className="event-image" style={{ position: 'relative' }}>
        <Image
          src={image || '/default-event.jpg'}
          alt={title || 'Event Image'}
          width={400}
          height={200}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* ==== Event Info ==== */}
      <div
        className="event-info"
        style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}
      >
        <h3
          style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#222',
            marginBottom: '8px',
          }}
        >
          {title || 'Untitled Event'}
        </h3>

        <div
          className="event-meta"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Calendar size={16} color="#6b6b6b" />
          <span style={{ fontSize: '0.9rem', color: '#666' }}>
            {date ? new Date(date).toLocaleDateString() : 'Date TBD'}
          </span>
        </div>

        <div
          className="event-location"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '6px',
          }}
        >
          <MapPin size={16} color="#6b6b6b" />
          <span style={{ fontSize: '0.9rem', color: '#666' }}>
            {location || 'Location TBD'}
          </span>
        </div>

        {description && (
          <p
            style={{
              fontSize: '0.85rem',
              color: '#777',
              marginTop: '10px',
              lineHeight: '1.4',
            }}
          >
            {description.length > 80
              ? description.substring(0, 80) + '...'
              : description}
          </p>
        )}

        {/* ==== Map Indicator (optional) ==== */}
        {latitude && longitude && (
          <p
            style={{
              marginTop: '12px',
              fontSize: '0.8rem',
              color: '#4b6bff',
              fontWeight: '500',
            }}
          >
            📍 View on map
          </p>
        )}
      </div>
    </motion.div>
  );
}
