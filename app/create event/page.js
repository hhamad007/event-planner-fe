'use client';

import CreateEventForm from '@/components/CreateEventForm';

export default function CreateEventPage() {
  return (
    <main
      style={{
        maxWidth: '700px',
        margin: '2rem auto',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        padding: '2rem',
      }}
    >
      <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem', color: '#333' }}>
        Create New Event
      </h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Fill out the form below to create a new event.
      </p>

      {/* Form Component */}
      <CreateEventForm />
    </main>
  );
}
