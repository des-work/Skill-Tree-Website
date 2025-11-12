import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get('/skill-trees/dashboard');
      setDashboard(response.data);
    } catch (err) {
      setError('Failed to load dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'hands-on': '#e74c3c',
      'certification': '#3498db',
      'lab-work': '#2ecc71',
      'development': '#f39c12',
      'physical': '#9b59b6',
      'wellness': '#1abc9c',
      'ai-security': '#e67e22',
    };
    return colors[category] || '#95a5a6';
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="page-container"><div className="error">{error}</div></div>;
  }

  const stats = dashboard?.stats || {};
  const totalCompleted = stats.completed_nodes || 0;
  const totalInProgress = stats.in_progress_nodes || 0;
  const totalUnlocked = stats.unlocked_nodes || 0;
  const totalNodes = stats.total_nodes || 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Welcome back, {user?.hackerName || user?.username}! 🚀</h1>
        <p>Track your progress across different cybersecurity skill areas</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{totalCompleted}</h3>
          <p>Completed</p>
        </div>
        <div className="stat-card">
          <h3>{totalInProgress}</h3>
          <p>In Progress</p>
        </div>
        <div className="stat-card">
          <h3>{totalUnlocked}</h3>
          <p>Unlocked</p>
        </div>
        <div className="stat-card">
          <h3>{totalNodes}</h3>
          <p>Total Nodes</p>
        </div>
      </div>

      <h2 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>
        Skill Trees
      </h2>

      <div className="trees-grid">
        {dashboard?.trees?.map((tree) => {
          const progress = calculateProgress(tree.completedNodes, tree.totalNodes);
          return (
            <div
              key={tree.id}
              className="tree-card"
              onClick={() => navigate(`/skill-tree/${tree.id}`)}
            >
              <div
                className="tree-category"
                style={{ backgroundColor: `${getCategoryColor(tree.category)}33` }}
              >
                {tree.category?.replace('-', ' ')}
              </div>
              <h3>{tree.name}</h3>
              <p>{tree.description}</p>
              
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="progress-text">
                {tree.completedNodes} / {tree.totalNodes} completed ({progress}%)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;

