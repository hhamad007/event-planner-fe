"use client";

import { useEffect, useState } from "react";
import { getProfile, getAllEvents } from "@/utils/api";
import EventGrid from "@/components/EventGrid";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const profileData = await getProfile();
        setUser(profileData);

        const allEvents = await getAllEvents();
        if (profileData && allEvents) {
          const created = allEvents.filter(
            (event) => event.organizer?._id === profileData._id
          );
          const joined = allEvents.filter((event) =>
            event.attendees?.some((a) => a._id === profileData._id)
          );

          setMyEvents(created);
          setJoinedEvents(joined);
        }
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <p className="loading">Loading dashboard...</p>;
  if (!user) return <p className="loading">Please log in to view dashboard.</p>;

  return (
    <div className="dashboard-container">
      {/* --- Welcome Header --- */}
      <div className="dashboard-header">
        <h1>Welcome, {user.firstName || "User"} 👋</h1>
        <p className="text-gray-500">Your personal event dashboard</p>
        <button
          className="create-btn"
          onClick={() => (window.location.href = "/create-event")}
        >
          + Create New Event
        </button>
      </div>

      {/* --- Quick Stats --- */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{myEvents.length}</h3>
          <p>Events Created</p>
        </div>
        <div className="stat-card">
          <h3>{joinedEvents.length}</h3>
          <p>Events Joined</p>
        </div>
        <div className="stat-card">
          <h3>
            {
              myEvents.filter(
                (event) => new Date(event.date) > new Date()
              ).length
            }
          </h3>
          <p>Upcoming Events</p>
        </div>
      </div>

      {/* --- My Events --- */}
      <section className="dashboard-section">
        <h2>My Events</h2>
        {myEvents.length > 0 ? (
          <EventGrid events={myEvents} />
        ) : (
          <p className="no-events">You haven’t created any events yet.</p>
        )}
      </section>

      {/* --- Joined Events --- */}
      <section className="dashboard-section">
        <h2>Joined Events</h2>
        {joinedEvents.length > 0 ? (
          <EventGrid events={joinedEvents} />
        ) : (
          <p className="no-events">You haven’t joined any events yet.</p>
        )}
      </section>
    </div>
  );
}
