'use client';

export default function AttendeeList({ attendees = [] }) {
  if (!attendees.length) {
    return <p className="no-attendees">No attendees yet.</p>;
  }

  return (
    <div className="attendee-list">
      <h3 className="attendee-title">Attendees</h3>
      <div className="attendee-grid">
        {attendees.map((user, i) => (
          <div key={i} className="attendee-item">
            <div className="attendee-avatar">
              {user.profilePic ? (
                <img src={user.profilePic} alt={user.name} />
              ) : (
                <div className="attendee-placeholder">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <p>{user.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
