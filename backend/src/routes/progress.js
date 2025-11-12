const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Student routes
router.get('/my-progress', progressController.getUserProgress);
router.get('/my-stats', progressController.getUserStats);
router.post('/nodes/:nodeId/unlock', progressController.unlockNode);
router.post('/nodes/:nodeId/start', progressController.startNode);
router.post('/nodes/:nodeId/submit', progressController.submitNode);

// Instructor/Admin routes
router.get('/pending-reviews', requireRole('instructor', 'admin'), progressController.getPendingReviews);
router.post('/reviews/:progressId', requireRole('instructor', 'admin'), progressController.reviewSubmission);
router.get('/users/:userId/stats', requireRole('instructor', 'admin'), progressController.getUserStats);

module.exports = router;

