import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaSignOutAlt, FaTasks, FaThLarge, FaTree, FaTable, FaUsers } from 'react-icons/fa';
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
      {/* SVG Tree Crown — Subtle accent branches */}
      <div className="tree-crown">
        <svg className="crown-svg" viewBox="0 0 1200 30" preserveAspectRatio="none">
          {/* Subtle branches from center */}
          <path d="M600,30 Q550,20 480,5" stroke="rgba(0,255,170,0.25)" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M600,30 Q650,20 720,5" stroke="rgba(0,255,170,0.25)" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M600,30 Q520,18 420,3" stroke="rgba(0,255,170,0.2)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M600,30 Q680,18 780,3" stroke="rgba(0,255,170,0.2)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          
          {/* Small glow particles */}
          <circle cx="480" cy="5" r="2" fill="#00ffaa" opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="720" cy="5" r="2" fill="#00ffaa" opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" begin="0.5s" repeatCount="indefinite"/>
          </circle>
        </svg>

        {/* Hexagonal leaves - fewer and smaller */}
        <div className="crown-leaf-cluster cl-left-1"><span></span></div>
        <div className="crown-leaf-cluster cl-right-1"><span></span></div>
      </div>

      {/* Trunk extending down from navbar */}
      <div className="tree-from-nav"></div>

      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <FaTree className="brand-tree-icon" /> 
          <span className="brand-text">CyberSec<span className="brand-accent">Tree</span></span>
        </Link>

        <div className="navbar-links">
          <Link to="/dashboard" className="nav-link">
            <FaThLarge /> Dashboard
          </Link>

          {user?.role === 'admin' && (
            <>
              <Link to="/admin/reviews" className="nav-link">
                <FaTasks /> Reviews
              </Link>
              <Link to="/admin/gradebook" className="nav-link">
                <FaTable /> Gradebook
              </Link>
              <Link to="/admin/users" className="nav-link">
                <FaUsers /> Users
              </Link>
            </>
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
