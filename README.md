# Cybersecurity Skill Tree Website

A learning management platform for students to track their progress through various cybersecurity skill paths.

## Project Overview

This website allows students to:
- Login with secure authentication
- View different cybersecurity focus areas (skill trees)
- Progress through different levels in each area
- Submit assignments and track completion
- Visualize their learning journey

## Architecture

### Tech Stack
- **Backend**: Node.js + Express
- **Database**: SQLite (easily upgradable to PostgreSQL)
- **Frontend**: React
- **Authentication**: JWT-based
- **File Storage**: Local filesystem (for submissions)

### Skill Tree Areas
1. Capture the Flag (3 levels)
2. Cloud Specialty (3 levels)
3. Lab Man (3 levels)
4. Coding (2 levels)
5. Lock Picking (3 levels)
6. Health Tracking (3 levels)
7. AI Deception and Social Engineering (4 modules)
8. AI Model Forensics (4 modules)

### Key Features
- User authentication and authorization
- Interactive skill tree visualization
- Progress tracking per student
- Assignment submission system
- Admin dashboard for instructors

## Project Structure

```
/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── database/
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
└── README.md
```

## Quick Start

### For Windows Users:
Double-click `start-all.bat` to start both servers automatically!

Or use individual scripts:
- `start-backend.bat` - Start backend only
- `start-frontend.bat` - Start frontend only

### For Mac/Linux Users:
```bash
chmod +x quick-start.sh
./quick-start.sh
```

### Manual Setup:

#### Step 1: Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

#### Step 2: Initialize Database
```bash
cd backend
npm run init-db
```

#### Step 3: Start Servers
```bash
# Backend (terminal 1)
cd backend
npm run dev

# Frontend (terminal 2)
cd frontend
npm start
```

The website will open automatically at http://localhost:3000

### Default Login
- **Username**: `admin`
- **Password**: `admin123`
- ⚠️ Change this password immediately after first login!

## Database Schema

### Users
- id
- username
- email
- password_hash
- hacker_name
- role (student/instructor)
- created_at

### SkillTrees
- id
- name
- description
- category

### SkillNodes
- id
- skill_tree_id
- level
- title
- description
- submission_requirements

### UserProgress
- id
- user_id
- skill_node_id
- status (locked/unlocked/in_progress/completed)
- submission_url
- submitted_at
- reviewed_by
- reviewed_at

## ✅ Completed Features

### Phase 1: Foundation ✓
- ✅ Complete project structure
- ✅ Backend API (Node.js + Express)
- ✅ Database schema (SQLite)
- ✅ JWT authentication system
- ✅ User registration and login

### Phase 2: Core Features ✓
- ✅ Skill tree data from spreadsheet
- ✅ React frontend with routing
- ✅ Interactive user dashboard
- ✅ Real-time progress tracking
- ✅ 8 skill trees with 26+ nodes

### Phase 3: Advanced Features ✓
- ✅ Submission system (URLs + notes)
- ✅ Admin/instructor review interface
- ✅ Progress analytics and statistics
- ✅ Role-based access control
- ✅ Instructor feedback system

### Phase 4: Polish ✓
- ✅ Modern dark-themed UI
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Comprehensive documentation
- ✅ Setup scripts for easy deployment
- ✅ Security best practices

## 🎯 What Works Right Now

Everything is fully functional! Students can:
- Register and login
- View all 8 skill tree areas
- Unlock and start challenges
- Submit work with notes
- Track their progress
- View instructor feedback

Instructors can:
- Review all student submissions
- Provide feedback
- Monitor student progress
- Access admin dashboard

## 📚 Additional Documentation

- **SETUP.md** - Detailed setup instructions
- **FEATURES.md** - Complete feature list and usage scenarios
- **DEPLOYMENT.md** - Production deployment guide

## License
Private educational project

