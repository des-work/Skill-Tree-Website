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
}

module.exports = User;

