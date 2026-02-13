import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './AdminReviews.css';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPendingReviews();
  }, []);

  const loadPendingReviews = async () => {
    try {
      const response = await api.get('/progress/pending-reviews');
      // Ensure we always set an array
      setReviews(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setReviews([]); // Set empty array on error
      if (err.response?.status === 403) {
        setError('You do not have permission to view reviews. Admin or Instructor access required.');
      } else {
        setError('Failed to load reviews. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!selectedReview) return;

    setSubmitting(true);
    try {
      await api.post(`/progress/reviews/${selectedReview.id}`, {
        reviewNotes,
        status: 'reviewed',
      });
      setSelectedReview(null);
      setReviewNotes('');
      loadPendingReviews();
    } catch (err) {
      console.error('Failed to submit review:', err);
      alert('Review submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading pending reviews...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Pending Reviews</h1>
        <p>Review student submissions</p>
      </div>

      {error && (
        <div className="card" style={{ backgroundColor: '#ff4444', color: 'white', marginBottom: '20px' }}>
          <p>{error}</p>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="card">
          <p>No pending reviews at this time. Great job! 🎉</p>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card card">
              <div className="review-header">
                <div>
                  <h3>{review.tree_name} - Level {review.node_level}</h3>
                  <h4>{review.node_title}</h4>
                </div>
                <div className="review-student">
                  <strong>Student:</strong> {review.hacker_name || review.username}
                </div>
              </div>

              <div className="review-details">
                <div className="review-info">
                  <strong>Submitted:</strong>{' '}
                  {new Date(review.submitted_at).toLocaleString()}
                </div>

                {review.submission_url && (
                  <div className="review-info">
                    <strong>Submission URL:</strong>{' '}
                    <a
                      href={review.submission_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {review.submission_url}
                    </a>
                  </div>
                )}

                {review.submission_notes && (
                  <div className="review-notes-box">
                    <strong>Student Notes:</strong>
                    <p>{review.submission_notes}</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedReview(review)}
                className="btn btn-primary"
              >
                Review Submission
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedReview && (
        <div className="modal-overlay" onClick={() => setSelectedReview(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Review Submission</h2>
            <div className="modal-info">
              <p>
                <strong>Student:</strong>{' '}
                {selectedReview.hacker_name || selectedReview.username}
              </p>
              <p>
                <strong>Assignment:</strong> {selectedReview.node_title}
              </p>
            </div>

            <form onSubmit={handleReview}>
              <div className="form-group">
                <label htmlFor="reviewNotes">Review Feedback</label>
                <textarea
                  id="reviewNotes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows="6"
                  required
                  placeholder="Provide feedback for the student..."
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="btn btn-danger"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Approve & Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;

