import { useEffect, useState } from 'react';
import { getSessions, updateSessionStatus } from '../api/api';
import '../styles/PendingSessions.css';

export default function PendingSessions({ user, setPendingCount }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await getSessions();
        const pending = res.data.sessions.filter(s => s.status === "pending");

        setSessions(pending);
        setPendingCount(pending.length);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch pending sessions.');
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, [setPendingCount]);

  const handleAction = async (id, newStatus) => {
    try {
      await updateSessionStatus(id, newStatus);

      setSessions(prev => prev.filter(s => s.id !== id));
      setPendingCount(prev => prev - 1); // this will update the navbar instantly

      alert(
        newStatus === "scheduled"
          ? "Session approved!"
          : "Session denied."
      );
    } catch (err) {
      console.error(err);
      alert('Failed to update session status.');
    }
  };

  if (loading) return <p>Loading pending sessions...</p>;
  if (sessions.length === 0) return <p>No pending sessions.</p>;

  return (
    <div className="pending-container">
      <h2>Pending Sessions</h2>
      <ul className="pending-list">
        {sessions.map(s => (
          <li key={s.id} className="pending-item">
            <p><strong>Student:</strong> {s.student_name}</p>
            <p><strong>Subject:</strong> {s.subject}</p>
            <p><strong>Requested for:</strong> {new Date(s.scheduled_at).toLocaleString()}</p>

            <div className="pending-actions">
              <button
                onClick={() => handleAction(s.id, "scheduled")}
                className="approve-btn"
              >
                Approve
              </button>

              <button
                onClick={() => handleAction(s.id, "denied")}
                className="deny-btn"
              >
                Deny
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
