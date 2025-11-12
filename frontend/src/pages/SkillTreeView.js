import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaLock, FaPlay, FaCheck, FaClipboardCheck } from 'react-icons/fa';
import './SkillTreeView.css';

const SkillTreeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadSkillTree();
  }, [id]);

  const loadSkillTree = async () => {
    try {
      const response = await api.get(`/skill-trees/${id}/progress`);
      setTree(response.data);
    } catch (err) {
      console.error('Failed to load skill tree:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'locked':
        return <FaLock />;
      case 'unlocked':
        return <FaPlay />;
      case 'in_progress':
        return <FaPlay />;
      case 'completed':
      case 'reviewed':
        return <FaCheck />;
      default:
        return <FaLock />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'locked':
        return '#7f8c8d';
      case 'unlocked':
        return '#3498db';
      case 'in_progress':
        return '#f39c12';
      case 'completed':
        return '#2ecc71';
      case 'reviewed':
        return '#27ae60';
      default:
        return '#7f8c8d';
    }
  };

  const handleStartNode = async (nodeId) => {
    try {
      await api.post(`/progress/nodes/${nodeId}/start`);
      loadSkillTree();
    } catch (err) {
      console.error('Failed to start node:', err);
    }
  };

  const handleUnlockNode = async (nodeId) => {
    try {
      await api.post(`/progress/nodes/${nodeId}/unlock`);
      loadSkillTree();
    } catch (err) {
      console.error('Failed to unlock node:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedNode) return;

    setSubmitting(true);
    try {
      await api.post(`/progress/nodes/${selectedNode.id}/submit`, {
        submissionUrl,
        submissionNotes,
      });
      setSelectedNode(null);
      setSubmissionUrl('');
      setSubmissionNotes('');
      loadSkillTree();
    } catch (err) {
      console.error('Failed to submit:', err);
      alert('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading skill tree...</div>;
  }

  if (!tree) {
    return <div className="page-container"><div className="error">Skill tree not found</div></div>;
  }

  return (
    <div className="page-container">
      <button onClick={() => navigate('/dashboard')} className="btn btn-primary back-btn">
        ← Back to Dashboard
      </button>

      <div className="page-header">
        <h1>{tree.name}</h1>
        <p>{tree.description}</p>
      </div>

      <div className="skill-tree-container">
        <div className="skill-nodes">
          {tree.nodes?.map((node) => {
            const status = node.userProgress?.status || 'locked';
            const isLocked = status === 'locked';
            const isCompleted = status === 'completed' || status === 'reviewed';

            return (
              <div
                key={node.id}
                className={`skill-node ${status}`}
                style={{ borderColor: getStatusColor(status) }}
              >
                <div className="node-header">
                  <div className="node-level">Level {node.level}</div>
                  <div
                    className="node-status-icon"
                    style={{ color: getStatusColor(status) }}
                  >
                    {getStatusIcon(status)}
                  </div>
                </div>

                <h3>{node.title}</h3>
                <p className="node-description">{node.description}</p>

                <div className="node-requirements">
                  <strong>Requirements:</strong>
                  <p>{node.submission_requirements}</p>
                </div>

                {node.points && (
                  <div className="node-points">🏆 {node.points} points</div>
                )}

                <div className="node-actions">
                  {isLocked && (
                    <button
                      onClick={() => handleUnlockNode(node.id)}
                      className="btn btn-primary"
                    >
                      🔓 Unlock
                    </button>
                  )}

                  {status === 'unlocked' && (
                    <button
                      onClick={() => handleStartNode(node.id)}
                      className="btn btn-success"
                    >
                      ▶️ Start
                    </button>
                  )}

                  {status === 'in_progress' && (
                    <button
                      onClick={() => setSelectedNode(node)}
                      className="btn btn-success"
                    >
                      📤 Submit
                    </button>
                  )}

                  {isCompleted && (
                    <div className="completed-badge">
                      <FaClipboardCheck /> Completed
                    </div>
                  )}
                </div>

                {node.userProgress?.review_notes && (
                  <div className="review-notes">
                    <strong>Instructor Feedback:</strong>
                    <p>{node.userProgress.review_notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Submission Modal */}
      {selectedNode && (
        <div className="modal-overlay" onClick={() => setSelectedNode(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Submit: {selectedNode.title}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="submissionUrl">Submission URL (Optional)</label>
                <input
                  type="url"
                  id="submissionUrl"
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="submissionNotes">Notes / Description</label>
                <textarea
                  id="submissionNotes"
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  rows="6"
                  required
                  placeholder="Describe your submission, include screenshots info, etc."
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setSelectedNode(null)}
                  className="btn btn-danger"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillTreeView;

