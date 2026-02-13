import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTree } from 'react-icons/fa';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
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
          <h1>Access the Tree</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Connecting...' : 'Enter the Tree'}
          </button>

          <div className="auth-link">
            Don't have an account? <Link to="/register">Grow a new branch</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
