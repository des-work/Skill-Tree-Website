const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static create(username, email, password, hackerName = null, role = 'student') {
    const passwordHash = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(
      'INSERT INTO users (username, email, password_hash, hacker_name, role) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(username, email, passwordHash, hackerName, role);
    return result.lastInsertRowid;
  }

  static findById(id) {
    const stmt = db.prepare('SELECT id, username, email, hacker_name, role, created_at FROM users WHERE id = ?');
    return stmt.get(id);
  }

  static findByUsername(username) {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
  }

  static findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  static getAll() {
    const stmt = db.prepare('SELECT id, username, email, hacker_name, role, created_at FROM users ORDER BY created_at DESC');
    return stmt.all();
  }

  static update(id, updates) {
    const allowedFields = ['hacker_name', 'email'];
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (fields.length === 0) return false;
    
    values.push(id);
    const stmt = db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`);
    const result = stmt.run(...values);
    return result.changes > 0;
  }

  static updatePassword(id, newPassword) {
    const passwordHash = bcrypt.hashSync(newPassword, 10);
    const stmt = db.prepare('UPDATE users SET password_hash = ? WHERE id = ?');
    const result = stmt.run(passwordHash, id);
    return result.changes > 0;
  }

  static verifyPassword(password, passwordHash) {
    return bcrypt.compareSync(password, passwordHash);
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // ── Role Management ──

  static updateRole(id, newRole) {
    const validRoles = ['student', 'instructor', 'admin'];
    if (!validRoles.includes(newRole)) return false;
    const stmt = db.prepare('UPDATE users SET role = ? WHERE id = ?');
    const result = stmt.run(newRole, id);
    return result.changes > 0;
  }

  // ── Admin Promotion Requests ──

  static ensurePromotionsTable() {
    db.exec(`
      CREATE TABLE IF NOT EXISTS admin_promotions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        target_user_id INTEGER NOT NULL,
        requested_by INTEGER NOT NULL,
        approved_by INTEGER,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        resolved_at DATETIME,
        FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
  }

  static requestPromotion(targetUserId, requestedByAdminId) {
    this.ensurePromotionsTable();
    // Prevent duplicate pending requests
    const existing = db.prepare(
      'SELECT id FROM admin_promotions WHERE target_user_id = ? AND status = ?'
    ).get(targetUserId, 'pending');
    if (existing) return { error: 'A pending promotion request already exists for this user' };

    const stmt = db.prepare(
      'INSERT INTO admin_promotions (target_user_id, requested_by) VALUES (?, ?)'
    );
    const result = stmt.run(targetUserId, requestedByAdminId);
    return { id: result.lastInsertRowid };
  }

  static getPendingPromotions() {
    this.ensurePromotionsTable();
    const stmt = db.prepare(`
      SELECT ap.*,
             tu.username AS target_username,
             tu.email AS target_email,
             tu.role AS target_current_role,
             ru.username AS requested_by_username
      FROM admin_promotions ap
      JOIN users tu ON ap.target_user_id = tu.id
      JOIN users ru ON ap.requested_by = ru.id
      WHERE ap.status = 'pending'
      ORDER BY ap.created_at DESC
    `);
    return stmt.all();
  }

  static resolvePromotion(promotionId, approvingAdminId, approve) {
    this.ensurePromotionsTable();
    const promo = db.prepare('SELECT * FROM admin_promotions WHERE id = ? AND status = ?').get(promotionId, 'pending');
    if (!promo) return { error: 'Promotion request not found or already resolved' };

    // The approving admin MUST be different from the requesting admin
    if (promo.requested_by === approvingAdminId) {
      return { error: 'You cannot approve your own promotion request. Another admin must approve it.' };
    }

    const newStatus = approve ? 'approved' : 'rejected';
    const stmt = db.prepare(`
      UPDATE admin_promotions
      SET status = ?, approved_by = ?, resolved_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(newStatus, approvingAdminId, promotionId);

    if (approve) {
      this.updateRole(promo.target_user_id, 'admin');
    }

    return { success: true, status: newStatus };
  }
}

module.exports = User;

