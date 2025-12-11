import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createSession } from '../api/api';
import '../styles/Schedule.css';

export default function Schedule() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tutor } = location.state || {};

  const [form, setForm] = useState({
    date: '',
    time: '',
    subject_id: tutor?.subjects?.[0]?.id || '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'date') {
    
      let formatted = value.replace(/\D/g, '');
      if (formatted.length > 2) formatted = formatted.slice(0,2) + '/' + formatted.slice(2);
      if (formatted.length > 5) formatted = formatted.slice(0,5) + '/' + formatted.slice(5,9);
      setForm(prev => ({ ...prev, date: formatted }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.time || !form.subject_id) {
      alert('Please fill in all required fields');
      return;
    }

    const scheduled_at = `${form.date} ${form.time}`;

    try {
      await createSession({
        tutor_id: tutor.id,
        subject_id: form.subject_id,
        scheduled_at,
        notes: form.notes
      });
      alert('Session scheduled successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to schedule session');
    }
  };

  if (!tutor) {
    return <p>No tutor selected. Please go back and choose a tutor.</p>;
  }

  return (
    <div className="schedule-container">
      <h2>Schedule a Session with {tutor.name}</h2>
      <form onSubmit={handleSubmit} className="schedule-form">

        <label>
          Tutor:
          <input type="text" value={tutor.name} disabled />
        </label>

        <label>
          Subject:
          <select name="subject_id" value={form.subject_id} onChange={handleChange} required>
            {tutor.subjects?.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </label>

        <label>
          Date (MM/DD/YYYY):
          <input
            type="text"
            name="date"
            value={form.date}
            onChange={handleChange}
            placeholder="MM/DD/YYYY"
            required
          />
        </label>

        <label>
          Time (HH:MM AM/PM):
          <input
            type="text"
            name="time"
            value={form.time}
            onChange={handleChange}
            placeholder="5:30 PM"
            required
          />
        </label>

        <label>
          Notes:
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Optional notes"
          />
        </label>

        <button type="submit" className="schedule-btn">Schedule Session</button>
      </form>
    </div>
  );
}
