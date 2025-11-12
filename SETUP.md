# Setup Instructions

## Prerequisites
- Node.js 16+ installed
- npm or yarn installed

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 2: Initialize the Database

```bash
npm run init-db
```

This will:
- Create the SQLite database
- Create all necessary tables
- Populate skill trees from your spreadsheet
- Create a default admin user (username: `admin`, password: `admin123`)

⚠️ **IMPORTANT**: Change the default admin password after first login!

## Step 3: Start the Backend Server

```bash
npm run dev
```

The backend will run on http://localhost:5000

## Step 4: Install Frontend Dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

## Step 5: Start the Frontend

```bash
npm start
```

The frontend will run on http://localhost:3000 and automatically open in your browser.

## Default Login Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Test Student Account:**
You'll need to register a new student account through the registration page.

## Project Structure

```
Skill Tree Website/
├── backend/
│   ├── src/
│   │   ├── config/         # Database config and initialization
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── server.js       # Express server
│   ├── database/           # SQLite database files
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context (Auth)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service
│   │   └── App.js
│   └── package.json
└── README.md
```

## Features Implemented

### For Students:
- ✅ Register and login
- ✅ View all skill trees
- ✅ Track progress across different areas
- ✅ Unlock and start nodes
- ✅ Submit assignments with URLs and notes
- ✅ View instructor feedback
- ✅ Update profile and change password

### For Instructors/Admins:
- ✅ All student features
- ✅ View pending submissions
- ✅ Review and provide feedback on submissions
- ✅ Track student progress

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login
- GET `/api/auth/profile` - Get user profile
- PUT `/api/auth/profile` - Update profile
- POST `/api/auth/change-password` - Change password

### Skill Trees
- GET `/api/skill-trees` - Get all skill trees
- GET `/api/skill-trees/dashboard` - Get dashboard with user progress
- GET `/api/skill-trees/:id` - Get specific skill tree
- GET `/api/skill-trees/:id/progress` - Get skill tree with user progress

### Progress
- GET `/api/progress/my-progress` - Get user's progress
- GET `/api/progress/my-stats` - Get user's stats
- POST `/api/progress/nodes/:nodeId/unlock` - Unlock a node
- POST `/api/progress/nodes/:nodeId/start` - Start working on a node
- POST `/api/progress/nodes/:nodeId/submit` - Submit a node
- GET `/api/progress/pending-reviews` - Get pending reviews (instructor only)
- POST `/api/progress/reviews/:progressId` - Review a submission (instructor only)

## Environment Variables

### Backend (.env)
```
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
DATABASE_PATH=./database/skilltree.db
UPLOAD_PATH=./uploads
```

## Troubleshooting

### Database Issues
If you need to reset the database:
```bash
cd backend
rm database/skilltree.db
npm run init-db
```

### Port Already in Use
If port 5000 or 3000 is already in use, you can change them:
- Backend: Edit `PORT` in `backend/.env`
- Frontend: The proxy will automatically adjust

### CORS Issues
The frontend has a proxy configured to route API calls to the backend. Make sure both servers are running.

## Next Steps

1. **Change default admin password**
2. **Update JWT_SECRET in production**
3. **Customize skill trees** by modifying `backend/src/config/initDatabase.js`
4. **Deploy to production** (consider Heroku, DigitalOcean, or similar)

## Support

For issues or questions, refer to the README.md or check the code comments.

