'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EventGrid from '@/components/EventGrid';
import MapComponent from '@/components/MapComponent';
import { getMyEvents, searchEvents } from '@/utils/api';

export default function DashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyEvents() {
      setLoading(true);
      const res = await getMyEvents();
      setEvents(res || []);
      setLoading(false);
    }
    fetchMyEvents();
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    const res = await searchEvents({ q: query });
    setEvents(res || []);
    setLoading(false);
  }

  function handleCreateEvent() {
    router.push('/create-event');
  }

  return (
    <main className="dashboard-container">
      {/* Header */}
      <section className="dashboard-header">
        <div>
          <h1 className="dashboard-title">My Dashboard</h1>
          <p className="dashboard-subtitle">
            Manage your events, create new ones, or explore existing.
          </p>
        </div>

        <button onClick={handleCreateEvent} className="create-event-btn">
          + Create Event
        </button>
      </section>

      {/* Search Bar */}
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events..."
        />
        <button type="submit">Search</button>
      </form>

      {/* Events Section */}
      <section className="dashboard-events">
        {loading ? (
          <div className="loading-text">Loading events...</div>
        ) : events.length > 0 ? (
          <>
            <EventGrid events={events} />

            {/* Add map showing all event markers */}
            <h3 style={{ marginTop: '40px', textAlign: 'center' }}>
              📍 Event Locations
            </h3>
            <MapComponent events={events} />
          </>
        ) : (
          <div className="no-events-text">No events found.</div>
        )}
      </section>
    </main>
  );
}
