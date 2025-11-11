"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, MapPin, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`http://localhost:5001/api/events/${id}`);
        if (!res.ok) throw new Error("Failed to fetch event details");
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load this event.");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchEvent();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-[#F8F6FF] py-10 px-6 flex justify-center">
      <Card className="w-full max-w-2xl shadow-lg border border-gray-100 bg-white rounded-2xl">
        {/* Header */}
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            {event.title}
          </CardTitle>
          <div className="flex items-center text-sm text-gray-500 gap-3">
            <Calendar size={16} className="text-purple-500" />
            <span>{new Date(event.date).toLocaleDateString("en-GB")}</span>
            <MapPin size={16} className="text-purple-500" />
            <span>{event.location}</span>
          </div>
        </CardHeader>

        {/* Image */}
        <img
          src={
            event.image ||
            "https://dummyimage.com/600x400/edeaff/bfa2ff.png&text=Event+Image"
          }
          alt={event.title}
          className="rounded-xl w-full h-64 object-cover mb-6"
        />

        {/* Description */}
        <CardContent>
          <p className="text-gray-700 leading-relaxed mb-6">
            {event.description || "No description available."}
          </p>

          {/* Attendees */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Attendees
          </h3>
          <div className="flex items-center gap-1 flex-wrap">
            {event.attendees?.length > 0 ? (
              event.attendees.slice(0, 10).map((attendee, i) => (
                <img
                  key={i}
                  src={attendee.avatar || `https://i.pravatar.cc/25?img=${i + 1}`}
                  alt={attendee.name || "User"}
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                />
              ))
            ) : (
              <p className="text-gray-500 text-sm">No attendees yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
