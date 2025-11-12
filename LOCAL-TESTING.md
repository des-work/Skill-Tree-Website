# Local Testing Guide

## Overview

Easy-to-use local testing tools and scripts for development and debugging.

---

## Part 1: Backend API Testing

### 1.1 Manual API Testing with cURL

#### Health Check
```bash
curl http://localhost:5000/api/health
```

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "hackerName": "TestHacker"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

**Response contains token:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

#### Get Profile (with token)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Get All Skill Trees
```bash
curl -X GET http://localhost:5000/api/skill-trees \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Get Skill Tree with Progress
```bash
curl -X GET http://localhost:5000/api/skill-trees/1/progress \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Start a Node
```bash
curl -X POST http://localhost:5000/api/progress/nodes/1/start \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Submit a Node
```bash
curl -X POST http://localhost:5000/api/progress/nodes/1/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "submissionUrl": "https://drive.google.com/...",
    "submissionNotes": "I found 3 flags on the system"
  }'
```

---

### 1.2 Insomnia/Postman Collection

Create file: `api-testing-collection.json`

```json
{
  "info": {
    "name": "Skill Tree API",
    "version": "1.0.0"
  },
  "baseUrl": "http://localhost:5000/api",
  "requests": [
    {
      "name": "Health Check",
      "method": "GET",
      "url": "http://localhost:5000/api/health"
    },
    {
      "name": "Register",
      "method": "POST",
      "url": "http://localhost:5000/api/auth/register",
      "body": {
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123",
        "hackerName": "TestHacker"
      }
    },
    {
      "name": "Login",
      "method": "POST",
      "url": "http://localhost:5000/api/auth/login",
      "body": {
        "username": "admin",
        "password": "admin123"
      }
    }
  ]
}
```

**Import into Postman/Insomnia:**
- Postman: File → Import → Select JSON file
- Insomnia: Create → Import from URL/File

---

### 1.3 Node.js Test Script

Create file: `backend/test-api.js`

```javascript
/**
 * Manual API testing script
 * Run: node test-api.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000/api';
let authToken = null;

// Utility function for HTTP requests
function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (authToken) {
      options.headers['Authorization'] = `Bearer ${authToken}`;
    }

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Skill Tree API\n');

  try {
    // Test 1: Health Check
    console.log('✓ Test 1: Health Check');
    const health = await request('GET', '/health');
    console.log('  Status:', health.status);

    // Test 2: Register
    console.log('\n✓ Test 2: Register User');
    const registered = await request('POST', '/auth/register', {
      username: `testuser${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      hackerName: 'TestHacker',
    });
    console.log('  User created:', registered.user?.username);
    authToken = registered.token;

    // Test 3: Get Profile
    console.log('\n✓ Test 3: Get Profile');
    const profile = await request('GET', '/auth/profile');
    console.log('  Username:', profile.username);
    console.log('  Email:', profile.email);

    // Test 4: Get Skill Trees
    console.log('\n✓ Test 4: Get Skill Trees');
    const trees = await request('GET', '/skill-trees');
    console.log('  Found', Array.isArray(trees) ? trees.length : 0, 'skill trees');

    // Test 5: Get Dashboard
    console.log('\n✓ Test 5: Get Dashboard');
    const dashboard = await request('GET', '/skill-trees/dashboard');
    console.log('  Trees:', dashboard.trees?.length);
    console.log('  Stats:', dashboard.stats);

    // Test 6: Start Node
    console.log('\n✓ Test 6: Start Node');
    const started = await request('POST', '/progress/nodes/1/start');
    console.log('  Status:', started.progress?.status);

    // Test 7: Submit Node
    console.log('\n✓ Test 7: Submit Node');
    const submitted = await request('POST', '/progress/nodes/1/submit', {
      submissionUrl: 'https://example.com/submission',
      submissionNotes: 'Test submission',
    });
    console.log('  Status:', submitted.progress?.status);

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();
```

**Run:**
```bash
cd backend
node test-api.js
```

---

### 1.4 Database Testing

#### Check Database Contents

Create file: `backend/inspect-db.js`

```javascript
/**
 * Inspect database contents
 * Run: node inspect-db.js
 */

const db = require('./src/config/database');

console.log('📊 Database Inspection\n');

// Count records
console.log('📈 Record Counts:');
console.log('  Users:', db.prepare('SELECT COUNT(*) as count FROM users').get().count);
console.log('  Skill Trees:', db.prepare('SELECT COUNT(*) as count FROM skill_trees').get().count);
console.log('  Skill Nodes:', db.prepare('SELECT COUNT(*) as count FROM skill_nodes').get().count);
console.log('  User Progress:', db.prepare('SELECT COUNT(*) as count FROM user_progress').get().count);

// List all users
console.log('\n👥 Users:');
const users = db.prepare('SELECT id, username, email, role FROM users').all();
users.forEach(u => console.log(`  ${u.id}: ${u.username} (${u.role})`));

// List skill trees
console.log('\n🌳 Skill Trees:');
const trees = db.prepare('SELECT id, name, category FROM skill_trees ORDER BY display_order').all();
trees.forEach(t => console.log(`  ${t.id}: ${t.name} (${t.category})`));

