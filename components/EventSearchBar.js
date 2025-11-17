'use client';

import { useState } from 'react';

export default function EventSearchBar({ onSearch }) {
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    date: '',
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-4 flex flex-wrap gap-3 items-end mb-8"
    >
      {/* Title Filter */}
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm text-gray-600 mb-1">Event Title</label>
        <input
          type="text"
          name="title"
          value={filters.title}
          onChange={handleChange}
          placeholder="Search by title..."
          className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
      </div>

      {/* Location Filter */}
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm text-gray-600 mb-1">Location</label>
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="e.g., London"
          className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
      </div>

      {/* Date Filter */}
      <div className="flex-1 min-w-[150px]">
        <label className="block text-sm text-gray-600 mb-1">Date</label>
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="bg-[var(--color-accent)] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition"
      >
        🔍 Search
      </button>
    </form>
  );
}
