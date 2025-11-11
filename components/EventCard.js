"use client";

import { Calendar, MapPin, Users } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

/**
 * Reusable Event Card Component
 * Displays event details, attendees, and actions
 */
export default function EventCard({ event, onJoin }) {
  const [joining, setJoining] = useState(false);

  const handleJoin = async () => {
    setJoining(true);
    if (onJoin) await onJoin(event);
    setTimeout(() => setJoining(false), 500);
  };

  const imageUrl =
    event?.image ||
    "https://dummyimage.com/600x400/edeaff/bfa2ff.png&text=Event+Image";
  const attendees = event?.attendees || [];
  const date = event?.date
    ? new Date(event.date).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : "TBD";

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all w-full max-w-xs sm:max-w-sm bg-white rounded-2xl border border-gray-100">
      {/* 🖼️ Event Image */}
      <div className="relative h-36 sm:h-40 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={event?.title || "Event"}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {event?.category && (
          <Badge className="absolute top-2 left-2 bg-purple-100 text-purple-700 font-medium">
            {event.category}
          </Badge>
        )}
      </div>

      {/* 🏷️ Header */}
      <CardHeader className="pb-1">
        <CardTitle className="text-[16px] font-semibold truncate text-gray-900">
          {event?.title || "Untitled Event"}
        </CardTitle>
        <CardDescription className="flex items-center text-gray-500 text-sm mt-1">
          <Calendar size={15} className="mr-2 text-purple-500" />
          {date}
        </CardDescription>
      </CardHeader>

      {/* 📍 Content */}
      <CardContent className="pt-1">
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin size={15} className="mr-2 text-purple-500" />
          {event?.location || "Unknown Location"}
        </div>

        {/* 👥 Attendees */}
        <div className="flex items-center gap-1 mb-4">
          {attendees.slice(0, 5).map((a, i) => (
            <img
              key={i}
              src={a.avatar || `https://i.pravatar.cc/25?img=${i + 1}`}
              alt={a.name || "User"}
              className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
            />
          ))}
          {attendees.length > 5 && (
            <span className="text-xs text-gray-500 ml-1">
              +{attendees.length - 5} more
            </span>
          )}
        </div>
      </CardContent>

      {/* 🔘 Actions */}
      <CardFooter className="flex justify-between items-center border-t pt-3">
        <Link href={`/event/${event._id || event.id}`}>
          <Button variant="outline" size="sm" className="border-gray-300">
            View Details
          </Button>
        </Link>
        <Button
          size="sm"
          onClick={handleJoin}
          disabled={joining}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {joining ? "Joining..." : "Join Event"}
        </Button>
      </CardFooter>
    </Card>
  );
}
