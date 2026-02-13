const db = require('../config/database');

class UserProgress {
  static getByUser(userId) {
    const stmt = db.prepare(`
      SELECT up.*, 
             sn.title as node_title,
             sn.level as node_level,
             st.name as tree_name
      FROM user_progress up
      JOIN skill_nodes sn ON up.skill_node_id = sn.id
      JOIN skill_trees st ON sn.skill_tree_id = st.id
      WHERE up.user_id = ?
      ORDER BY st.display_order, sn.level
    `);
    return stmt.all(userId);
  }

  static getByUserAndNode(userId, nodeId) {
    const stmt = db.prepare(
      'SELECT * FROM user_progress WHERE user_id = ? AND skill_node_id = ?'
    );
    return stmt.get(userId, nodeId);
  }

  static unlockNode(userId, nodeId) {
    const existing = this.getByUserAndNode(userId, nodeId);
    
    if (existing) {
      if (existing.status === 'locked') {
        const stmt = db.prepare(
          'UPDATE user_progress SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND skill_node_id = ?'
        );
        stmt.run('unlocked', userId, nodeId);
      }
      return existing;
    }
    
    const stmt = db.prepare(
      'INSERT INTO user_progress (user_id, skill_node_id, status) VALUES (?, ?, ?)'
    );
    stmt.run(userId, nodeId, 'unlocked');
    return this.getByUserAndNode(userId, nodeId);
  }

  static startNode(userId, nodeId) {
    const stmt = db.prepare(`
      INSERT INTO user_progress (user_id, skill_node_id, status) 
      VALUES (?, ?, ?)
      ON CONFLICT(user_id, skill_node_id) 
      DO UPDATE SET status = ?, updated_at = CURRENT_TIMESTAMP
    `);
    stmt.run(userId, nodeId, 'in_progress', 'in_progress');
    return this.getByUserAndNode(userId, nodeId);
  }

  static submitNode(userId, nodeId, submissionUrl, submissionNotes, submissionFileUrl, submissionFileName) {
    const normalizedUrl = submissionUrl ? submissionUrl.trim() : '';
    const normalizedFileUrl = submissionFileUrl ? submissionFileUrl.trim() : '';
    const normalizedFileName = submissionFileName ? submissionFileName.trim() : '';
    const submissionPayload = JSON.stringify({
      url: normalizedUrl,
      fileUrl: normalizedFileUrl,
      fileName: normalizedFileName,
    });

    const stmt = db.prepare(`
      INSERT INTO user_progress (user_id, skill_node_id, status, submission_url, submission_notes, submitted_at) 
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, skill_node_id) 
      DO UPDATE SET 
        status = ?,
        submission_url = ?,
        submission_notes = ?,
        submitted_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    `);
    stmt.run(
      userId, nodeId, 'completed', submissionPayload, submissionNotes,
      'completed', submissionPayload, submissionNotes
    );
    return this.getByUserAndNode(userId, nodeId);
  }

  static reviewSubmission(nodeProgressId, reviewedBy, reviewNotes, newStatus = 'reviewed') {
    const stmt = db.prepare(`
      UPDATE user_progress 
      SET status = ?,
          reviewed_by = ?,
          review_notes = ?,
          reviewed_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(newStatus, reviewedBy, reviewNotes, nodeProgressId);
  }

  static getPendingReviews() {
    const stmt = db.prepare(`
      SELECT up.*,
             u.username,
             u.hacker_name,
             sn.title as node_title,
             sn.level as node_level,
             st.name as tree_name
      FROM user_progress up
      JOIN users u ON up.user_id = u.id
      JOIN skill_nodes sn ON up.skill_node_id = sn.id
      JOIN skill_trees st ON sn.skill_tree_id = st.id
      WHERE up.status = 'completed'
      ORDER BY up.submitted_at DESC
    `);
    return stmt.all();
  }

  static getUserStats(userId) {
    const stmt = db.prepare(`
      SELECT 
        COUNT(*) as total_nodes,
        SUM(CASE WHEN status = 'completed' OR status = 'reviewed' THEN 1 ELSE 0 END) as completed_nodes,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_nodes,
        SUM(CASE WHEN status = 'unlocked' THEN 1 ELSE 0 END) as unlocked_nodes
      FROM user_progress
      WHERE user_id = ?
    `);
    return stmt.get(userId);
  }

  /** Full gradebook: every student × every node with submission/review data */
  static getGradebook() {
    const stmt = db.prepare(`
      SELECT
        u.id        AS user_id,
        u.username,
        u.hacker_name,
        u.email,
        st.name     AS tree_name,
        sn.id       AS node_id,
        sn.title    AS node_title,
        sn.level    AS node_level,
        sn.points   AS max_points,
        up.status,
        up.submission_url,
        up.submission_notes,
        up.submitted_at,
        up.review_notes,
        up.reviewed_at,
        rev.username AS reviewed_by_name
      FROM users u
      CROSS JOIN skill_nodes sn
      JOIN skill_trees st ON sn.skill_tree_id = st.id
      LEFT JOIN user_progress up ON up.user_id = u.id AND up.skill_node_id = sn.id
      LEFT JOIN users rev ON up.reviewed_by = rev.id
      WHERE u.role = 'student'
      ORDER BY u.username, st.display_order, sn.level
    `);
    return stmt.all();
  }

  /** Per-student summary stats for admin spreadsheet header row */
  static getAllStudentStats() {
    const stmt = db.prepare(`
      SELECT
        u.id        AS user_id,
        u.username,
        u.hacker_name,
        u.email,
        COUNT(up.id) AS total_started,
        SUM(CASE WHEN up.status IN ('completed','reviewed') THEN 1 ELSE 0 END) AS completed_nodes,
        SUM(CASE WHEN up.status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_nodes,
        SUM(CASE WHEN up.status IN ('completed','reviewed') THEN sn.points ELSE 0 END) AS earned_points
      FROM users u
      LEFT JOIN user_progress up ON up.user_id = u.id
      LEFT JOIN skill_nodes sn ON up.skill_node_id = sn.id
      WHERE u.role = 'student'
      GROUP BY u.id
      ORDER BY u.username
    `);
    return stmt.all();
  }
}

module.exports = UserProgress;

