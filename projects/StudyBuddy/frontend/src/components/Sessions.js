import { useEffect, useState } from 'react';
import api from '../api/api';
import '../styles/Sessions.css';

export default function Sessions({ user }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/sessions');
        setSessions(res.data.sessions);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch sessions.');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/sessions/${id}/status`, { status: newStatus });

      setSessions(prev =>
        prev.map(s => (s.id === id ? { ...s, status: newStatus } : s))
      );
    } catch (err) {
      console.error(err);
      alert('Failed to update session status.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>No user found.</p>;

  const filteredSessions =
    user.role === "tutor"
      ? sessions.filter(s => ["scheduled", "completed"].includes(s.status))
      : sessions;

  const displayStatus = (s) => {
    const map = {
      pending: "Awaiting Approval",
      scheduled: "Scheduled",
      completed: "Completed",
      cancelled: "Cancelled",
      denied: "Denied"
    };
    return map[s.status] || s.status;
  };

  return (
    <div className="sessions-container">
      <h2>{user.role === 'tutor' ? 'My Schedule' : 'My Sessions'}</h2>

      {filteredSessions.length === 0 ? (
        <p>No sessions available.</p>
      ) : (
        <ul className="session-list">
          {filteredSessions.map(s => (
            <li key={s.id} className={`session-item ${s.status}`}>
              <div className="session-info">
                <p><strong>Subject:</strong> {s.subject}</p>
                <p>
                  <strong>{user.role === 'tutor' ? 'Student' : 'Tutor'}:</strong> {s.other_user}
                </p>
                <p><strong>When:</strong> {new Date(s.scheduled_at).toLocaleString()}</p>
                <p><strong>Status:</strong> {displayStatus(s)}</p>

                {s.notes && (
                  <p><strong>Notes:</strong> {s.notes}</p>
                )}
              </div>

              {user.role === 'student' &&
  ["pending", "scheduled"].includes(s.status) && (
    <div className="button-stack">
      <button
        className="decline-btn small-btn"
        onClick={() => handleStatusChange(s.id, "cancelled")}
      >
        Cancel
      </button>
    </div>
  )}


              {user.role === 'tutor' && s.status === "scheduled" && (
                <div className="button-stack">
                  <button
                    className="decline-btn small-btn"
                    onClick={() => handleStatusChange(s.id, "cancelled")}
                  >
                    Cancel
                  </button>

                  <button
                    className="approve-btn small-btn"
                    onClick={() => handleStatusChange(s.id, "completed")}
                  >
                    Complete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
