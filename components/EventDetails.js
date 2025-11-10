"use client";

import { Calendar, Clock, MapPin, UserPlus, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AttendeesList from "@/components/AttendeesList";
import { motion } from "framer-motion";
import { useState } from "react";

export default function EventDetails({ event }) {
  const [joined, setJoined] = useState(false);

  const handleJoin = () => setJoined(!joined);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[var(--color-background)] py-10 px-6"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* 🖼️ Event Header Image */}
        <div className="relative">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-72 object-cover rounded-3xl shadow-md"
          />
          {event.category && (
            <Badge className="absolute top-4 left-4 bg-[var(--color-accent)] text-white text-sm">
              {event.category}
            </Badge>
          )}
        </div>

        {/* 🏷️ Event Info */}
        <Card className="rounded-3xl border border-[var(--color-primary-light)] shadow-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-[var(--color-accent)]">
              {event.title}
            </CardTitle>
            <div className="flex flex-wrap gap-4 mt-3 text-[var(--color-text-secondary)]">
              <span className="flex items-center gap-2">
                <Calendar size={18} className="text-[var(--color-accent)]" />
                {event.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={18} className="text-[var(--color-accent)]" />
                {event.time || "TBD"}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={18} className="text-[var(--color-accent)]" />
                {event.location}
              </span>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-[var(--color-text-primary)] leading-relaxed mb-6">
              {event.description}
            </p>

            {/* 🎟️ Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button
                onClick={handleJoin}
                className={`px-5 ${
                  joined
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-[var(--color-accent)] hover:bg-[var(--color-primary)]"
                } text-white`}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {joined ? "Joined" : "Join Event"}
              </Button>

              <Button
                variant="outline"
                className="border-[var(--color-primary-light)] text-[var(--color-accent)] hover:bg-[var(--color-primary-light)]"
                onClick={() =>
                  navigator.share?.({ title: event.title, url: window.location.href })
                }
              >
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 👥 Attendees */}
        <Card className="rounded-3xl border border-[var(--color-primary-light)] shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[var(--color-accent)]">
              Attendees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AttendeesList attendees={event.attendees || []} />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
