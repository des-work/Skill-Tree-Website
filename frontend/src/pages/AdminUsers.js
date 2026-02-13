import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './AdminUsers.css';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersRes, promoRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/promotions'),
      ]);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setPromotions(Array.isArray(promoRes.data) ? promoRes.data : []);
      setError(null);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError(err.response?.status === 403 ? 'Admin access required.' : 'Failed to load user data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const flash = (msg, isError = false) => {
    setActionMsg({ text: msg, isError });
    setTimeout(() => setActionMsg(null), 4000);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      flash(`Role updated to ${newRole}`);
      loadData();
    } catch (err) {
      flash(err.response?.data?.error || 'Failed to update role', true);
    }
  };

  const handleRequestPromotion = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/promote`);
      flash('Admin promotion request created. Another admin must approve it.');
      loadData();
    } catch (err) {
      flash(err.response?.data?.error || 'Failed to request promotion', true);
    }
  };

  const handleResolvePromotion = async (promotionId, approve) => {
    try {
      await api.post(`/admin/promotions/${promotionId}/resolve`, { approve });
      flash(approve ? 'Promotion approved!' : 'Promotion rejected.');
      loadData();
    } catch (err) {
      flash(err.response?.data?.error || 'Failed to resolve promotion', true);
    }
  };

  const hasPendingPromotion = (userId) => promotions.some((p) => p.target_user_id === userId);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="page-container admin-users-page">
      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage roles and admin promotions</p>
      </div>

      {error && (
        <div className="au-error"><p>{error}</p></div>
      )}

      {actionMsg && (
        <div className={`au-flash ${actionMsg.isError ? 'au-flash-error' : 'au-flash-success'}`}>
          {actionMsg.text}
        </div>
      )}

      {/* ── Pending Admin Promotions ── */}
      {promotions.length > 0 && (
        <div className="au-section">
          <h2>Pending Admin Promotions</h2>
          <p className="au-section-desc">These promotion requests need approval from a different admin.</p>
          <div className="au-promo-list">
            {promotions.map((p) => (
              <div key={p.id} className="au-promo-card card">
                <div className="au-promo-info">
                  <strong>{p.target_username}</strong>
                  <span className="au-promo-role">{p.target_current_role} → admin</span>
                  <span className="au-promo-by">Requested by: {p.requested_by_username}</span>
                </div>
                <div className="au-promo-actions">
                  {p.requested_by !== currentUser?.userId ? (
                    <>
                      <button className="btn btn-success btn-sm" onClick={() => handleResolvePromotion(p.id, true)}>
                        Approve
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleResolvePromotion(p.id, false)}>
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="au-promo-waiting">Awaiting another admin</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── All Users ── */}
      <div className="au-section">
        <h2>All Users ({users.length})</h2>
        <div className="au-table-wrap">
          <table className="au-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Hacker Name</th>
                <th>Current Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u.id === currentUser?.userId;
                const isAdmin = u.role === 'admin';
                return (
                  <tr key={u.id} className={isSelf ? 'au-row-self' : ''}>
                    <td className="au-username">{u.username} {isSelf && <span className="au-you">(you)</span>}</td>
                    <td className="au-email">{u.email}</td>
                    <td>{u.hacker_name || '—'}</td>
                    <td>
                      <span className={`au-role-badge role-${u.role}`}>{u.role}</span>
                    </td>
                    <td className="au-date">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="au-actions">
                      {isSelf ? (
                        <span className="au-no-action">—</span>
                      ) : isAdmin ? (
                        <span className="au-no-action">Admin</span>
                      ) : (
                        <div className="au-action-btns">
                          {u.role !== 'student' && (
                            <button className="btn btn-sm btn-outline" onClick={() => handleRoleChange(u.id, 'student')}>
                              Set Student
                            </button>
                          )}
                          {u.role !== 'instructor' && (
                            <button className="btn btn-sm btn-outline" onClick={() => handleRoleChange(u.id, 'instructor')}>
                              Set Instructor
                            </button>
                          )}
                          {!hasPendingPromotion(u.id) ? (
                            <button className="btn btn-sm btn-primary" onClick={() => handleRequestPromotion(u.id)}>
                              Promote to Admin
                            </button>
                          ) : (
                            <span className="au-pending-badge">Promotion Pending</span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
