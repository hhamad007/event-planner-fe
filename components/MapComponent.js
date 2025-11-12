'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icons for Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Lazy load React Leaflet components (client-side only)
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const highlightIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/535/535239.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export default function MapComponent({ events = [], selectedEvent }) {
  const router = useRouter();
  const defaultPosition = [52.9548, -1.1581]; // Nottingham
  const [map, setMap] = useState(null);

  // When selected event changes → fly to it
  useEffect(() => {
    if (map && selectedEvent?.location) {
      const pos = [selectedEvent.location.lat, selectedEvent.location.lng];
      map.flyTo(pos, 14, { duration: 1.2 });
    }
  }, [selectedEvent, map]);

  if (typeof window === 'undefined') return null; // prevent SSR issues

  return (
    <div style={{ width: '100%', height: '400px', borderRadius: '10px', marginTop: '20px' }}>
      <MapContainer
        center={defaultPosition}
        zoom={11}
        whenCreated={setMap}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {events.map((event, idx) => {
          if (!event.location?.lat || !event.location?.lng) return null;

          const isSelected = selectedEvent?._id === event._id;

          return (
            <Marker
              key={idx}
              position={[event.location.lat, event.location.lng]}
              icon={isSelected ? highlightIcon : new L.Icon.Default()}
              eventHandlers={{
                click: () => router.push(`/events/${event._id}`), // 🚀 Go to Event Details
              }}
            >
              <Popup>
                <b>{event.title}</b>
                <br />
                {event.venue || 'No venue info'}
                <br />
                {new Date(event.date).toLocaleString()}
                <br />
                <button
                  onClick={() => router.push(`/events/${event._id}`)}
                  style={{
                    marginTop: '5px',
                    padding: '5px 10px',
                    background: '#6a0dad',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  View Details
                </button>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
