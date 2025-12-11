import React, { useEffect, useState } from "react";
import { getPendingTutors, approveTutor, declineTutor, getSubjects } from "../api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/AdminDashboard.css"; 

const AdminDashboard = ({ user }) => {
  const [tutors, setTutors] = useState([]);
  const [loadingTutors, setLoadingTutors] = useState(true);
  const [subjectsMap, setSubjectsMap] = useState({});

  const fetchSubjectsMap = async () => {
    try {
      const res = await getSubjects();
      const map = {};
      res.data.forEach(sub => {
        map[sub.id] = sub.name;
      });
      setSubjectsMap(map);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
    }
  };

  // Fetch pending tutors
  const fetchPendingTutors = async () => {
    setLoadingTutors(true);
    try {
      const res = await getPendingTutors();
      setTutors(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch pending tutors.");
    } finally {
      setLoadingTutors(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchSubjectsMap();
      fetchPendingTutors();
    }
  }, [user]);

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this tutor?")) return;
    try {
      await approveTutor(id);
      toast.success("Tutor approved!");
      fetchPendingTutors();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve tutor.");
    }
  };

  const handleDecline = async (id) => {
    if (!window.confirm("Decline this tutor?")) return;
    try {
      await declineTutor(id);
      toast.success("Tutor declined.");
      fetchPendingTutors();
    } catch (err) {
      console.error(err);
      toast.error("Failed to decline tutor.");
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="admin-dashboard-container">
        <h1>Admin Dashboard</h1>
        <p className="error-text">You do not have admin access.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1>Admin Dashboard</h1>

      {loadingTutors ? (
        <p className="loading-text">Loading pending tutors...</p>
      ) : tutors.length === 0 ? (
        <p className="loading-text">No pending tutors.</p>
      ) : (
        <div className="tutor-grid">
          {tutors.map((tutor) => (
            <div key={tutor.id} className="tutor-card">
              <h2 className="tutor-name">{tutor.name}</h2>
              <p><strong>Email:</strong> {tutor.email}</p>
              <p><strong>School:</strong> {tutor.school_name || "N/A"}</p>
              <p><strong>Bio:</strong> {tutor.bio || "N/A"}</p>
              <p>
                <strong>Subjects:</strong>{" "}
                {tutor.subjects && tutor.subjects.length > 0
                  ? tutor.subjects.map(subId => subjectsMap[subId] || subId).join(", ")
                  : "N/A"}
              </p>
              <div className="button-group">
                <button className="approve-btn" onClick={() => handleApprove(tutor.id)}>Approve</button>
                <button className="decline-btn" onClick={() => handleDecline(tutor.id)}>Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
