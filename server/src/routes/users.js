import express from 'express';
import { db } from '../db/index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { role, branch, search } = req.query;

    let sql = `
      SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        u.branch,
        u.semester,
        u.created_at,
        COUNT(c.id) AS total_complaints,
        SUM(CASE WHEN c.status = 'Resolved' THEN 1 ELSE 0 END) AS resolved_complaints
      FROM users u
      LEFT JOIN complaints c ON u.id = c.user_id
      WHERE 1=1
    `;
    const params = [];

    if (role && role !== 'All') {
      sql += ' AND u.role = ?';
      params.push(role);
    }

    if (branch && branch !== 'All') {
      sql += ' AND u.branch = ?';
      params.push(branch);
    }

    if (search && search.trim() !== '') {
      const q = `%${search.trim().toLowerCase()}%`;
      sql += ' AND (LOWER(u.name) LIKE ? OR LOWER(u.email) LIKE ?)';
      params.push(q, q);
    }

    sql += ' GROUP BY u.id ORDER BY u.id ASC';

    const users = db.prepare(sql).all(...params);
    return res.json(users);
  } catch (err) {
    console.error('Fetch users error:', err);
    return res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

router.get('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'admin' && parseInt(id, 10) !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to view this profile.' });
    }

    const user = db.prepare(`
      SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        u.branch,
        u.semester,
        u.created_at,
        COUNT(c.id) AS total_complaints,
        SUM(CASE WHEN c.status = 'Resolved' THEN 1 ELSE 0 END) AS resolved_complaints,
        SUM(CASE WHEN c.status = 'Pending' THEN 1 ELSE 0 END) AS pending_complaints,
        SUM(CASE WHEN c.status = 'In Progress' THEN 1 ELSE 0 END) AS in_progress_complaints
      FROM users u
      LEFT JOIN complaints c ON u.id = c.user_id
      WHERE u.id = ?
      GROUP BY u.id
    `).get(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json(user);
  } catch (err) {
    console.error('Fetch user by id error:', err);
    return res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

export default router;
