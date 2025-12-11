import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { getPendingCount } from '../api/api';
import '../styles/Navbar.css';

export default function Navbar({ user, handleLogout, pendingCount, setPendingCount }) {

  useEffect(() => {
    const loadCount = async () => {
      if (user?.role !== 'tutor') return;

      try {
        const res = await getPendingCount();
        setPendingCount(res.data.count);
      } catch (err) {
        console.error("Failed to load pending count:", err);
      }
    };

    loadCount();

    const interval = setInterval(loadCount, 30000);
    return () => clearInterval(interval);

  }, [user, setPendingCount]);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">Study Buddy</Link>

        {user?.role === 'student' && (
          <>
            <Link to="/">Home</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/sessions">Current Sessions</Link>
          </>
        )}

        {user?.role === 'tutor' && (
          <>
            <Link to="/">Home</Link>
            <Link to="/profile">Profile</Link>

            <Link to="/pending-sessions" className="nav-item pending-link">
              Pending Sessions
              {pendingCount > 0 && (
                <span className="pending-bubble">{pendingCount}</span>
              )}
            </Link>
          </>
        )}
      </div>

      <div className="navbar-right">
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}
