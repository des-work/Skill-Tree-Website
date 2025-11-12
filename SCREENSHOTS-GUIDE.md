# Visual Guide - What Your Website Looks Like

## Page-by-Page Overview

### 1. Login Page (`/login`)
**What you'll see:**
- Dark cyberpunk-themed background with gradient
- Centered login card with:
  - Username field
  - Password field
  - Login button
  - Link to registration page
- Modern, clean design

**Default credentials:**
- Username: `admin`
- Password: `admin123`

---

### 2. Registration Page (`/register`)
**What you'll see:**
- Similar styling to login page
- Form fields for:
  - Username (required)
  - Email (required)
  - Hacker Name (optional - for fun!)
  - Password (required)
  - Confirm Password (required)
- Register button
- Link back to login

**Features:**
- Password validation (minimum 6 characters)
- Email format validation
- Password matching check

---

### 3. Dashboard (`/dashboard`)
**What you'll see:**
- **Top Navigation Bar:**
  - Logo/site name on left
  - Dashboard, Reviews (instructor only), Profile links
  - User info (hacker name/username and role) on right
  - Logout button

- **Welcome Header:**
  - "Welcome back, [Your Name]! 🚀"
  - Subtitle about tracking progress

- **Statistics Cards (4 cards in a row):**
  - Completed nodes (green accent)
  - In Progress nodes (yellow accent)
  - Unlocked nodes (blue accent)
  - Total nodes available

- **Skill Trees Grid:**
  - 8 cards in a responsive grid
  - Each card shows:
    - Category badge (color-coded)
    - Skill tree name
    - Description
    - Progress bar with percentage
    - "X / Y completed"
  - Hover effect: cards lift up with shadow

**Skill Tree Categories:**
1. 🎯 Capture the Flag (red badge - hands-on)
2. ☁️ Cloud Specialty (blue badge - certification)
3. 🧪 Lab Man (green badge - lab-work)
4. 💻 Coding (orange badge - development)
5. 🔓 Lock Picking (purple badge - physical)
6. 💪 Health Tracking (teal badge - wellness)
7. 🤖 AI Deception (orange badge - ai-security)
8. 🔍 AI Model Forensics (orange badge - ai-security)

---

### 4. Skill Tree View (`/skill-tree/:id`)
**What you'll see:**
- **Back Button:** Returns to dashboard
- **Tree Header:** Name and description of skill tree
- **Skill Nodes Grid:**
  - Cards arranged in grid (usually 2-3 per row)
  - Each node shows:
    - **Top:** Level badge + status icon
    - **Title:** Name of the challenge
    - **Description:** What you need to do
    - **Requirements Box:** Submission requirements (blue highlight)
    - **Points Badge:** How many points it's worth (gold)
    - **Action Button:** Changes based on state:
      - 🔓 Unlock (if locked - gray)
      - ▶️ Start (if unlocked - blue)
      - 📤 Submit (if in progress - green)
      - ✅ Completed badge (if done - green)
    - **Feedback Box:** Instructor comments (if reviewed - green highlight)

**Node Color Coding:**
- **Locked:** Gray border, slightly transparent
- **Unlocked:** Blue border, full opacity
- **In Progress:** Orange/yellow border
- **Completed:** Green border
- **Reviewed:** Dark green border with feedback

**Example Nodes:**
- Level 1: Metasploitable 3 CTF (100 points)
- Level 2: OverTheWire - Bandit (100 points)
- Level 3: Hack The Box (150 points)

---

### 5. Submission Modal
**What you'll see (when clicking "Submit"):**
- **Overlay:** Dark background covering page
- **Modal Card:**
  - Title: "Submit: [Node Name]"
  - **Submission URL field:**
    - For Google Drive links, GitHub repos, etc.
    - Optional
  - **Notes/Description textarea:**
    - Required
    - 6 rows tall
    - For describing work, mentioning screenshots, etc.
  - **Two buttons:**
    - Cancel (red) - closes modal
    - Submit (green) - submits work

**After submission:**
- Modal closes
- Node status changes to "Completed"
- Shows "✅ Completed" badge
- Awaits instructor review

---

### 6. Profile Page (`/profile`)
**What you'll see:**
- **Two main cards:**

**Card 1: Account Information**
- Shows (non-editable):
  - Username
  - Email
  - Hacker Name
  - Role (student/instructor/admin)
  - Member since date
- "Edit Profile" button

**When editing:**
- Email field (editable)
- Hacker Name field (editable)
- Save Changes (green button)
- Cancel (red button)

**Card 2: Change Password**
- Initially shows just a button
- When clicked, shows form:
  - Current Password field
  - New Password field
  - Confirm New Password field
  - Update Password (green button)
  - Cancel (red button)

---

### 7. Admin Reviews Page (`/admin/reviews`)
**Available only to instructors and admins**

**What you'll see:**
- **Header:** "Pending Reviews"
- **Review Cards List:**
  - Each submission shows:
    - **Top Section:**
      - Skill tree name and level
      - Node title
      - Student name (badge on right)
    - **Middle Section:**
      - Submission timestamp
      - Submission URL (clickable link)
      - Student notes (in blue box)
    - **Bottom:**
      - "Review Submission" button

