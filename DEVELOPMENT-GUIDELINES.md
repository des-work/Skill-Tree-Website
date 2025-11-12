# Development Guidelines & Best Practices

## Overview

This document provides guidelines for developing new features, maintaining code quality, and following project conventions.

---

## Part 1: Backend Development Guidelines

### 1.1 File Organization

**Location for new features:**

```
backend/src/
├── models/        ← Database operations
├── controllers/   ← Business logic
├── routes/        ← API endpoints
├── middleware/    ← Request handlers
└── config/        ← Configuration
```

### 1.2 Creating a New Model

**File: `backend/src/models/Certificate.js`**

```javascript
const db = require('../config/database');

/**
 * Certificate model
 * Handles all certificate-related database operations
 */
class Certificate {
  /**
   * Create a new certificate
   * @param {number} userId - The user ID
   * @param {string} title - Certificate title
   * @param {string} issuer - Issuing organization
   * @param {string} issueDate - When it was issued
   * @returns {number} Certificate ID
   */
  static create(userId, title, issuer, issueDate) {
    const stmt = db.prepare(
      'INSERT INTO certificates (user_id, title, issuer, issue_date) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(userId, title, issuer, issueDate);
    return result.lastInsertRowid;
  }

  /**
   * Get all certificates for a user
   * @param {number} userId - The user ID
   * @returns {Array} Array of certificates
   */
  static getByUser(userId) {
    const stmt = db.prepare(
      'SELECT * FROM certificates WHERE user_id = ? ORDER BY issue_date DESC'
    );
    return stmt.all(userId);
  }

  /**
   * Get a specific certificate
   * @param {number} id - The certificate ID
   * @returns {Object} Certificate object
   */
  static getById(id) {
    const stmt = db.prepare('SELECT * FROM certificates WHERE id = ?');
    return stmt.get(id);
  }

  /**
   * Delete a certificate
   * @param {number} id - The certificate ID
   * @returns {boolean} Success indicator
   */
  static delete(id) {
    const stmt = db.prepare('DELETE FROM certificates WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

module.exports = Certificate;
```

**Key points:**
- ✅ Pure database operations
- ✅ Static methods (no instantiation)
- ✅ JSDoc comments for all methods
- ✅ Consistent parameter naming
- ✅ Always return meaningful data

### 1.3 Creating a New Controller

**File: `backend/src/controllers/certificateController.js`**

```javascript
const Certificate = require('../models/Certificate');

/**
 * Get all certificates for the logged-in user
 */
exports.getUserCertificates = (req, res) => {
  try {
    const userId = req.user.userId;
    const certificates = Certificate.getByUser(userId);

    res.json({
      message: 'Certificates retrieved',
      certificates,
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
};

/**
 * Add a new certificate
 */
exports.addCertificate = (req, res) => {
  try {
    const { title, issuer, issueDate } = req.body;

    // Validation
    if (!title || !issuer) {
      return res.status(400).json({
        error: 'Title and issuer are required',
      });
    }

    const userId = req.user.userId;
    const certificateId = Certificate.create(userId, title, issuer, issueDate);

    res.status(201).json({
      message: 'Certificate added successfully',
      certificateId,
    });
  } catch (error) {
    console.error('Error adding certificate:', error);
    res.status(500).json({ error: 'Failed to add certificate' });
  }
};

/**
 * Delete a certificate
 */
exports.deleteCertificate = (req, res) => {
  try {
    const { id } = req.params;
    const success = Certificate.delete(id);

    if (!success) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
};
```

**Key points:**
- ✅ Request/response handling only
- ✅ Input validation
- ✅ Error handling with try-catch
- ✅ Proper HTTP status codes
- ✅ Clear JSON responses
- ✅ User context from `req.user`

### 1.4 Creating New Routes

**File: `backend/src/routes/certificates.js`**

```javascript
const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /api/certificates
 * Get all certificates for logged-in user
 */
router.get('/', certificateController.getUserCertificates);

/**
 * POST /api/certificates
 * Add a new certificate
 */
router.post('/', certificateController.addCertificate);

/**
 * DELETE /api/certificates/:id
 * Delete a certificate
 */
router.delete('/:id', certificateController.deleteCertificate);

module.exports = router;
```

**Registering in server.js:**

```javascript
// In backend/src/server.js
app.use('/api/auth', require('./routes/auth'));
app.use('/api/skill-trees', require('./routes/skillTrees'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/certificates', require('./routes/certificates')); // NEW
```

