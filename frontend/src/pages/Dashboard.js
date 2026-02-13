import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  FaFlag, FaCloud, FaFlask, FaCode, FaKey, FaHeartbeat, 
  FaRobot, FaSearch, FaShieldAlt, FaTerminal
} from 'react-icons/fa';

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCanopy, setShowCanopy] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  // Defer tree canvas so initial load is fast
  useEffect(() => {
    const t = setTimeout(() => setShowCanopy(true), 100);
    return () => clearTimeout(t);
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get('/skill-trees/dashboard');
      setDashboard(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.status === 401
        ? 'Please log in again.'
        : 'Failed to load dashboard. Check that the backend is running (e.g. npm run dev in the backend folder).');
      setDashboard(null);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const getTreeIcon = (name) => {
    const icons = {
      'Capture the Flag': FaFlag,
      'Cloud Specialty': FaCloud,
      'Lab Man': FaFlask,
      'Coding': FaCode,
      'Lock Picking': FaKey,
      'Health Tracking': FaHeartbeat,
      'AI Deception and Social Engineering': FaRobot,
      'AI Model Forensics': FaSearch,
    };
    return icons[name] || FaShieldAlt;
  };

  const getTreeColor = (category) => {
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
    return (
      <div className="cyber-loading">
        <div className="loading-spinner"></div>
        <p>Accessing the World Tree...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error">{error}</div>
        <button type="button" className="retry-btn" onClick={() => { setError(''); setLoading(true); loadDashboard(); }}>
          Retry
        </button>
      </div>
    );
  }

  const stats = dashboard?.stats || {};
  const totalCompleted = stats.completed_nodes || 0;
  const totalInProgress = stats.in_progress_nodes || 0;
  const totalUnlocked = stats.unlocked_nodes || 0;
  const totalNodes = stats.total_nodes || 0;
  const trees = dashboard?.trees || [];

  // Arrange trees into branch levels
  // Level 0 (top crown): trees[6], trees[7]  (AI pair)
  // Level 1: trees[4], trees[5]
  // Level 2: trees[2], trees[3]
  // Level 3 (low branches): trees[0], trees[1]
  const branchLevels = [];
  for (let i = 0; i < trees.length; i += 2) {
    const left = trees[i] || null;
    const right = trees[i + 1] || null;
    branchLevels.push({ left, right });
  }
  // Reverse so top of tree = last items (AI topics at crown)
  branchLevels.reverse();

  const renderFruitCard = (tree, side) => {
    if (!tree) return <div className="fruit-placeholder"></div>;
    const progress = calculateProgress(tree.completedNodes, tree.totalNodes);
    const Icon = getTreeIcon(tree.name);
    const color = getTreeColor(tree.category);

    return (
      <div
        className={`fruit-card fruit-${side}`}
        onClick={() => navigate(`/skill-tree/${tree.id}`)}
        style={{ '--fruit-color': color }}
      >
        <div className="fruit-glow"></div>
        <div className="fruit-icon-wrap">
          <Icon className="fruit-icon" />
        </div>
        <div className="fruit-info">
          <span className="fruit-category">{tree.category?.replace('-', ' ')}</span>
          <h3>{tree.name}</h3>
          <p>{tree.description}</p>
          <div className="fruit-progress-row">
            <div className="fruit-progress-track">
              <div className="fruit-progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="fruit-pct">{progress}%</span>
          </div>
          <span className="fruit-nodes">{tree.completedNodes}/{tree.totalNodes} nodes</span>
        </div>
      </div>
    );
  };

  return (
    <div className="yggdrasil-page">
      {/* ===== YGGDRASIL STARFIELD ===== */}
      <div className="ygg-stars">
        {[...Array(80)].map((_, i) => (
          <span key={i} className={`star s${i % 4}`} style={{
            left: `${(i * 13 + 7) % 100}%`,
            top: `${(i * 17 + 11) % 100}%`,
            animationDelay: `${(i % 5) * 0.5}s`
          }} />
        ))}
      </div>

      {/* ===== THE WORLD TREE BACKGROUND ===== */}
      <div className="world-tree-bg">
        {/* Roots at the bottom */}
        <svg className="tree-roots-svg" viewBox="0 0 1200 200" preserveAspectRatio="none">
          <path d="M600,0 C600,60 500,100 350,160 Q280,190 200,200" fill="none" stroke="rgba(0,255,170,0.08)" strokeWidth="3"/>
          <path d="M600,0 C600,60 700,100 850,160 Q920,190 1000,200" fill="none" stroke="rgba(0,255,170,0.08)" strokeWidth="3"/>
          <path d="M600,0 C590,80 450,120 250,180 Q180,195 100,200" fill="none" stroke="rgba(0,255,170,0.05)" strokeWidth="2"/>
          <path d="M600,0 C610,80 750,120 950,180 Q1020,195 1100,200" fill="none" stroke="rgba(0,255,170,0.05)" strokeWidth="2"/>
          <path d="M600,0 C595,40 560,90 480,140 Q440,165 380,200" fill="none" stroke="rgba(0,255,170,0.04)" strokeWidth="1.5"/>
          <path d="M600,0 C605,40 640,90 720,140 Q760,165 820,200" fill="none" stroke="rgba(0,255,170,0.04)" strokeWidth="1.5"/>
        </svg>

        {/* Floating digital leaves */}
        <div className="digi-leaf dl-1"></div>
        <div className="digi-leaf dl-2"></div>
        <div className="digi-leaf dl-3"></div>
        <div className="digi-leaf dl-4"></div>
        <div className="digi-leaf dl-5"></div>
        <div className="digi-leaf dl-6"></div>
        <div className="digi-leaf dl-7"></div>
        <div className="digi-leaf dl-8"></div>
        <div className="digi-leaf dl-9"></div>
        <div className="digi-leaf dl-10"></div>
        <div className="digi-leaf dl-11"></div>
        <div className="digi-leaf dl-12"></div>
      </div>

      {/* ===== TREE CANOPY BACKGROUND (deferred for faster initial load) ===== */}
      {showCanopy && (
        <div className="tree-canopy-bg">
          <svg viewBox="0 0 1400 800" preserveAspectRatio="xMidYMax meet" className="canopy-svg">
            <defs>
              <radialGradient id="crownFill" cx="50%" cy="42%" r="52%">
                <stop offset="0%" stopColor="rgba(0,255,170,0.14)"/>
                <stop offset="65%" stopColor="rgba(0,255,170,0.05)"/>
                <stop offset="100%" stopColor="rgba(0,255,170,0.01)"/>
              </radialGradient>
              <radialGradient id="crownInner" cx="50%" cy="45%" r="45%">
                <stop offset="0%" stopColor="rgba(0,255,170,0.12)"/>
                <stop offset="100%" stopColor="rgba(0,255,170,0)"/>
              </radialGradient>
            </defs>

            {/* Single clean canopy silhouette */}
            <path
              className="canopy-outline"
              d="
                M700,800
                C690,745 685,690 685,645
                C620,610 545,565 475,510
                C385,440 325,360 285,290
                C255,235 260,185 295,150
                C335,110 400,90 470,95
                C505,50 565,20 635,18
                C680,16 725,24 760,45
                C805,20 860,10 915,18
                C985,28 1045,62 1080,110
                C1150,112 1210,140 1248,188
                C1283,232 1290,290 1265,345
                C1235,410 1180,470 1100,525
                C1030,573 955,615 885,645
                C885,690 880,745 870,800
                Z
              "
              fill="url(#crownFill)"
              stroke="rgba(0,255,170,0.32)"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />

            {/* Soft inner body to avoid multiple canopy edges */}
            <ellipse cx="700" cy="330" rx="430" ry="255" fill="url(#crownInner)" opacity="0.85" />

            {/* Branch network (reduced and cleaner) */}
            <g className="canopy-branches">
              <path d="M700,640 C700,540 700,470 700,400" stroke="rgba(0,255,170,0.18)" strokeWidth="16" fill="none" strokeLinecap="round"/>
              <path d="M700,500 C645,455 565,410 470,370" stroke="rgba(0,255,170,0.15)" strokeWidth="6" fill="none" strokeLinecap="round"/>
              <path d="M700,500 C755,455 835,410 930,370" stroke="rgba(0,255,170,0.15)" strokeWidth="6" fill="none" strokeLinecap="round"/>
              <path d="M700,470 C660,400 615,315 575,235" stroke="rgba(0,255,170,0.12)" strokeWidth="4" fill="none" strokeLinecap="round"/>
              <path d="M700,470 C740,400 785,315 825,235" stroke="rgba(0,255,170,0.12)" strokeWidth="4" fill="none" strokeLinecap="round"/>
              <path d="M700,430 C700,330 700,250 700,170" stroke="rgba(0,255,170,0.12)" strokeWidth="4" fill="none" strokeLinecap="round"/>
            </g>

            {/* Minimal foliage clusters for detail without clutter */}
            {[
              [520,250,70,55],[620,200,65,50],[700,175,70,52],[780,200,65,50],[880,250,70,55],
              [450,320,75,60],[570,300,72,58],[700,290,78,60],[830,300,72,58],[950,320,75,60],
              [520,395,70,55],[700,395,75,58],[880,395,70,55]
            ].map(([cx, cy, rx, ry], i) => (
              <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#crownInner)" opacity="0.62" />
            ))}
          </svg>
        </div>
      )}

      <div className="page-container ygg-content">
        {/* ===== HERO / CROWN OF THE TREE ===== */}
        <div className="ygg-hero">
          <div className="crown-glow"></div>
          <FaTerminal className="hero-terminal-icon" />
          <h1>
            <span className="hero-small">Welcome back,</span>
            <span className="hero-big">{user?.hackerName || user?.username}</span>
          </h1>
          <p className="hero-sub"><span className="prompt-char">$</span> Navigate the CyberSec World Tree</p>
        </div>

        {/* ===== STATS (Rune Stones) ===== */}
        <div className="rune-stones">
          <div className="rune" style={{'--rune-color':'#2ecc71'}}>
            <span className="rune-val">{totalCompleted}</span>
            <span className="rune-label">Completed</span>
          </div>
          <div className="rune" style={{'--rune-color':'#3498db'}}>
            <span className="rune-val">{totalInProgress}</span>
            <span className="rune-label">In Progress</span>
          </div>
          <div className="rune" style={{'--rune-color':'#f39c12'}}>
            <span className="rune-val">{totalUnlocked}</span>
            <span className="rune-label">Unlocked</span>
          </div>
          <div className="rune" style={{'--rune-color':'#9b59b6'}}>
            <span className="rune-val">{totalNodes}</span>
            <span className="rune-label">Total Nodes</span>
          </div>
        </div>

        {/* ===== THE TREE ===== */}
        <div className="ygg-tree">
          {/* Crown canopy glow */}
          <div className="canopy-glow"></div>

          {/* Trunk */}
          <div className="trunk">
            <div className="bark-circuit bc-1"></div>
            <div className="bark-circuit bc-2"></div>
            <div className="bark-circuit bc-3"></div>
            <div className="trunk-energy"></div>
          </div>

          {/* Branch levels */}
          {branchLevels.map((level, i) => (
            <div className="branch-row" key={i}>
              {/* Left branch + fruit */}
              <div className="branch-side branch-left-side">
                <div className="branch-arm branch-arm-left">
                  <div className="branch-leaves">
                    <span className="cyber-leaf cl-a"></span>
                    <span className="cyber-leaf cl-b"></span>
                    <span className="cyber-leaf cl-c"></span>
                  </div>
                </div>
                {renderFruitCard(level.left, 'left')}
              </div>

              {/* Trunk node (junction) */}
              <div className="trunk-node">
                <div className="node-dot"></div>
              </div>

              {/* Right branch + fruit */}
              <div className="branch-side branch-right-side">
                <div className="branch-arm branch-arm-right">
                  <div className="branch-leaves">
                    <span className="cyber-leaf cl-a"></span>
                    <span className="cyber-leaf cl-b"></span>
                    <span className="cyber-leaf cl-c"></span>
                  </div>
                </div>
                {renderFruitCard(level.right, 'right')}
              </div>
            </div>
          ))}

          {/* Root base */}
          <div className="tree-base">
            <div className="root-spread"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
