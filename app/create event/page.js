"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? URL.createObjectURL(files[0]) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("✅ Event Created:", formData);
    alert("🎉 Event created successfully!");
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] font-poppins flex items-center justify-center py-12">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-lg p-10"
      >
        <h1 className="text-3xl font-bold text-[var(--color-accent)] mb-3 text-center">
          Create New Event 🎉
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-8 text-center">
          Fill in the details below to host your event.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Event Title
            </label>
            <Input
              name="title"
              placeholder="Enter event title"
              value={formData.title}
              onChange={handleChange}
              required
              className="bg-[var(--color-primary-light)] border-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Description
            </label>
            <Textarea
              name="description"
              placeholder="Describe your event"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              required
              className="bg-[var(--color-primary-light)] border-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
                <Calendar size={16} className="text-[var(--color-accent)]" />
                Date
              </label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="bg-[var(--color-primary-light)] border-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
                <Clock size={16} className="text-[var(--color-accent)]" />
                Time
              </label>
              <Input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="bg-[var(--color-primary-light)] border-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
              <MapPin size={16} className="text-[var(--color-accent)]" />
              Location
            </label>
            <Input
              name="location"
              placeholder="Event location"
              value={formData.location}
              onChange={handleChange}
              required
              className="bg-[var(--color-primary-light)] border-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
              <ImageIcon size={16} className="text-[var(--color-accent)]" />
              Upload Event Image
            </label>
            <Input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="bg-[var(--color-primary-light)] border-none cursor-pointer"
            />

            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-48 object-cover rounded-2xl mt-3 shadow-sm border"
              />
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-[var(--color-accent)] text-white hover:bg-[var(--color-primary)] rounded-xl py-3 text-base font-semibold transition"
          >
            Create Event
          </Button>
        </form>
      </motion.section>
    </main>
  );
}