// List nodes for first tree
console.log('\n📝 Nodes (First Tree):');
const nodes = db.prepare(`
  SELECT sn.id, sn.level, sn.title 
  FROM skill_nodes sn 
  WHERE sn.skill_tree_id = 1 
  ORDER BY sn.level
`).all();
nodes.forEach(n => console.log(`  Level ${n.level}: ${n.title}`));

// List user progress
if (users.length > 1) {
  console.log('\n📊 User Progress (Non-admin):');
  const progress = db.prepare(`
    SELECT up.id, u.username, sn.title, up.status 
    FROM user_progress up
    JOIN users u ON up.user_id = u.id
    JOIN skill_nodes sn ON up.skill_node_id = sn.id
    WHERE u.role = 'student'
    LIMIT 10
  `).all();
  progress.forEach(p => console.log(`  ${p.username} → ${p.title}: ${p.status}`));
}

console.log('\n✅ Inspection complete!');
db.close();
```

**Run:**
```bash
cd backend
node inspect-db.js
```

---

### 1.5 Reset Database for Testing

Create file: `backend/reset-db.sh` (Mac/Linux)

```bash
#!/bin/bash
echo "🔄 Resetting database..."
rm -f database/skilltree.db
npm run init-db
echo "✅ Database reset complete!"
```

Or `backend/reset-db.bat` (Windows)

```batch
@echo off
echo 🔄 Resetting database...
if exist database\skilltree.db del database\skilltree.db
call npm run init-db
echo ✅ Database reset complete!
```

**Run:**
```bash
# Mac/Linux
chmod +x backend/reset-db.sh
./backend/reset-db.sh

# Windows
cd backend
reset-db.bat
```

---

## Part 2: Frontend Testing

### 2.1 Browser Developer Tools

**Open DevTools:** F12 or Ctrl+Shift+I

**Console Tests:**
```javascript
// Check if logged in
localStorage.getItem('token')

// Check auth context
const user = JSON.parse(localStorage.getItem('user'))

// Test API call
fetch('/api/skill-trees', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
}).then(r => r.json()).then(d => console.log(d))
```

### 2.2 Test Different User Flows

**Flow 1: New User Registration**
1. Open http://localhost:3000
2. Click "Register"
3. Fill all fields (pick unique username)
4. Submit
5. Should see dashboard with 0% progress

**Flow 2: Existing User Login**
1. Click "Login"
2. Username: `admin`, Password: `admin123`
3. Should see dashboard with admin label

**Flow 3: Student Submission Flow**
1. Login as student
2. Click on "Capture the Flag"
3. Click "Unlock" on Level 1
4. Click "Start"
5. Click "Submit"
6. Enter URL and notes
7. Submit
8. Should show "Completed" status

**Flow 4: Instructor Review Flow**
1. Login as admin/instructor
2. Click "Reviews" in navbar
3. Should see student submission
4. Click "Review Submission"
5. Enter feedback
6. Click "Approve"
7. Logout, login as student
8. Check skill tree - should see feedback

### 2.3 Responsive Testing

**Chrome DevTools:**
1. Open DevTools (F12)
2. Click device toggle (Ctrl+Shift+M)
3. Test breakpoints:
   - iPhone 12 (390px)
   - iPad (768px)
   - Desktop (1440px)

**Test on actual devices:**
- Find your PC's IP: `ipconfig` (Windows) or `ifconfig` (Mac)
- On phone: Visit http://YOUR_IP:3000
- Test touch interactions

### 2.4 Frontend Performance Testing

**In Chrome DevTools → Lighthouse:**
1. Open DevTools (F12)
2. Click "Lighthouse" tab
3. Click "Analyze page load"
4. Look for issues

**Common improvements:**
- Lazy load pages
- Minify assets
- Cache API responses

---

## Part 3: Integration Testing

### 3.1 Full User Journey Test

**Test scenario: Complete a CTF challenge**

1. **Setup:**
   - Open http://localhost:3000
   - Login as admin
   - Reset database: `npm run init-db`

2. **Create test student:**
   - Logout
   - Click Register
   - Username: `ctf_tester`
   - Email: `ctf@test.com`
   - Password: `password123`
   - Hacker Name: `CTF Master`

3. **Complete challenge:**
   - Click "Capture the Flag"
   - Unlock Level 1
   - Start Level 1
   - Submit with:
     - URL: `https://example.com/proof`
     - Notes: `Found 3 flags on Metasploitable`

4. **Verify in database:**
   ```bash
   node backend/inspect-db.js
   # Should see user progress with 'completed' status
   ```

5. **Instructor review:**
   - Login as admin
   - Click Reviews
   - Click on submission
   - Add feedback: `Great work! All flags found correctly.`
   - Approve

6. **Student sees feedback:**
   - Logout, login as `ctf_tester`
   - Go to Capture the Flag
   - See instructor feedback displayed

---

### 3.2 Test Matrix

