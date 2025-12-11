import { useState, useEffect } from 'react';
import { getTutors } from '../api/api';
import { useNavigate } from 'react-router-dom';
import '../styles/Tutors.css';

export default function Tutors() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await getTutors();
        setTutors(res.data.tutors);
      } catch (err) {
        console.error('Failed to fetch tutors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  if (loading) return <p>Loading tutors...</p>;
  if (tutors.length === 0) return <p>No tutors available.</p>;

  const handleSchedule = (tutor) => {
    navigate('/schedule', { state: { tutor } });
  };

  return (
    <div className="tutors-container">
      <h2>Here are available tutors:</h2>
      <ul className="tutor-list">
        {tutors.map((tutor) => (
          <li key={tutor.id} className="tutor-item">
            <h3>{tutor.name}</h3>
            <p><strong>Bio:</strong> {tutor.bio || 'N/A'}</p>
            <p>
  <strong>Subjects:</strong>{' '}
  {tutor.subjects?.map(sub => sub.name).join(', ') || 'N/A'}
</p>            <button onClick={() => handleSchedule(tutor)}>Schedule now</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
