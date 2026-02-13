import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTree } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    hackerName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(
        formData.username,
        formData.email,
        formData.password,
        formData.hackerName || null
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Tree crown at top of page */}
      <div className="auth-tree-crown">
        <div className="auth-crown-branch acb-1"></div>
        <div className="auth-crown-branch acb-2"></div>
        <div className="auth-crown-branch acb-3"></div>
        <div className="auth-crown-branch acb-4"></div>
        <div className="auth-crown-branch acb-5"></div>
        <div className="auth-crown-branch acb-6"></div>
        <div className="auth-crown-leaf acl-1"></div>
        <div className="auth-crown-leaf acl-2"></div>
        <div className="auth-crown-leaf acl-3"></div>
        <div className="auth-crown-leaf acl-4"></div>
        <div className="auth-crown-leaf acl-5"></div>
        <div className="auth-crown-leaf acl-6"></div>
        <div className="auth-crown-leaf acl-7"></div>
        <div className="auth-crown-leaf acl-8"></div>
      </div>

      {/* Tree trunk behind card */}
      <div className="auth-tree-bg">
        <div className="auth-tree-trunk"></div>
      </div>

      {/* Tree roots at bottom */}
      <div className="auth-tree-roots">
        <svg viewBox="0 0 800 100" preserveAspectRatio="none">
          <path d="M400,0 Q350,40 280,80 Q240,95 180,100" 
            fill="none" stroke="rgba(0,255,170,0.1)" strokeWidth="2"/>
          <path d="M400,0 Q450,40 520,80 Q560,95 620,100" 
            fill="none" stroke="rgba(0,255,170,0.1)" strokeWidth="2"/>
          <path d="M400,0 Q360,50 260,90 Q200,98 120,100" 
            fill="none" stroke="rgba(0,255,170,0.06)" strokeWidth="1.5"/>
          <path d="M400,0 Q440,50 540,90 Q600,98 680,100" 
            fill="none" stroke="rgba(0,255,170,0.06)" strokeWidth="1.5"/>
        </svg>
      </div>

      <div className="auth-card">
        <div className="auth-card-header">
          <FaTree className="auth-tree-logo" />
          <h1>Join the Tree</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
              placeholder="Choose a username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="hackerName">Hacker Name (Optional)</label>
            <input
              type="text"
              id="hackerName"
              name="hackerName"
              value={formData.hackerName}
              onChange={handleChange}
              placeholder="Your hacker alias"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Min 6 characters"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Planting your seed...' : 'Grow Your Branch'}
          </button>

          <div className="auth-link">
            Already on the tree? <Link to="/login">Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
