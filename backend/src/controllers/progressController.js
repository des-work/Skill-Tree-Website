const UserProgress = require('../models/UserProgress');

exports.getUserProgress = (req, res) => {
  try {
    const userId = req.user.userId;
    const progress = UserProgress.getByUser(userId);
    res.json(progress);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
};

exports.unlockNode = (req, res) => {
  try {
    const { nodeId } = req.params;
    const userId = req.user.userId;
    
    const progress = UserProgress.unlockNode(userId, nodeId);
    res.json({
      message: 'Node unlocked successfully',
      progress
    });
  } catch (error) {
    console.error('Unlock node error:', error);
    res.status(500).json({ error: 'Failed to unlock node' });
  }
};

exports.startNode = (req, res) => {
  try {
    const { nodeId } = req.params;
    const userId = req.user.userId;
    
    const progress = UserProgress.startNode(userId, nodeId);
    res.json({
      message: 'Node started successfully',
      progress
    });
  } catch (error) {
    console.error('Start node error:', error);
    res.status(500).json({ error: 'Failed to start node' });
  }
};

exports.submitNode = (req, res) => {
  try {
    const { nodeId } = req.params;
    const userId = req.user.userId;
    const { submissionUrl, submissionNotes } = req.body;
    
    if (!submissionUrl && !submissionNotes) {
      return res.status(400).json({ 
        error: 'Either submission URL or notes are required' 
      });
    }
    
    const progress = UserProgress.submitNode(
      userId, 
      nodeId, 
      submissionUrl, 
      submissionNotes
    );
    
    res.json({
      message: 'Submission successful',
      progress
    });
  } catch (error) {
    console.error('Submit node error:', error);
    res.status(500).json({ error: 'Failed to submit node' });
  }
};

exports.getPendingReviews = (req, res) => {
  try {
    const reviews = UserProgress.getPendingReviews();
    res.json(reviews);
  } catch (error) {
    console.error('Get pending reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch pending reviews' });
  }
};

exports.reviewSubmission = (req, res) => {
  try {
    const { progressId } = req.params;
    const reviewerId = req.user.userId;
    const { reviewNotes, status } = req.body;
    
    if (!reviewNotes) {
      return res.status(400).json({ error: 'Review notes are required' });
    }
    
    const validStatuses = ['reviewed', 'completed', 'in_progress'];
    const newStatus = validStatuses.includes(status) ? status : 'reviewed';
    
    UserProgress.reviewSubmission(progressId, reviewerId, reviewNotes, newStatus);
    
    res.json({
      message: 'Review submitted successfully'
    });
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({ error: 'Failed to review submission' });
  }
};

exports.getUserStats = (req, res) => {
  try {
    const userId = req.params.userId || req.user.userId;
    const stats = UserProgress.getUserStats(userId);
    res.json(stats || {
      total_nodes: 0,
      completed_nodes: 0,
      in_progress_nodes: 0,
      unlocked_nodes: 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