### 1.5 Code Style - Backend

```javascript
// ✅ DO: Clear names, single responsibility
static findByUsername(username) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  return stmt.get(username);
}

// ❌ DON'T: Vague names, multiple operations
static findByUsernameAndUpdateLastLogin(username) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  const user = stmt.get(username);
  db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);
  return user;
}

// ✅ DO: Validate input
if (!email || !email.includes('@')) {
  return res.status(400).json({ error: 'Valid email required' });
}

// ❌ DON'T: Trust input without validation
const user = User.findByEmail(email); // Could be anything!

// ✅ DO: Use prepared statements (prevents SQL injection)
db.prepare('SELECT * FROM users WHERE username = ?').get(username);

// ❌ DON'T: String concatenation (SQL injection vulnerability!)
db.exec(`SELECT * FROM users WHERE username = '${username}'`);
```

---

## Part 2: Frontend Development Guidelines

### 2.1 File Organization

**Location for new features:**

```
frontend/src/
├── pages/         ← Page components
├── components/    ← Reusable UI components
├── context/       ← State management
├── services/      ← API calls
└── (component).css ← Component styles
```

### 2.2 Creating a New Page

**File: `frontend/src/pages/Certificates.js`**

```javascript
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Certificates.css';

/**
 * Certificates page
 * Displays user's certificates and allows adding new ones
 */
const Certificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const response = await api.get('/certificates');
      setCertificates(response.data.certificates || []);
    } catch (err) {
      setError('Failed to load certificates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCertificate = async (e) => {
    e.preventDefault();
    // Handle form submission
    loadCertificates();
    setShowForm(false);
  };

  if (loading) return <div className="loading">Loading certificates...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Certificates 🏆</h1>
        <p>Track your certifications and achievements</p>
      </div>

      {error && <div className="card error">{error}</div>}

      <button 
        onClick={() => setShowForm(!showForm)}
        className="btn btn-primary"
      >
        + Add Certificate
      </button>

      {showForm && (
        <div className="card">
          <form onSubmit={handleAddCertificate}>
            {/* Form fields */}
          </form>
        </div>
      )}

      {certificates.length === 0 ? (
        <div className="card">
          <p>No certificates yet. Start earning! 🚀</p>
        </div>
      ) : (
        <div className="certificates-grid">
          {certificates.map((cert) => (
            <div key={cert.id} className="certificate-card card">
              <h3>{cert.title}</h3>
              <p>{cert.issuer}</p>
              <p className="date">{new Date(cert.issue_date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;
```

**Key points:**
- ✅ Clear component structure
- ✅ State management with useState
- ✅ useEffect for data loading
- ✅ Error handling
- ✅ Loading states
- ✅ User feedback

### 2.3 Creating a Reusable Component

**File: `frontend/src/components/CertificateCard.js`**

```javascript
import React from 'react';
import './CertificateCard.css';

/**
 * CertificateCard component
 * Displays a single certificate
 * 
 * @param {Object} props - Component props
 * @param {Object} props.certificate - Certificate data
 * @param {Function} props.onDelete - Delete callback
 */
const CertificateCard = ({ certificate, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm('Delete this certificate?')) {
      onDelete(certificate.id);
    }
  };

  return (
    <div className="certificate-card card">
      <div className="card-header">
        <h3>{certificate.title}</h3>
        <button onClick={handleDelete} className="btn-delete">×</button>
      </div>
      <p className="issuer">{certificate.issuer}</p>
      <p className="date">
        {new Date(certificate.issue_date).toLocaleDateString()}
      </p>
    </div>
  );
};

export default CertificateCard;
```

**File: `frontend/src/components/CertificateCard.css`**

```css
.certificate-card {
  padding: 20px;
  border-radius: 10px;
  position: relative;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 15px;
}

.certificate-card h3 {
  color: var(--text-primary);
  margin: 0;
}

.issuer {
  color: var(--secondary-color);
  font-weight: 500;
  margin: 5px 0;
}

.date {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0;
}

.btn-delete {
  background: none;
  border: none;
  color: var(--danger-color);
  font-size: 24px;
  cursor: pointer;
  padding: 0;
}

.btn-delete:hover {
  opacity: 0.8;
}
```

### 2.4 Code Style - Frontend

