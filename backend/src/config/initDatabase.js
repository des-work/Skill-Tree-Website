require('dotenv').config();
const db = require('./database');

console.log('Initializing database...');

// Create Users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    hacker_name TEXT,
    role TEXT DEFAULT 'student' CHECK(role IN ('student', 'instructor', 'admin')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create SkillTrees table
db.exec(`
  CREATE TABLE IF NOT EXISTS skill_trees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create SkillNodes table
db.exec(`
  CREATE TABLE IF NOT EXISTS skill_nodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    skill_tree_id INTEGER NOT NULL,
    level INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    submission_requirements TEXT,
    points INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (skill_tree_id) REFERENCES skill_trees(id) ON DELETE CASCADE
  )
`);

// Create UserProgress table
db.exec(`
  CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    skill_node_id INTEGER NOT NULL,
    status TEXT DEFAULT 'locked' CHECK(status IN ('locked', 'unlocked', 'in_progress', 'completed', 'reviewed')),
    submission_url TEXT,
    submission_notes TEXT,
    submitted_at DATETIME,
    reviewed_by INTEGER,
    review_notes TEXT,
    reviewed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_node_id) REFERENCES skill_nodes(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(user_id, skill_node_id)
  )
`);

console.log('Database tables created successfully!');

// Insert sample skill trees from the spreadsheet
const skillTrees = [
  { name: 'Capture the Flag', description: 'Complete CTF challenges on various platforms', category: 'hands-on', display_order: 1 },
  { name: 'Cloud Specialty', description: 'Earn cloud computing certifications', category: 'certification', display_order: 2 },
  { name: 'Lab Man', description: 'Complete lab exercises and quizzes', category: 'lab-work', display_order: 3 },
  { name: 'Coding', description: 'Complete programming language courses', category: 'development', display_order: 4 },
  { name: 'Lock Picking', description: 'Physical security - lock picking exercises', category: 'physical', display_order: 5 },
  { name: 'Health Tracking', description: 'Track health factors throughout the semester', category: 'wellness', display_order: 6 },
  { name: 'AI Deception and Social Engineering', description: 'Learn about AI-powered social engineering', category: 'ai-security', display_order: 7 },
  { name: 'AI Model Forensics', description: 'AI incident response and forensics', category: 'ai-security', display_order: 8 }
];

const insertSkillTree = db.prepare('INSERT OR IGNORE INTO skill_trees (name, description, category, display_order) VALUES (?, ?, ?, ?)');

for (const tree of skillTrees) {
  insertSkillTree.run(tree.name, tree.description, tree.category, tree.display_order);
}

console.log('Sample skill trees inserted!');

// Insert skill nodes from the spreadsheet
const skillNodes = [
  // Capture the Flag
  { tree: 'Capture the Flag', level: 1, title: 'Metasploitable 3 CTF', description: 'Find three (3) flags on a Metasploitable 3 machine.', requirements: 'Upload screenshots in one Word document (or PDF) to Canvas', points: 100 },
  { tree: 'Capture the Flag', level: 2, title: 'OverTheWire - Bandit', description: 'Find two (2) flags on OverTheWire — Bandit.', requirements: 'File upload (screenshots or a brief document showing your results).', points: 100 },
  { tree: 'Capture the Flag', level: 3, title: 'Hack The Box', description: 'Complete two (2) live machines on Hack The Box (HTB) and capture the flags.', requirements: 'File upload with screenshots showing proof of completion.', points: 150 },
  
  // Cloud Specialty
  { tree: 'Cloud Specialty', level: 1, title: 'AWS Cloud Practitioner', description: 'Upload proof of passing the AWS Certified Cloud Practitioner exam', requirements: 'File upload (certificate or official score report).', points: 200 },
  { tree: 'Cloud Specialty', level: 2, title: 'Azure Fundamentals', description: 'Upload proof of passing Microsoft Azure Fundamentals certification.', requirements: 'File upload (certificate or official score report).', points: 200 },
  { tree: 'Cloud Specialty', level: 3, title: 'Google Cloud Digital Leader', description: 'Upload proof of passing Google Cloud Digital Leader certification.', requirements: 'File upload (certificate or official score report).', points: 200 },
  
  // Lab Man
  { tree: 'Lab Man', level: 1, title: 'Lab Exercises Set 1', description: 'Answer all analysis questions and the key terms quiz. Take screenshots of the last step in every lab.', requirements: 'File upload with screenshots and answers', points: 100 },
  { tree: 'Lab Man', level: 2, title: 'Lab Exercises Set 2', description: 'Answer all analysis questions and the key terms quiz. Take screenshots of the last step in every lab.', requirements: 'File upload with screenshots and answers', points: 100 },
  { tree: 'Lab Man', level: 3, title: 'Lab Exercises Set 3', description: 'Answer all analysis questions and the key terms quiz. Take screenshots of the last step in every lab.', requirements: 'File upload with screenshots and answers', points: 100 },
  
  // Coding
  { tree: 'Coding', level: 1, title: 'First Programming Language', description: 'Complete one (1) programming language course on Codecademy.', requirements: 'When you sign up, use the hacker name chosen for the hacker-name assignment.', points: 150 },
  { tree: 'Coding', level: 2, title: 'Second Programming Language', description: 'Complete two (2) programming language courses on Codecademy.', requirements: 'Use your hacker name on the account. Completing more than two courses may count as extra credit.', points: 200 },
  
  // Lock Picking
  { tree: 'Lock Picking', level: 1, title: 'Pick 3 Locks', description: 'Pick three (3) locks.', requirements: 'File upload (images showing you picking the locks)', points: 75 },
  { tree: 'Lock Picking', level: 2, title: 'Pick 6 Locks', description: 'Pick six (6) locks.', requirements: 'File upload (images showing you picking the locks)', points: 100 },
  { tree: 'Lock Picking', level: 3, title: 'Pick 9 Locks', description: 'Pick nine (9) locks', requirements: 'File upload (images showing you picking the locks)', points: 125 },
  
  // Health Tracking
  { tree: 'Health Tracking', level: 1, title: 'Track One Health Factor', description: 'Track one (1) health factor over the course of the semester (e.g., Diet, Sleep, or Exercise).', requirements: 'Weekly submissions with data tracking', points: 100 },
  { tree: 'Health Tracking', level: 2, title: 'Track Two Health Factors', description: 'Track two (2) health factors over the course of the semester.', requirements: 'Weekly submissions with data tracking', points: 150 },
  { tree: 'Health Tracking', level: 3, title: 'Track Three Health Factors', description: 'Track three (3) health factors over the course of the semester.', requirements: 'Weekly submissions with data tracking', points: 200 },
  
  // AI Deception and Social Engineering
  { tree: 'AI Deception and Social Engineering', level: 1, title: 'Module 1: AI & Social Manipulation', description: 'Module 1: AI & Social Manipulation', requirements: 'Complete module assignments', points: 100 },
  { tree: 'AI Deception and Social Engineering', level: 2, title: 'Module 2: Automated Phishing', description: 'Module 2: Automated Phishing & Pretexting', requirements: 'Complete module assignments', points: 100 },
  { tree: 'AI Deception and Social Engineering', level: 3, title: 'Module 3: Deepfake Fabrication', description: 'Module 3: Deepfake Fabrication and Vishing', requirements: 'Complete module assignments', points: 100 },
  { tree: 'AI Deception and Social Engineering', level: 4, title: 'Project: Human Defense', description: 'Module 4: Project: Human Defense & Simulation', requirements: 'Complete final project', points: 150 },
  
  // AI Model Forensics
  { tree: 'AI Model Forensics', level: 1, title: 'Module 1: Foundation', description: 'Module 1: Foundation of AI Incident Response', requirements: 'Complete module assignments', points: 100 },
  { tree: 'AI Model Forensics', level: 2, title: 'Module 2: Compromise Detection', description: 'Module 2: Compromise Detection & Monitoring', requirements: 'Complete module assignments', points: 100 },
  { tree: 'AI Model Forensics', level: 3, title: 'Module 3: Model Theft', description: 'Module 3: Model Theft and Watermarking', requirements: 'Complete module assignments', points: 100 },
  { tree: 'AI Model Forensics', level: 4, title: 'Project: Post-Incident', description: 'Module 4: Project: Post-Incident Attribution', requirements: 'Complete final project', points: 150 }
];

const getTreeId = db.prepare('SELECT id FROM skill_trees WHERE name = ?');
const insertNode = db.prepare('INSERT OR IGNORE INTO skill_nodes (skill_tree_id, level, title, description, submission_requirements, points) VALUES (?, ?, ?, ?, ?, ?)');

for (const node of skillNodes) {
  const treeId = getTreeId.get(node.tree)?.id;
  if (treeId) {
    insertNode.run(treeId, node.level, node.title, node.description, node.requirements, node.points);
  }
}

console.log('Skill nodes inserted!');

// Create a default admin user (password: admin123 - CHANGE THIS!)
const bcrypt = require('bcryptjs');
const adminPassword = bcrypt.hashSync('admin123', 10);

const insertAdmin = db.prepare('INSERT OR IGNORE INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)');
insertAdmin.run('admin', 'admin@skilltree.edu', adminPassword, 'admin');

console.log('Default admin user created (username: admin, password: admin123)');
console.log('⚠️  PLEASE CHANGE THE DEFAULT PASSWORD IMMEDIATELY!');

db.close();
console.log('Database initialization complete!');

