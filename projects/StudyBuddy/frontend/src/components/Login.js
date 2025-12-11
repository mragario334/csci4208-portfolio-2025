import { useState } from 'react';
import { login } from '../api/api';
import '../styles/Login.css';

export default function Login({ setToken, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      setToken(res.data.token);
      setUser(res.data.user);
      alert(`Welcome ${res.data.user.name}!`);
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>

      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="login-input"
        />

        <button type="submit" className="login-btn">Login</button>
      </form>

      <p className="login-register-text">
        Don't have an account?{' '}
        <a href="/register" className="register-link">Register here</a>
      </p>
    </div>
  );
}
