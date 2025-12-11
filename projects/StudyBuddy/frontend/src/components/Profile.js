import React from 'react';
import '../styles/Profile.css';

export default function Profile({ user }) {
  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <div className="profile-card">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        {user.school_name && <p><strong>School:</strong> {user.school_name}</p>}
        {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
        {user.subjects?.length > 0 && (
          <p><strong>Subjects:</strong> {user.subjects.map(s => s.name).join(', ')}</p>
        )}
      </div>
    </div>
  );
}
