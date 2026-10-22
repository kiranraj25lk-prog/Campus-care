import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { JWT_SECRET } from '../config.js';
import { authenticateToken } from '../middleware/auth.js';
import { formatDDMMYYYY } from '../utils/date.js';

const router = express.Router();

router.post('/register', (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Request body must be valid JSON.' });
    }

    const { name, email, password, role = 'student', branch, semester } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Full name is required.' });
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must contain at least 6 characters.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM users WHERE LOWER(email) = ?').get(normalizedEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);
    const userRole = role === 'admin' ? 'admin' : 'student';

    const insert = db.prepare(`
      INSERT INTO users (name, email, password_hash, role, branch, semester, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      name.trim(),
      normalizedEmail,
      password_hash,
      userRole,
      branch ? branch.trim() : 'General',
      semester ? semester.trim() : '1st Semester',
      formatDDMMYYYY()
    );

    const userId = Number(result.lastInsertRowid);

    const newUser = {
      id: userId,
      name: name.trim(),
      email: normalizedEmail,
      role: userRole,
      branch: branch ? branch.trim() : 'General',
      semester: semester ? semester.trim() : '1st Semester'
    };

    const token = jwt.sign({ id: userId, role: userRole }, JWT_SECRET, { expiresIn: '7d' });

    // Send welcome notification
    db.prepare(`
      INSERT INTO notifications (user_id, message, is_read, created_at)
      VALUES (?, ?, 0, ?)
    `).run(userId, 'Welcome to CampusCare portal. You can now register and track complaints.', formatDDMMYYYY());

    return res.status(201).json({
      message: 'Account registered successfully.',
      token,
      user: newUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: err.message || 'Failed to register account.' });
  }
});

router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      message: 'Authentication successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
        semester: user.semester
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
});

router.get('/me', authenticateToken, (req, res) => {
  return res.json({ user: req.user });
});

router.put('/profile', authenticateToken, (req, res) => {
  try {
    const { name, branch, semester } = req.body;
    db.prepare(`
      UPDATE users
      SET name = COALESCE(?, name),
          branch = COALESCE(?, branch),
          semester = COALESCE(?, semester)
      WHERE id = ?
    `).run(name ? name.trim() : null, branch, semester, req.user.id);

    const updated = db.prepare('SELECT id, name, email, role, branch, semester FROM users WHERE id = ?').get(req.user.id);
    return res.json({ message: 'Profile updated successfully.', user: updated });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});

export default router;