```javascript
// ✅ DO: Clear component names and props
const UserDashboard = ({ userId, onLogout }) => {
  return <div>User: {userId}</div>;
};

// ❌ DON'T: Vague names
const Comp = ({ u, l }) => {
  return <div>User: {u}</div>;
};

// ✅ DO: Separate concerns
const page = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  return <div>{/* JSX */}</div>;
};

// ❌ DON'T: Mix API calls in JSX
const page = () => (
  <div>
    {/* API calls in return statement - bad practice */}
  </div>
);

// ✅ DO: Provide user feedback
{loading && <div className="loading">Loading...</div>}
{error && <div className="error">{error}</div>}

// ❌ DON'T: Silent failures
const Page = () => {
  const [data, setData] = useState(null);
  // No loading or error handling
};
```

---

## Part 3: Adding New Database Tables

### 3.1 When You Need a New Table

**Don't:**
```javascript
// ❌ Modify existing tables loosely
// This becomes a mess!
const nodes = db.prepare(`
  SELECT sn.*, c.title as cert_title, c.issuer
  FROM skill_nodes sn
  LEFT JOIN certificates c ON ...
`);
```

**Do:**
```javascript
// ✅ Create proper table
// backend/src/config/initDatabase.js
db.exec(`
  CREATE TABLE IF NOT EXISTS certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

// Then create model: backend/src/models/Certificate.js
// Then create routes: backend/src/routes/certificates.js
```

### 3.2 Database Change Process

1. **Add table to initDatabase.js:**
   ```javascript
   db.exec(`CREATE TABLE IF NOT EXISTS ...`);
   ```

2. **Create model in models/:**
   ```javascript
   class NewModel {
     static create(...) { ... }
     static findById(...) { ... }
   }
   ```

3. **Create controller in controllers/:**
   ```javascript
   exports.getAll = (req, res) => { ... }
   ```

4. **Create routes in routes/:**
   ```javascript
   router.get('/', authMiddleware, controller.getAll);
   ```

5. **Register in server.js:**
   ```javascript
   app.use('/api/resource', require('./routes/resource'));
   ```

6. **Reset database locally:**
   ```bash
   npm run reset-db
   ```

---

## Part 4: Testing Guidelines

### 4.1 Backend Model Tests

**File: `backend/__tests__/models.test.js`**

```javascript
const db = require('../src/config/database');
const Certificate = require('../src/models/Certificate');

describe('Certificate Model', () => {
  beforeEach(() => {
    // Reset before each test
    db.exec('DELETE FROM certificates');
  });

  test('should create a certificate', () => {
    const id = Certificate.create(1, 'AWS Certified', 'Amazon', '2024-01-15');
    expect(id).toBeGreaterThan(0);
  });

  test('should retrieve certificate by id', () => {
    const id = Certificate.create(1, 'AWS Certified', 'Amazon', '2024-01-15');
    const cert = Certificate.getById(id);
    expect(cert.title).toBe('AWS Certified');
  });

  test('should get all certificates for user', () => {
    Certificate.create(1, 'AWS', 'Amazon', '2024-01-15');
    Certificate.create(1, 'Azure', 'Microsoft', '2024-02-15');
    
    const certs = Certificate.getByUser(1);
    expect(certs.length).toBe(2);
  });

  test('should delete certificate', () => {
    const id = Certificate.create(1, 'AWS', 'Amazon', '2024-01-15');
    const success = Certificate.delete(id);
    expect(success).toBe(true);
  });
});
```

### 4.2 Frontend Component Tests

**File: `frontend/src/__tests__/Certificates.test.js`**

```javascript
import { render, screen } from '@testing-library/react';
import Certificates from '../pages/Certificates';
import { AuthProvider } from '../context/AuthContext';

