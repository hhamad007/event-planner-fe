"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, ImageIcon } from "lucide-react";

export default function CreateEventForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // ✅ Handle field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ✅ Simple front-end validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Event Created:", formData);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border border-[var(--color-primary-light)] bg-white rounded-2xl shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 📝 Event Title */}
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Rust Hackathon 2025"
                value={formData.title}
                onChange={handleChange}
                className="mt-2 bg-[var(--color-primary-light)] border-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* 🖊 Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Write a short event description..."
                value={formData.description}
                onChange={handleChange}
                className="mt-2 bg-[var(--color-primary-light)] border-none focus:ring-2 focus:ring-[var(--color-accent)] h-28"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* 📅 Date and Time */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Calendar
                    size={16}
                    className="absolute left-3 top-3 text-[var(--color-accent)]"
                  />
                  <Input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="pl-9 mt-2 bg-[var(--color-primary-light)] border-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                </div>
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>

              <div>
                <Label htmlFor="time">Time</Label>
                <div className="relative">
                  <Clock
                    size={16}
                    className="absolute left-3 top-3 text-[var(--color-accent)]"
                  />
                  <Input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="pl-9 mt-2 bg-[var(--color-primary-light)] border-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                </div>
                {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
              </div>
            </div>

            {/* 📍 Location */}
            <div>
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin
                  size={16}
                  className="absolute left-3 top-3 text-[var(--color-accent)]"
                />
                <Input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="e.g., Manchester Innovation Hub"
                  value={formData.location}
                  onChange={handleChange}
                  className="pl-9 mt-2 bg-[var(--color-primary-light)] border-none focus:ring-2 focus:ring-[var(--color-accent)]"
                />
              </div>
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            {/* 🖼 Image Upload */}
            <div>
              <Label htmlFor="image">Event Image</Label>
              <div className="relative flex items-center gap-3 mt-2">
                <ImageIcon
                  size={18}
                  className="text-[var(--color-accent)] absolute left-3"
                />
                <Input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="pl-9 bg-[var(--color-primary-light)] border-none focus:ring-2 focus:ring-[var(--color-accent)]"
                />
              </div>
            </div>

            {/* 🚀 Submit */}
            <Button
              type="submit"
              className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-primary)] text-white py-3 rounded-xl"
            >
              Create Event
            </Button>

            {submitted && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-[var(--color-success)] mt-2"
              >
                ✅ Event created successfully!
              </motion.p>
            )}
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
