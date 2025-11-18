"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EventGrid from "@/components/EventGrid";
import MapComponent from "@/components/MapComponent";
import api from "@/utils/api";

export default function DashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch user's created events
  useEffect(() => {
    async function fetchMyEvents() {
      try {
        setLoading(true);
        const res = await api.getMyEvents();
        if (res && Array.isArray(res.data)) {
          setEvents(res.data);
        } else if (Array.isArray(res)) {
          setEvents(res);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMyEvents();
  }, []);

  // Search events
  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    const res = await api.searchEvents({ q: query });
    if (res && Array.isArray(res.data)) setEvents(res.data);
    else if (Array.isArray(res)) setEvents(res);
    else setEvents([]);
    setLoading(false);
  }

  // Handle create event
  function handleCreateEvent() {
    router.push("/create-event");
  }

  return (
    <main className="dashboard-container">
      {/* ===== Dashboard Header ===== */}
      <section className="dashboard-header">
        <div>
          <h1 className="dashboard-title">My Dashboard</h1>
          <p className="dashboard-subtitle">
            Manage your events, create new ones, and view their locations.
          </p>
        </div>
        <button onClick={handleCreateEvent} className="create-event-btn">
          + Create Event
        </button>
      </section>

      {/* ===== Search Bar ===== */}
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events..."
        />
        <button type="submit">Search</button>
      </form>

      {/* ===== Events Section ===== */}
      <section className="dashboard-events">
        {loading ? (
          <div className="loading-text">Loading events...</div>
        ) : events.length > 0 ? (
          <>
            <EventGrid events={events} onSelect={setSelectedEvent} />
            {selectedEvent &&
              selectedEvent.latitude &&
              selectedEvent.longitude && (
                <div style={{ marginTop: "30px" }}>
                  <MapComponent
                    latitude={selectedEvent.latitude}
                    longitude={selectedEvent.longitude}
                    eventTitle={selectedEvent.title}
                  />
                </div>
              )}
          </>
        ) : (
          <div className="no-events-text">No events found.</div>
        )}
      </section>
    </main>
  );
}
