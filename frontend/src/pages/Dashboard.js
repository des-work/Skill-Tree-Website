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
              <radialGradient id="crownFill" cx="50%" cy="42%" r="62%">
                <stop offset="0%" stopColor="rgba(0,255,170,0.09)"/>
                <stop offset="55%" stopColor="rgba(0,255,170,0.035)"/>
                <stop offset="100%" stopColor="rgba(0,255,170,0)"/>
              </radialGradient>
              <radialGradient id="crownInner" cx="50%" cy="48%" r="52%">
                <stop offset="0%" stopColor="rgba(0,255,170,0.18)"/>
                <stop offset="100%" stopColor="rgba(0,255,170,0)"/>
              </radialGradient>
              <linearGradient id="branchCore" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(0,255,170,0.06)"/>
                <stop offset="50%" stopColor="rgba(120,255,220,0.28)"/>
                <stop offset="100%" stopColor="rgba(0,255,170,0.06)"/>
              </linearGradient>
              <radialGradient id="nodePulse" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(180,255,235,0.95)"/>
                <stop offset="55%" stopColor="rgba(0,255,170,0.55)"/>
                <stop offset="100%" stopColor="rgba(0,255,170,0)"/>
              </radialGradient>
            </defs>

            {/* Layer 1: Soft silhouette only (tree form, not a balloon) */}
            <g className="canopy-silhouette-layer">
              <path
                className="canopy-outline"
                d="
                  M700,780
                  C696,738 694,706 692,676
                  C618,648 536,607 454,552
                  C370,496 286,432 220,362
                  C162,302 126,243 124,195
                  C124,150 152,116 198,104
                  C175,76 177,46 204,28
                  C240,7 292,10 336,36
                  C373,12 425,-2 486,8
                  C550,18 604,8 660,2
                  C674,1 687,0 700,0
                  C713,0 726,1 740,2
                  C796,8 850,18 914,8
                  C975,-2 1027,12 1064,36
                  C1108,10 1160,7 1196,28
                  C1223,46 1225,76 1202,104
                  C1248,116 1276,150 1276,195
                  C1274,243 1238,302 1180,362
                  C1114,432 1030,496 946,552
                  C864,607 782,648 708,676
                  C706,706 704,738 700,780
                  Z
                "
                fill="url(#crownFill)"
                stroke="rgba(0,255,170,0.24)"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </g>

            {/* Layer 2: Branch architecture + lumens */}
            <g className="canopy-inner-layer">
              <ellipse cx="700" cy="295" rx="500" ry="235" fill="url(#crownInner)" opacity="0.42" />
              <g className="canopy-branches">
                {/* Trunk and primary scaffold */}
                <path d="M700,675 C700,615 700,542 700,452" stroke="url(#branchCore)" strokeWidth="15" fill="none" strokeLinecap="round"/>
                <path d="M700,545 C610,500 490,438 355,366" stroke="url(#branchCore)" strokeWidth="8" fill="none" strokeLinecap="round"/>
                <path d="M700,545 C790,500 910,438 1045,366" stroke="url(#branchCore)" strokeWidth="8" fill="none" strokeLinecap="round"/>
                <path d="M700,470 C630,398 530,302 420,204" stroke="url(#branchCore)" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
                <path d="M700,470 C770,398 870,302 980,204" stroke="url(#branchCore)" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
                <path d="M700,435 C700,346 700,242 700,130" stroke="url(#branchCore)" strokeWidth="4.5" fill="none" strokeLinecap="round"/>

                {/* Secondary boughs */}
                <path d="M355,366 C286,332 218,286 166,234" stroke="rgba(120,255,220,0.22)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                <path d="M355,366 C300,382 236,406 174,432" stroke="rgba(120,255,220,0.18)" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
                <path d="M420,204 C340,166 260,124 205,86" stroke="rgba(120,255,220,0.18)" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <path d="M980,204 C1060,166 1140,124 1195,86" stroke="rgba(120,255,220,0.18)" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <path d="M1045,366 C1114,332 1182,286 1234,234" stroke="rgba(120,255,220,0.22)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                <path d="M1045,366 C1100,382 1164,406 1226,432" stroke="rgba(120,255,220,0.18)" strokeWidth="3.2" fill="none" strokeLinecap="round"/>

                {/* Filament branches for organic-circuit feel */}
                <path d="M560,388 C498,352 434,322 372,295" stroke="rgba(180,255,235,0.15)" strokeWidth="1.7" fill="none"/>
                <path d="M560,388 C505,418 450,442 398,468" stroke="rgba(180,255,235,0.13)" strokeWidth="1.6" fill="none"/>
                <path d="M630,304 C575,262 522,226 468,190" stroke="rgba(180,255,235,0.14)" strokeWidth="1.7" fill="none"/>
                <path d="M770,304 C825,262 878,226 932,190" stroke="rgba(180,255,235,0.14)" strokeWidth="1.7" fill="none"/>
                <path d="M840,388 C902,352 966,322 1028,295" stroke="rgba(180,255,235,0.15)" strokeWidth="1.7" fill="none"/>
                <path d="M840,388 C895,418 950,442 1002,468" stroke="rgba(180,255,235,0.13)" strokeWidth="1.6" fill="none"/>
                <path d="M480,254 C430,228 380,198 338,170" stroke="rgba(180,255,235,0.12)" strokeWidth="1.4" fill="none"/>
                <path d="M920,254 C970,228 1020,198 1062,170" stroke="rgba(180,255,235,0.12)" strokeWidth="1.4" fill="none"/>
                <path d="M700,212 C650,182 602,156 560,132" stroke="rgba(180,255,235,0.12)" strokeWidth="1.5" fill="none"/>
                <path d="M700,212 C750,182 798,156 840,132" stroke="rgba(180,255,235,0.12)" strokeWidth="1.5" fill="none"/>
              </g>

              {/* Foliage volume pockets (subtle, branch-led silhouette) */}
              {[
                [210,112,78,52],[332,84,74,50],[468,62,76,50],[620,52,78,52],[780,52,78,52],[932,62,76,50],[1068,84,74,50],[1190,112,78,52],
                [176,188,72,48],[300,166,70,46],[432,146,72,48],[570,132,74,50],[700,124,80,52],[830,132,74,50],[968,146,72,48],[1100,166,70,46],[1224,188,72,48],
                [160,274,68,45],[286,252,68,45],[426,236,70,46],[568,224,72,48],[700,216,74,50],[832,224,72,48],[974,236,70,46],[1114,252,68,45],[1240,274,68,45],
                [194,352,64,42],[326,334,64,42],[468,318,66,44],[618,306,68,45],[782,306,68,45],[932,318,66,44],[1074,334,64,42],[1206,352,64,42],
                [248,426,60,40],[390,408,62,41],[548,394,64,42],[700,386,66,44],[852,394,64,42],[1010,408,62,41],[1152,426,60,40],
              ].map(([cx, cy, rx, ry], i) => (
                <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#crownInner)" opacity={0.18 + (i % 4) * 0.05} />
              ))}

              {/* Junction nodes / bio-electric bulbs */}
              {[
                [700,454,7],[700,382,6],[620,432,5.5],[780,432,5.5],[560,390,4.8],[840,390,4.8],[496,350,4.2],[904,350,4.2],
                [432,306,4],[968,306,4],[372,270,3.6],[1028,270,3.6],[300,224,3.4],[1100,224,3.4],[246,180,3.2],[1154,180,3.2],
                [700,286,4.5],[640,256,3.8],[760,256,3.8],[700,212,3.6],[560,172,3.1],[840,172,3.1],
              ].map(([x, y, r], i) => (
                <circle key={`n${i}`} cx={x} cy={y} r={r} fill="url(#nodePulse)" opacity="0.85">
                  <animate attributeName="opacity" values="0.35;0.95;0.35" dur={`${2.2 + (i % 5) * 0.45}s`} begin={`${(i % 7) * 0.2}s`} repeatCount="indefinite" />
                </circle>
              ))}

              {/* Ambient spark dust */}
              {[
                [126,134],[220,92],[308,70],[398,54],[510,38],[620,28],[780,28],[890,38],[1002,54],[1092,70],[1180,92],[1274,134],
                [148,230],[246,206],[342,182],[456,166],[582,154],[818,154],[944,166],[1058,182],[1154,206],[1252,230],
                [182,320],[286,296],[394,278],[510,266],[638,258],[762,258],[890,266],[1006,278],[1114,296],[1218,320],
                [248,404],[362,384],[486,370],[614,362],[786,362],[914,370],[1038,384],[1152,404],
              ].map(([x,y],i) => (
                <circle key={`s${i}`} cx={x} cy={y} r={i % 6 === 0 ? 2.3 : 1.4} fill="#8fffe0" opacity="0.34">
                  <animate attributeName="opacity" values="0.08;0.45;0.08" dur={`${3.2 + (i % 4) * 0.7}s`} begin={`${i * 0.18}s`} repeatCount="indefinite"/>
                </circle>
              ))}
            </g>
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
