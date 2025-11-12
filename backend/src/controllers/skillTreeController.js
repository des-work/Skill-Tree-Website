const SkillTree = require('../models/SkillTree');
const UserProgress = require('../models/UserProgress');

exports.getAllSkillTrees = (req, res) => {
  try {
    const trees = SkillTree.getAll();
    res.json(trees);
  } catch (error) {
    console.error('Get skill trees error:', error);
    res.status(500).json({ error: 'Failed to fetch skill trees' });
  }
};

exports.getSkillTreeById = (req, res) => {
  try {
    const { id } = req.params;
    const tree = SkillTree.getWithNodes(id);
    
    if (!tree) {
      return res.status(404).json({ error: 'Skill tree not found' });
    }
    
    res.json(tree);
  } catch (error) {
    console.error('Get skill tree error:', error);
    res.status(500).json({ error: 'Failed to fetch skill tree' });
  }
};

exports.getSkillTreeWithProgress = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const tree = SkillTree.getUserProgress(userId, id);
    
    if (!tree) {
      return res.status(404).json({ error: 'Skill tree not found' });
    }
    
    res.json(tree);
  } catch (error) {
    console.error('Get skill tree with progress error:', error);
    res.status(500).json({ error: 'Failed to fetch skill tree with progress' });
  }
};

exports.getUserDashboard = (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get all skill trees
    const trees = SkillTree.getAll();
    
    // Get user's overall progress
    const stats = UserProgress.getUserStats(userId);
    
    // Get user's progress for each tree
    const treesWithProgress = trees.map(tree => {
      const treeProgress = SkillTree.getUserProgress(userId, tree.id);
      return {
        ...tree,
        completedNodes: treeProgress.nodes.filter(n => 
          n.userProgress.status === 'completed' || n.userProgress.status === 'reviewed'
        ).length,
        totalNodes: treeProgress.nodes.length
      };
    });
    
    res.json({
      trees: treesWithProgress,
      stats: stats || {
        total_nodes: 0,
        completed_nodes: 0,
        in_progress_nodes: 0,
        unlocked_nodes: 0
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

