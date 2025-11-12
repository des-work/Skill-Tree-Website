const db = require('../config/database');

class SkillTree {
  static getAll() {
    const stmt = db.prepare(`
      SELECT st.*, 
             COUNT(sn.id) as node_count
      FROM skill_trees st
      LEFT JOIN skill_nodes sn ON st.id = sn.skill_tree_id
      GROUP BY st.id
      ORDER BY st.display_order, st.name
    `);
    return stmt.all();
  }

  static getById(id) {
    const stmt = db.prepare('SELECT * FROM skill_trees WHERE id = ?');
    return stmt.get(id);
  }

  static getWithNodes(id) {
    const tree = this.getById(id);
    if (!tree) return null;
    
    const nodesStmt = db.prepare(`
      SELECT * FROM skill_nodes 
      WHERE skill_tree_id = ? 
      ORDER BY level
    `);
    tree.nodes = nodesStmt.all(id);
    
    return tree;
  }

  static getUserProgress(userId, treeId) {
    const tree = this.getWithNodes(treeId);
    if (!tree) return null;
    
    const progressStmt = db.prepare(`
      SELECT skill_node_id, status, submission_url, submitted_at, review_notes
      FROM user_progress 
      WHERE user_id = ? AND skill_node_id IN (
        SELECT id FROM skill_nodes WHERE skill_tree_id = ?
      )
    `);
    
    const progress = progressStmt.all(userId, treeId);
    const progressMap = {};
    progress.forEach(p => {
      progressMap[p.skill_node_id] = p;
    });
    
    tree.nodes = tree.nodes.map(node => ({
      ...node,
      userProgress: progressMap[node.id] || { status: 'locked' }
    }));
    
    return tree;
  }

  static create(name, description, category, displayOrder = 0) {
    const stmt = db.prepare(
      'INSERT INTO skill_trees (name, description, category, display_order) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(name, description, category, displayOrder);
    return result.lastInsertRowid;
  }
}

module.exports = SkillTree;

