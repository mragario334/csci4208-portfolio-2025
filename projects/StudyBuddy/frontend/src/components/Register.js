import { useState, useEffect } from 'react';
import { register, getSchools, getSubjects } from '../api/api';
import '../styles/Register.css';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    school_id: '',
    bio: '',
    subjects: []
  });

  const [schools, setSchools] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const schoolRes = await getSchools();
        const subjRes = await getSubjects();
        setSchools(schoolRes.data);
        setSubjectsList(subjRes.data);
      } catch (err) {
        console.error('Failed to fetch dropdown data:', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectsChange = (e) => {
    const { value, checked } = e.target;
    const id = parseInt(value);

    setForm(prev => {
      let newSubjects = [...prev.subjects];
      if (checked) {
        newSubjects.push(id);
      } else {
        newSubjects = newSubjects.filter(sub => sub !== id);
      }
      return { ...prev, subjects: newSubjects };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert('Registered successfully!');
      setForm({ name:'', email:'', password:'', role:'student', school_id:'', bio:'', subjects:[] });
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>

      <form onSubmit={handleSubmit} className="register-form">
        <input type="text" name="name" placeholder="Name"
          value={form.name} onChange={handleChange} required className="register-input" />

        <input type="email" name="email" placeholder="Email"
          value={form.email} onChange={handleChange} required className="register-input" />

        <input type="password" name="password" placeholder="Password"
          value={form.password} onChange={handleChange} required className="register-input" />
        
        <select name="school_id" value={form.school_id}
          onChange={handleChange} required className="register-input">
          <option value="" disabled>Select your school</option>
          {schools.map(school => (
            <option key={school.id} value={school.id}>{school.name}</option>
          ))}
        </select>

        <select name="role" value={form.role}
          onChange={handleChange} className="register-input">
          <option value="student">Student</option>
          <option value="tutor">Tutor</option>
        </select>

        <textarea name="bio" placeholder="Bio"
          value={form.bio} onChange={handleChange} className="register-input" />

        {form.role === 'tutor' && (
          <div className="subjects-checkboxes">
            <label><strong>Select Subjects:</strong></label>
            {subjectsList.map(sub => (
              <div key={sub.id} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`sub-${sub.id}`}
                  value={sub.id}
                  checked={form.subjects.includes(sub.id)}
                  onChange={handleSubjectsChange}
                />
                <label htmlFor={`sub-${sub.id}`}>{sub.name}</label>
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="register-btn">Register</button>
      </form>

      <p className="register-login-text">
        Already have an account? <a href="/">Login here</a>
      </p>
    </div>
  );
}
