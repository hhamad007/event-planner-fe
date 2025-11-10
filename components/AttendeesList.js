"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export default function AttendeesList({ attendees = [] }) {
  const [search, setSearch] = useState("");

  const filteredAttendees = attendees.filter((a) =>
    a.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 🔍 Search Bar */}
      <div className="flex justify-between items-center">
        <h3 className="text-[var(--color-accent)] font-semibold text-lg">
          Attendees ({attendees.length})
        </h3>
        <Input
          type="text"
          placeholder="Search attendee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-48 text-sm bg-[var(--color-primary-light)] border-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>

      {/* 👥 Attendees Display */}
      <div className="flex flex-wrap items-center gap-4">
        <AnimatePresence>
          {filteredAttendees.length > 0 ? (
            filteredAttendees.map((attendee, i) => (
              <motion.div
                key={attendee.id || i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                {/* Avatar */}
                <div className="relative flex -space-x-2">
                  <img
                    src={
                      attendee.avatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${attendee.name}`
                    }
                    alt={attendee.name}
                    className="w-7 h-7 rounded-full border-2 border-white shadow-sm hover:scale-105 transition-transform duration-150"
                  />
                </div>

                {/* Name */}
                <div>
                  <p className="text-[var(--color-text-primary)] text-sm font-medium">
                    {attendee.name}
                  </p>
                  <p className="text-[var(--color-text-secondary)] text-xs">
                    {attendee.role || "Guest"}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-[var(--color-text-secondary)] text-sm italic">
              No attendees found.
            </p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
