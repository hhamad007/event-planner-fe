'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ setPosition }) {
  const [markerPos, setMarkerPos] = useState(null);

  useMapEvents({
    click(e) {
      setMarkerPos(e.latlng);
      setPosition(e.latlng);
    },
  });

  return markerPos ? <Marker position={markerPos}></Marker> : null;
}

export default function LocationPicker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);

  return (
    <div style={{ height: '300px', borderRadius: '10px', overflow: 'hidden', marginTop: '15px' }}>
      <MapContainer
        center={[52.9548, -1.1581]}
        zoom={11}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker setPosition={(latlng) => {
          setPosition(latlng);
          onLocationSelect(latlng);
        }} />
      </MapContainer>
    </div>
  );
}
