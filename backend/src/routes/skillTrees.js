const express = require('express');
const router = express.Router();
const skillTreeController = require('../controllers/skillTreeController');
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.get('/', skillTreeController.getAllSkillTrees);
router.get('/dashboard', skillTreeController.getUserDashboard);
router.get('/:id', skillTreeController.getSkillTreeById);
router.get('/:id/progress', skillTreeController.getSkillTreeWithProgress);

module.exports = router;

