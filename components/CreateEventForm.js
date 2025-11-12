'use client';
import { useState } from 'react';
import { createEvent } from '@/utils/api';

export default function CreateEventForm() {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const res = await createEvent(formData);

    if (res && res.success !== false) {
      setMessage(' Event created successfully!');
      setFormData({ title: '', date: '', location: '', description: '' });
    } else {
      setMessage(' Failed to create event. Please log in again.');
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <input
        name="title"
        type="text"
        placeholder="Event Title"
        value={formData.title}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      />
      <input
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      />
      <input
        name="location"
        type="text"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Creating...' : 'Create Event'}
      </button>

      {message && <p style={{ color: '#444' }}>{message}</p>}
    </form>
  );
}