**If no submissions:**
- "No pending reviews at this time. Great job! 🎉"

**Review Modal:**
- **Header:** Student and assignment info
- **Review Feedback textarea:**
  - Required
  - 6 rows
  - For instructor comments
- **Two buttons:**
  - Cancel (red)
  - Approve & Submit (green)

**After review:**
- Submission removed from pending list
- Student sees feedback on their skill tree view

---

## Color Scheme

The website uses a modern, dark cyberpunk theme:

**Background Colors:**
- Main background: Dark blue-black (#1a1a2e)
- Cards: Slightly lighter blue-black (#16213e)
- Borders: Gray-blue (#34495e)

**Accent Colors:**
- Primary (links, buttons): Bright blue (#3498db)
- Success: Green (#2ecc71)
- Warning: Orange (#f39c12)
- Danger: Red (#e74c3c)

**Text Colors:**
- Primary text: Off-white (#ecf0f1)
- Secondary text: Light gray (#bdc3c7)

**Gradients:**
- Background: Blue-black gradient
- Progress bars: Blue to green gradient
- Completed badges: Green gradient

---

## Responsive Design

**Desktop (1200px+):**
- Stats: 4 cards in a row
- Skill trees: 3 cards per row
- Skill nodes: 2-3 per row

**Tablet (768px - 1199px):**
- Stats: 2 cards per row
- Skill trees: 2 cards per row
- Skill nodes: 2 per row

**Mobile (< 768px):**
- Stats: 2 cards per row
- Skill trees: 1 per row (stacked)
- Skill nodes: 1 per row (stacked)
- Navbar: Simplified, stacked layout

---

## Interactive Elements

**Hover Effects:**
- **Cards:** Lift up slightly with shadow
- **Buttons:** Darken slightly
- **Links:** Underline appears
- **Skill trees:** Border color changes to blue

**Click Effects:**
- Buttons have smooth transition
- Modals slide in smoothly
- Page transitions are instant

**Loading States:**
- "Loading..." text appears while fetching data
- Buttons show "Loading..." or "Submitting..." when processing

---

## Icons Used

The site uses react-icons library:
- 🔒 **FaLock** - Locked nodes
- ▶️ **FaPlay** - Unlocked/in-progress nodes
- ✅ **FaCheck** - Completed nodes
- 📋 **FaClipboardCheck** - Reviewed badge
- 👤 **FaUser** - Profile link
- 🚪 **FaSignOutAlt** - Logout
- 📝 **FaTasks** - Reviews link (admin)

Plus emojis in text for extra personality! 🎯🚀🎉

---

## Navigation Flow

```
Login → Dashboard → Select Skill Tree → View Nodes →
  ↓
Unlock → Start → Submit → Wait for Review → See Feedback
  ↓
Profile (anytime to update info)
  ↓
Instructor: Reviews (grade submissions)
```

---

## First-Time User Experience

1. **Visit site** → Redirected to login
2. **Click "Register"** → Fill form
3. **Auto-login** → See dashboard
4. **All stats show 0** (new user)
5. **See 8 skill trees** with 0% progress
6. **Click on tree** → See all nodes locked
7. **Unlock first node** → Status changes to blue
8. **Start working** → Status changes to orange
9. **Submit work** → Status changes to green
10. **Wait for instructor** → Receive feedback
11. **Progress tracked** on dashboard

---

## Data From Your Spreadsheet

All the content is automatically populated from your Google Sheets:

**Capture the Flag:**
- Level 1: Metasploitable 3 - Find 3 flags
- Level 2: OverTheWire Bandit - Find 2 flags
- Level 3: Hack The Box - Complete 2 machines

**Cloud Specialty:**
- Level 1: AWS Certified Cloud Practitioner
- Level 2: Microsoft Azure Fundamentals
- Level 3: Google Cloud Digital Leader

**Lab Man:**
- Levels 1-3: Lab exercises with quizzes

**Coding:**
- Level 1: Complete 1 Codecademy course
- Level 2: Complete 2 Codecademy courses

**Lock Picking:**
- Level 1: Pick 3 locks
- Level 2: Pick 6 locks
- Level 3: Pick 9 locks

**Health Tracking:**
- Levels 1-3: Track 1-3 health factors

**AI Deception:**
- 4 modules on social engineering

**AI Model Forensics:**
- 4 modules on AI security

---

## Tips for Using the Site

**For Students:**
1. Unlock nodes as you start working
2. Mark as "in progress" to track active work
3. Submit with detailed notes
4. Include links to all work (Drive, GitHub, etc.)
5. Check back for instructor feedback

**For Instructors:**
1. Check "Reviews" regularly
2. Click submission URLs to verify work
3. Provide detailed feedback
4. Be encouraging! 🎉

**For Everyone:**
1. Use a strong password
2. Pick a cool hacker name!
3. Track your progress weekly
4. Complete easier trees first
5. Aim for 100% completion! 🏆

