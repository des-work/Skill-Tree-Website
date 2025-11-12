# Feature Documentation

## Complete Feature List

### 🔐 Authentication & User Management

#### Student Features:
- **Registration**: Create new student accounts with username, email, and optional hacker name
- **Login**: Secure JWT-based authentication
- **Profile Management**: Update email and hacker name
- **Password Change**: Update password with current password verification
- **Persistent Sessions**: 7-day JWT tokens for convenience

#### Admin/Instructor Features:
- All student features
- Role-based access control
- Review and grade student submissions

### 📊 Dashboard

#### Student Dashboard:
- **Overview Statistics**:
  - Total completed nodes
  - Nodes in progress
  - Unlocked nodes
  - Total available nodes
  
- **Skill Tree Cards**:
  - Visual representation of all skill areas
  - Progress bars showing completion percentage
  - Category badges (hands-on, certification, lab-work, etc.)
  - Click to enter skill tree details

### 🌳 Skill Tree System

#### 8 Skill Tree Areas (from your spreadsheet):

1. **Capture the Flag** (3 levels)
   - Metasploitable 3 CTF
   - OverTheWire - Bandit
   - Hack The Box

2. **Cloud Specialty** (3 levels)
   - AWS Cloud Practitioner
   - Azure Fundamentals
   - Google Cloud Digital Leader

3. **Lab Man** (3 levels)
   - Lab exercises with analysis questions and quizzes

4. **Coding** (2 levels)
   - Programming language courses on Codecademy

5. **Lock Picking** (3 levels)
   - Physical security challenges

6. **Health Tracking** (3 levels)
   - Track health factors throughout semester

7. **AI Deception and Social Engineering** (4 modules)
   - AI & Social Manipulation
   - Automated Phishing
   - Deepfake Fabrication
   - Human Defense Project

8. **AI Model Forensics** (4 modules)
   - Foundation of AI Incident Response
   - Compromise Detection
   - Model Theft and Watermarking
   - Post-Incident Attribution

### 🎮 Node Progression System

#### Node States:
1. **Locked** 🔒
   - Initial state
   - Can be unlocked by student
   - Grayed out appearance

2. **Unlocked** 🔓
   - Student has access
   - Can start working on it
   - Blue highlight

3. **In Progress** ▶️
   - Student is actively working
   - Can submit when ready
   - Orange/yellow highlight

4. **Completed** ✅
   - Student has submitted
   - Awaiting instructor review
   - Green highlight

5. **Reviewed** ✔️
   - Instructor has reviewed and approved
   - Shows instructor feedback
   - Dark green highlight

### 📤 Submission System

#### Student Submission Features:
- **Submission URL**: Link to external resources (Google Drive, GitHub, etc.)
- **Submission Notes**: Text area for descriptions, explanations, screenshots info
- **Submission Timestamp**: Automatic tracking of when work was submitted
- **View Feedback**: See instructor comments after review

### 👨‍🏫 Instructor Review System

#### Review Dashboard:
- List of all pending submissions
- Student information (username/hacker name)
- Submission details
- Direct links to student work

#### Review Process:
1. View student submission details
2. Access submission URLs
3. Read student notes
4. Provide feedback/comments
5. Approve submission (marks as "reviewed")

### 🎨 UI/UX Features

#### Modern Design:
- Dark theme with cyberpunk aesthetic
- Gradient backgrounds
- Smooth animations and transitions
- Responsive design for mobile/tablet/desktop

#### Visual Feedback:
- Color-coded status indicators
- Progress bars with percentages
- Icons for different actions (lock, play, check)
- Hover effects on interactive elements

#### Navigation:
- Sticky navbar with user info
- Role-based menu items
- Breadcrumb navigation
- Back buttons for easy navigation

### 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Protected Routes**: Frontend and backend route protection
- **Role-Based Access**: Instructor-only features
- **SQL Injection Protection**: Parameterized queries
- **Input Validation**: express-validator on backend
- **CORS Configuration**: Proper cross-origin setup
- **Token Expiration**: 7-day expiry for sessions

### 📱 Responsive Design

- Mobile-friendly layouts
- Touch-optimized buttons
- Flexible grid systems
- Adaptive font sizes
- Mobile navigation menu

### 🗄️ Database Design

#### Tables:
1. **users**: User accounts with roles
2. **skill_trees**: Skill tree categories
3. **skill_nodes**: Individual challenges/tasks
4. **user_progress**: Tracks student progress and submissions

#### Relationships:
- Users have many progress entries
- Skill trees have many nodes
- Nodes track user progress
- Foreign key constraints maintained

### 🔄 Real-Time Updates

- Dashboard refreshes on data changes
- Progress updates immediately after actions
- Review system updates submission list
- Profile changes reflect instantly

### 📈 Progress Tracking

#### Student View:
- Personal statistics
- Progress per skill tree
- Completion percentages
- Visual progress bars

#### Instructor View:
- Pending submissions count
- Student progress overview
- Per-student statistics available

### 🎯 Gamification Elements

- **Points System**: Each node has point values
- **Levels**: Progressive difficulty
- **Unlocking**: Gate progression
- **Achievement Feel**: Visual completion badges
- **Hacker Names**: Personalization

### 🔧 Technical Features

#### Backend:
- RESTful API design
- Error handling middleware
- Request validation
- File structure organization
- Environment configuration

#### Frontend:
- React Context for state management
- Axios for API communication
- React Router for navigation
- Component-based architecture
- CSS modules for styling

### 📋 Data Populated from Your Spreadsheet

All skill trees and nodes are automatically populated from your Google Sheets data:
- Lesson focus areas
- Level requirements
- Task descriptions
- Submission requirements
- Points values

### 🚀 Performance

- Lightweight SQLite database
- Efficient queries with indexes
- Lazy loading where appropriate
- Minimal dependencies
- Fast page loads

### 🔮 Future Enhancement Possibilities

Currently NOT implemented but easy to add:
- File upload functionality (images, PDFs)
- Email notifications for reviews
- Leaderboards
- Team/group features
- Advanced analytics
- Export progress reports
- Certificate generation
- Calendar integration
- Deadline tracking
- Discussion forums per node

## Usage Scenarios

### Scenario 1: New Student Registration
1. Student visits site
2. Clicks "Register"
3. Fills in username, email, password, hacker name
4. Automatically logged in
5. Redirected to dashboard
6. Sees all available skill trees

### Scenario 2: Working on a Challenge
1. Student clicks on skill tree (e.g., "Capture the Flag")
2. Sees all levels (1, 2, 3)
3. Unlocks Level 1
4. Clicks "Start" on Level 1
5. Completes the challenge externally
6. Returns to site
7. Clicks "Submit"
8. Enters submission URL and notes
9. Waits for instructor review

### Scenario 3: Instructor Review
1. Instructor logs in
2. Clicks "Reviews" in navbar
3. Sees list of pending submissions
4. Clicks "Review Submission"
5. Reads student notes
6. Opens submission URL
7. Provides feedback
8. Clicks "Approve & Submit"
9. Student receives feedback

## Data Flow

```
User Login → JWT Token → Stored in localStorage → 
Attached to all API requests → Verified by backend →
Routes protected by middleware → Data returned →
React updates UI
```

## API Response Format

All API responses follow consistent format:
```json
{
  "data": {...},
  "message": "Success message",
  "error": null
}
```

Error responses:
```json
{
  "error": "Error message",
  "details": [...]
}
```

