const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// All admin routes require authentication + admin role
router.use(authMiddleware);
router.use(requireRole('admin'));

// ── User Management ──
router.get('/users', adminController.getAllUsers);
router.put('/users/:userId/role', adminController.updateUserRole);

// ── Admin Promotion (two-admin approval) ──
router.post('/users/:userId/promote', adminController.requestAdminPromotion);
router.get('/promotions', adminController.getPendingPromotions);
router.post('/promotions/:promotionId/resolve', adminController.resolvePromotion);

// ── Gradebook / Spreadsheet ──
router.get('/gradebook', adminController.getGradebook);
router.get('/student-summary', adminController.getStudentSummary);

module.exports = router;
