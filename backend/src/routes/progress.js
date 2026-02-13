const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { authMiddleware, requireRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const proofsDir = path.join(__dirname, '../../uploads/submissions');
if (!fs.existsSync(proofsDir)) {
  fs.mkdirSync(proofsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, proofsDir),
  filename: (_req, file, cb) => {
    const safeExt = path.extname(file.originalname || '').toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

const allowedMimeTypes = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip',
  'application/x-zip-compressed',
]);

const uploadProof = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new Error('Unsupported file type'));
    }
    cb(null, true);
  },
});

// All routes require authentication
router.use(authMiddleware);

// Student routes
router.get('/my-progress', progressController.getUserProgress);
router.get('/my-stats', progressController.getUserStats);
router.post('/nodes/:nodeId/unlock', progressController.unlockNode);
router.post('/nodes/:nodeId/start', progressController.startNode);
router.post('/nodes/:nodeId/submit', progressController.submitNode);
router.post('/upload-proof', uploadProof.single('proofFile'), progressController.uploadProofFile);

// Admin-only routes (submission approval is admin-only)
router.get('/pending-reviews', requireRole('admin'), progressController.getPendingReviews);
router.post('/reviews/:progressId', requireRole('admin'), progressController.reviewSubmission);
router.get('/users/:userId/stats', requireRole('admin'), progressController.getUserStats);

module.exports = router;