describe('Certificates Page', () => {
  test('renders page header', () => {
    render(
      <AuthProvider>
        <Certificates />
      </AuthProvider>
    );
    expect(screen.getByText(/My Certificates/i)).toBeInTheDocument();
  });

  test('displays add button', () => {
    render(
      <AuthProvider>
        <Certificates />
      </AuthProvider>
    );
    expect(screen.getByText(/Add Certificate/i)).toBeInTheDocument();
  });
});
```

### 4.3 Running Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

---

## Part 5: Code Review Checklist

Before committing code, check:

### Backend
- [ ] Follows naming conventions
- [ ] Has JSDoc comments
- [ ] Uses prepared statements
- [ ] Has error handling
- [ ] Tests pass (if written)
- [ ] No console.logs left behind
- [ ] Uses proper HTTP status codes

### Frontend
- [ ] Component has clear purpose
- [ ] Props are documented
- [ ] Has loading state
- [ ] Has error handling
- [ ] Responsive design
- [ ] Uses existing patterns
- [ ] No console.logs left behind

### Both
- [ ] Works locally
- [ ] Follows project style
- [ ] Meaningful commit message
- [ ] No breaking changes

---

## Part 6: Common Patterns

### Pattern 1: Add New Features

**Step 1: Database**
```javascript
// Update initDatabase.js
db.exec(`CREATE TABLE IF NOT EXISTS new_table (...)`);
```

**Step 2: Model**
```javascript
// Create models/NewModel.js
class NewModel {
  static create(data) { ... }
  static getAll() { ... }
}
```

**Step 3: Controller**
```javascript
// Create controllers/newController.js
exports.getAll = (req, res) => { ... }
```

**Step 4: Routes**
```javascript
// Create routes/new.js
router.get('/', controller.getAll);
```

**Step 5: Connect**
```javascript
// In server.js
app.use('/api/new', require('./routes/new'));
```

**Step 6: Test**
```bash
npm run reset-db
npm run dev
# Test in browser or cURL
```

### Pattern 2: Add New Page

```javascript
// 1. Create page/Page.js with component
// 2. Add to App.js routes
// 3. Add navbar link if needed
// 4. Test flow locally
```

### Pattern 3: Add Role-Based Feature

```javascript
// In routes
router.post(
  '/admin-action',
  authMiddleware,
  requireRole('admin'),  // Add this middleware
  controller.action
);

// Now only admins can access
```

---

## Part 7: Performance Tips

### Backend
```javascript
// ✅ DO: Use indexes for frequently queried columns
CREATE INDEX idx_user_username ON users(username);

// ✅ DO: Batch operations when possible
users.forEach(u => { /* efficient */ });

// ❌ DON'T: Make N queries in a loop
for (user in users) {
  db.query(...); // Bad!
}
```

### Frontend
```javascript
// ✅ DO: Lazy load pages
const CertPage = React.lazy(() => import('./pages/Certificates'));

// ✅ DO: Memoize expensive components
const MyCertCard = React.memo(CertificateCard);

// ✅ DO: Use useCallback for event handlers
const handleClick = useCallback(() => { ... }, []);

// ❌ DON'T: Recreate functions on every render
const handleClick = () => { ... }; // In component body
```

---

## Part 8: Deployment Checklist

Before deploying to production:

- [ ] All tests pass
- [ ] No console.logs remaining
- [ ] Error handling in place
- [ ] Secrets in environment variables
- [ ] Database backed up
- [ ] Performance tested
- [ ] Security reviewed
- [ ] Changelog updated

---

## Part 9: Git Workflow

### Commit Messages

```bash
# ✅ Good commit messages
git commit -m "feat: add certificate tracking feature"
git commit -m "fix: correct user progress calculation"
git commit -m "docs: update API documentation"

# ❌ Bad commit messages
git commit -m "fix stuff"
git commit -m "updates"
git commit -m "aslkdfj"
```

### Branch Names

```bash
# ✅ Good branch names
feature/certificate-tracking
fix/progress-calculation
docs/api-endpoints

# ❌ Bad branch names
feature1
fix-bugs
my-changes
```

---

## Part 10: Documentation

### Code Documentation Standards

**Every model should have:**
- Class-level JSDoc
- Method-level JSDoc with @param and @returns
- Parameter types documented
- Return types documented

**Every controller should have:**
- Function-level comments explaining purpose
- Input validation documented
- Error cases explained

**Every page/component should have:**
- Description of purpose
- Props documented if reusable
- Key functionality explained

---

## Quick Reference

| Task | Location | Template |
|------|----------|----------|
| New database table | `initDatabase.js` | `db.exec(CREATE TABLE...)` |
| New model | `models/New.js` | Class with static methods |
| New controller | `controllers/newController.js` | exports.action = (req, res) => {} |
| New routes | `routes/new.js` | router.get/post/put/delete |
| New page | `pages/New.js` | Functional React component |
| New component | `components/New.js` | Reusable component |
| New context | `context/NewContext.js` | React Context setup |

---

## Next Steps

1. Review this guide before starting development
2. Use provided templates when adding features
3. Test locally before committing
4. Follow code style conventions
5. Document new features
6. Commit with meaningful messages

**Happy coding! 🚀**

