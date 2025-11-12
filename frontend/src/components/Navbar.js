import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaSignOutAlt, FaTasks } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          🎯 CyberSec Skill Tree
        </Link>

        <div className="navbar-links">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>

          {(user?.role === 'instructor' || user?.role === 'admin') && (
            <Link to="/admin/reviews" className="nav-link">
              <FaTasks /> Reviews
            </Link>
          )}

          <Link to="/profile" className="nav-link">
            <FaUser /> Profile
          </Link>

          <button onClick={handleLogout} className="nav-link logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        </div>

        <div className="navbar-user">
          <span className="user-name">
            {user?.hackerName || user?.username}
          </span>
          <span className="user-role">{user?.role}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

