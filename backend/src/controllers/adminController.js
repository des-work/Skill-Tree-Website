const User = require('../models/User');
const UserProgress = require('../models/UserProgress');

// ── User Management ──

exports.getAllUsers = (req, res) => {
  try {
    const users = User.getAll();
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.updateUserRole = (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const requesterId = req.user.userId;

    if (Number(userId) === requesterId) {
      return res.status(400).json({ error: 'You cannot change your own role' });
    }

    // Direct role changes are allowed for non-admin promotions (e.g. student → instructor)
    // Promoting to admin requires the two-admin approval flow
    if (role === 'admin') {
      return res.status(400).json({
        error: 'Admin promotions require a two-admin approval. Use the promotion request workflow instead.'
      });
    }

    const validRoles = ['student', 'instructor'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Use "student" or "instructor".' });
    }

    const success = User.updateRole(Number(userId), role);
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: `User role updated to ${role}` });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
};

// ── Admin Promotion (two-admin approval) ──

exports.requestAdminPromotion = (req, res) => {
  try {
    const { userId } = req.params;
    const requesterId = req.user.userId;

    const targetUser = User.findById(Number(userId));
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (targetUser.role === 'admin') {
      return res.status(400).json({ error: 'User is already an admin' });
    }

    const result = User.requestPromotion(Number(userId), requesterId);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.json({ message: 'Admin promotion request created. Another admin must approve it.', id: result.id });
  } catch (error) {
    console.error('Request promotion error:', error);
    res.status(500).json({ error: 'Failed to create promotion request' });
  }
};

exports.getPendingPromotions = (req, res) => {
  try {
    const promotions = User.getPendingPromotions();
    res.json(promotions);
  } catch (error) {
    console.error('Get promotions error:', error);
    res.status(500).json({ error: 'Failed to fetch pending promotions' });
  }
};

exports.resolvePromotion = (req, res) => {
  try {
    const { promotionId } = req.params;
    const { approve } = req.body; // boolean
    const approverId = req.user.userId;

    const result = User.resolvePromotion(Number(promotionId), approverId, Boolean(approve));
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.json({ message: `Promotion ${result.status}` });
  } catch (error) {
    console.error('Resolve promotion error:', error);
    res.status(500).json({ error: 'Failed to resolve promotion' });
  }
};

// ── Gradebook / Spreadsheet ──

exports.getGradebook = (req, res) => {
  try {
    const gradebook = UserProgress.getGradebook();
    res.json(gradebook);
  } catch (error) {
    console.error('Get gradebook error:', error);
    res.status(500).json({ error: 'Failed to fetch gradebook' });
  }
};

exports.getStudentSummary = (req, res) => {
  try {
    const summary = UserProgress.getAllStudentStats();
    res.json(summary);
  } catch (error) {
    console.error('Get student summary error:', error);
    res.status(500).json({ error: 'Failed to fetch student summary' });
  }
};
