import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import './AdminGradebook.css';

const AdminGradebook = () => {
  const [gradebook, setGradebook] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('summary'); // 'summary' | 'detailed'
  const [filterStudent, setFilterStudent] = useState('');
  const [filterTree, setFilterTree] = useState('');
  const [sortField, setSortField] = useState('username');
  const [sortDir, setSortDir] = useState('asc');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [gradebookRes, summaryRes] = await Promise.all([
        api.get('/admin/gradebook'),
        api.get('/admin/student-summary'),
      ]);
      setGradebook(Array.isArray(gradebookRes.data) ? gradebookRes.data : []);
      setSummary(Array.isArray(summaryRes.data) ? summaryRes.data : []);
      setError(null);
    } catch (err) {
      console.error('Failed to load gradebook:', err);
      if (err.response?.status === 403) {
        setError('Admin access required to view the gradebook.');
      } else {
        setError('Failed to load gradebook data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = (s) => {
    if (!s) return 'Not Started';
    const labels = {
      locked: 'Not Started',
      unlocked: 'Unlocked',
      in_progress: 'In Progress',
      completed: 'Submitted',
      reviewed: 'Reviewed',
    };
    return labels[s] || s;
  };

  const statusClass = (s) => {
    if (!s) return 'status-none';
    return `status-${s.replace('_', '-')}`;
  };

  // ── Summary view sorting ──
  const sortedSummary = useMemo(() => {
    const list = [...summary].filter(
      (s) => !filterStudent || s.username.toLowerCase().includes(filterStudent.toLowerCase())
    );
    list.sort((a, b) => {
      let va = a[sortField] ?? '';
      let vb = b[sortField] ?? '';
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [summary, filterStudent, sortField, sortDir]);

  // ── Detailed view ──
  const treeNames = useMemo(() => {
    const set = new Set(gradebook.map((g) => g.tree_name));
    return Array.from(set).sort();
  }, [gradebook]);

  const filteredGradebook = useMemo(() => {
    return gradebook.filter((row) => {
      if (filterStudent && !row.username.toLowerCase().includes(filterStudent.toLowerCase())) return false;
      if (filterTree && row.tree_name !== filterTree) return false;
      return true;
    });
  }, [gradebook, filterStudent, filterTree]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sortArrow = (field) => {
    if (sortField !== field) return '';
    return sortDir === 'asc' ? ' ▲' : ' ▼';
  };

  const parseSubmission = (raw) => {
    if (!raw) return { url: '', fileUrl: '', fileName: '' };
    try {
      const p = JSON.parse(raw);
      if (p && typeof p === 'object') return { url: p.url || '', fileUrl: p.fileUrl || '', fileName: p.fileName || '' };
    } catch (_) {}
    return { url: raw, fileUrl: '', fileName: '' };
  };

  const exportCSV = () => {
    const rows = [['Student', 'Email', 'Hacker Name', 'Skill Tree', 'Node', 'Level', 'Max Points', 'Status', 'Submitted At', 'Review Notes', 'Reviewed At']];
    for (const r of filteredGradebook) {
      rows.push([
        r.username, r.email, r.hacker_name || '', r.tree_name, r.node_title,
        r.node_level, r.max_points, statusLabel(r.status),
        r.submitted_at || '', r.review_notes || '', r.reviewed_at || '',
      ]);
    }
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gradebook_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading gradebook...</p>
      </div>
    );
  }

  return (
    <div className="page-container gradebook-page">
      <div className="page-header">
        <h1>Gradebook</h1>
        <p>Track all student grades, submissions, and progress</p>
      </div>

      {error && (
        <div className="card" style={{ backgroundColor: 'rgba(255,68,68,0.15)', borderColor: '#ff4444', color: '#ff6b6b', marginBottom: 20, padding: 16 }}>
          <p>{error}</p>
        </div>
      )}

      {/* Controls */}
      <div className="gradebook-controls">
        <div className="gradebook-tabs">
          <button className={`gb-tab ${view === 'summary' ? 'active' : ''}`} onClick={() => setView('summary')}>
            Summary
          </button>
          <button className={`gb-tab ${view === 'detailed' ? 'active' : ''}`} onClick={() => setView('detailed')}>
            Detailed
          </button>
        </div>

        <div className="gradebook-filters">
          <input
            type="text"
            placeholder="Filter by student..."
            value={filterStudent}
            onChange={(e) => setFilterStudent(e.target.value)}
            className="gb-filter-input"
          />
          {view === 'detailed' && (
            <select value={filterTree} onChange={(e) => setFilterTree(e.target.value)} className="gb-filter-select">
              <option value="">All Skill Trees</option>
              {treeNames.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          )}
          <button onClick={exportCSV} className="btn btn-primary gb-export-btn">
            Export CSV
          </button>
        </div>
      </div>

      {/* ── Summary View ── */}
      {view === 'summary' && (
        <div className="gradebook-table-wrap">
          <table className="gradebook-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('username')} className="sortable">Student{sortArrow('username')}</th>
                <th onClick={() => handleSort('hacker_name')} className="sortable">Hacker Name{sortArrow('hacker_name')}</th>
                <th onClick={() => handleSort('email')} className="sortable">Email{sortArrow('email')}</th>
                <th onClick={() => handleSort('completed_nodes')} className="sortable">Completed{sortArrow('completed_nodes')}</th>
                <th onClick={() => handleSort('in_progress_nodes')} className="sortable">In Progress{sortArrow('in_progress_nodes')}</th>
                <th onClick={() => handleSort('total_started')} className="sortable">Total Started{sortArrow('total_started')}</th>
                <th onClick={() => handleSort('earned_points')} className="sortable">Points Earned{sortArrow('earned_points')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedSummary.length === 0 ? (
                <tr><td colSpan="7" className="gb-empty">No students found</td></tr>
              ) : (
                sortedSummary.map((s) => (
                  <tr key={s.user_id}>
                    <td className="gb-student">{s.username}</td>
                    <td>{s.hacker_name || '—'}</td>
                    <td className="gb-email">{s.email}</td>
                    <td className="gb-num">{s.completed_nodes}</td>
                    <td className="gb-num">{s.in_progress_nodes}</td>
                    <td className="gb-num">{s.total_started}</td>
                    <td className="gb-num gb-points">{s.earned_points}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Detailed View ── */}
      {view === 'detailed' && (
        <div className="gradebook-table-wrap">
          <table className="gradebook-table detailed">
            <thead>
              <tr>
                <th>Student</th>
                <th>Skill Tree</th>
                <th>Node</th>
                <th>Lvl</th>
                <th>Points</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Submission</th>
                <th>Review Notes</th>
                <th>Reviewed</th>
              </tr>
            </thead>
            <tbody>
              {filteredGradebook.length === 0 ? (
                <tr><td colSpan="10" className="gb-empty">No records found</td></tr>
              ) : (
                filteredGradebook.map((r, i) => {
                  const sub = parseSubmission(r.submission_url);
                  return (
                    <tr key={i} className={r.status ? '' : 'gb-row-empty'}>
                      <td className="gb-student">{r.username}</td>
                      <td className="gb-tree">{r.tree_name}</td>
                      <td>{r.node_title}</td>
                      <td className="gb-num">{r.node_level}</td>
                      <td className="gb-num">{r.max_points}</td>
                      <td><span className={`gb-status ${statusClass(r.status)}`}>{statusLabel(r.status)}</span></td>
                      <td className="gb-date">{r.submitted_at ? new Date(r.submitted_at).toLocaleDateString() : '—'}</td>
                      <td className="gb-submission">
                        {sub.url && <a href={sub.url} target="_blank" rel="noopener noreferrer">Link</a>}
                        {sub.url && sub.fileUrl && ' | '}
                        {sub.fileUrl && <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer">{sub.fileName || 'File'}</a>}
                        {!sub.url && !sub.fileUrl && '—'}
                      </td>
                      <td className="gb-notes">{r.review_notes || '—'}</td>
                      <td className="gb-date">{r.reviewed_at ? new Date(r.reviewed_at).toLocaleDateString() : '—'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminGradebook;
