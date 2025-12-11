// App.js
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Tutors from './components/Tutors';
import Sessions from './components/Sessions';
import AdminDashboard from './components/AdminDashboard';
import Schedule from './components/Schedule';
import Profile from './components/Profile';
import PendingSessions from './components/PendingSessions';
import Navbar from './components/Navbar';
import './styles/App.css';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [pendingCount, setPendingCount] = useState(0); // 🔥 shared state

  // Load from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [token, user]);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <BrowserRouter>
      {token && (
        <Navbar
          user={user}
          handleLogout={handleLogout}
          pendingCount={pendingCount}        // 🔥 pass shared count
          setPendingCount={setPendingCount}  // 🔥 pass setter
        />
      )}

      <div className="app-container">
        <Routes>
          {!token ? (
            <>
              <Route path="/" element={<Login setToken={setToken} setUser={setUser} />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : user?.role === 'admin' ? (
            <>
              <Route path="/" element={<AdminDashboard user={user} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : user?.role === 'student' ? (
            <>
              <Route path="/" element={<Tutors />} />
              <Route path="/sessions" element={<Sessions user={user} />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/profile" element={<Profile user={user} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : user?.role === 'tutor' ? (
            <>
              <Route path="/" element={<Sessions user={user} />} />

              <Route
                path="/pending-sessions"
                element={
                  <PendingSessions
                    user={user}
                    setPendingCount={setPendingCount} // 🔥 pass to page
                  />
                }
              />

              <Route path="/profile" element={<Profile user={user} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : null}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