| Scenario | Frontend | Backend | Database | Expected Result |
|----------|----------|---------|----------|-----------------|
| Register | ✓ | ✓ | ✓ | New user created |
| Login | ✓ | ✓ | ✓ | JWT token issued |
| View trees | ✓ | ✓ | ✓ | 8 trees displayed |
| Unlock node | ✓ | ✓ | ✓ | Status changes |
| Submit | ✓ | ✓ | ✓ | Data saved |
| Review | ✓ | ✓ | ✓ | Feedback visible |

---

## Part 4: Automated Test Setup

### 4.1 Backend Unit Tests (Jest)

**Install:**
```bash
cd backend
npm install --save-dev jest supertest
npm install bcryptjs  # Already have, but make sure
```

**Create file: `backend/__tests__/models.test.js`**

```javascript
const User = require('../src/models/User');

describe('User Model', () => {
  test('should create a user', () => {
    const userId = User.create('testuser', 'test@example.com', 'password123');
    expect(userId).toBeGreaterThan(0);
  });

  test('should find user by username', () => {
    User.create('findtest', 'find@example.com', 'password123');
    const user = User.findByUsername('findtest');
    expect(user).toBeDefined();
    expect(user.username).toBe('findtest');
  });

  test('should verify password correctly', () => {
    const password = 'testpass123';
    User.create('passtest', 'pass@example.com', password);
    const user = User.findByUsername('passtest');
    
    const isValid = User.verifyPassword(password, user.password_hash);
    expect(isValid).toBe(true);
    
    const isInvalid = User.verifyPassword('wrongpassword', user.password_hash);
    expect(isInvalid).toBe(false);
  });
});
```

**Run tests:**
```bash
npm test
```

### 4.2 Frontend Tests (React Testing Library)

**Install:**
```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

**Create file: `frontend/src/__tests__/components.test.js`**

```javascript
import { render, screen } from '@testing-library/react';
import Login from '../pages/Login';

describe('Login Component', () => {
  test('renders login form', () => {
    render(<Login />);
    expect(screen.getByRole('textbox', { name: /username/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('displays error on invalid login', async () => {
    render(<Login />);
    // Test implementation
  });
});
```

---

## Part 5: Debugging Tools

### 5.1 Backend Logging

**Add debug logging:**

```javascript
// In backend/src/server.js
const morgan = require('morgan');
app.use(morgan('dev')); // HTTP request logging
```

**View logs:**
```bash
npm run dev
# See all requests in terminal
```

### 5.2 Frontend Logging

**In browser console:**
```javascript
// Check Redux DevTools (if using)
// Check Network tab for API calls
// Check Application tab for localStorage
// Check Console for errors
```

### 5.3 Database Queries

**Log all queries:**
```javascript
// In backend/src/config/database.js
db.on('trace', (sql) => {
  console.log('SQL:', sql);
});
```

---

## Part 6: Performance Testing

### 6.1 Backend Performance

**Simple load test:**

```bash
# Install Apache Bench (Mac)
brew install httpd

# Or use npm: npm install -g autocannon
npm install -g autocannon

# Run load test
autocannon http://localhost:5000/api/health -c 100 -d 10
```

### 6.2 Frontend Performance

**Chrome Lighthouse:**
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Run analysis
4. Check scores

---

## Part 7: Testing Checklist

Before merging/deploying:

- [ ] Backend: Health check passes
- [ ] Backend: All CRUD operations work
- [ ] Backend: Authentication works
- [ ] Backend: Authorization works (admin vs student)
- [ ] Frontend: All pages load
- [ ] Frontend: Navigation works
- [ ] Frontend: Forms submit successfully
- [ ] Frontend: Responsive on mobile
- [ ] Full flow: Register → Login → Submit → Review
- [ ] Database: Data persists correctly

---

## Part 8: Quick Test Commands

Add to `package.json` scripts:

**Backend:**
```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js",
  "init-db": "node src/config/initDatabase.js",
  "test-api": "node test-api.js",
  "inspect-db": "node inspect-db.js",
  "reset-db": "rm -f database/skilltree.db && npm run init-db"
}
```

**Frontend:**
```json
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```

---

## Part 9: Continuous Testing Workflow

**Daily development:**
1. Start servers: `start-all.bat`
2. Open browser DevTools
3. Test flows manually
4. Check backend logs
5. Use `inspect-db.js` to verify data
6. Test on mobile view

**Before committing:**
1. Run `npm test` (when tests added)
2. Check console for errors
3. Verify all flows work
4. Test on different browsers

**Before deploying:**
1. Run full test suite
2. Performance check
3. Security check
4. Database backup
5. Manual smoke test

---

## Quick Reference

| Task | Command |
|------|---------|
| Start all servers | `start-all.bat` or `./quick-start.sh` |
| Start backend | `cd backend && npm run dev` |
| Test API | `cd backend && node test-api.js` |
| Inspect database | `cd backend && node inspect-db.js` |
| Reset database | `cd backend && npm run reset-db` |
| View frontend | http://localhost:3000 |
| Backend logs | Terminal where `npm run dev` runs |
| Frontend console | Browser DevTools (F12) |

---

## Next: Add Automated Tests

See **DEVELOPMENT-GUIDELINES.md** for:
- How to write tests
- Test structure
- CI/CD setup

