import express from 'express';
import { db } from '../db/index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// List departments with statistics
router.get('/', authenticateToken, (req, res) => {
  try {
    const departments = db.prepare(`
      SELECT
        d.id,
        d.name,
        d.description,
        d.head_name,
        d.contact_email,
        COUNT(c.id) AS total_complaints,
        SUM(CASE WHEN c.status = 'Pending' THEN 1 ELSE 0 END) AS pending_count,
        SUM(CASE WHEN c.status = 'In Progress' THEN 1 ELSE 0 END) AS in_progress_count,
        SUM(CASE WHEN c.status = 'Resolved' THEN 1 ELSE 0 END) AS resolved_count
      FROM departments d
      LEFT JOIN complaints c ON d.id = c.department_id
      GROUP BY d.id
      ORDER BY d.id ASC
    `).all();

    return res.json(departments);
  } catch (err) {
    console.error('Fetch departments error:', err);
    return res.status(500).json({ error: 'Failed to fetch departments.' });
  }
});

// Create department (Admin)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { name, description, head_name, contact_email } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Department name is required.' });
    }

    const insert = db.prepare(`
      INSERT INTO departments (name, description, head_name, contact_email)
      VALUES (?, ?, ?, ?)
    `);

    const result = insert.run(
      name.trim(),
      description ? description.trim() : null,
      head_name ? head_name.trim() : null,
      contact_email ? contact_email.trim() : null
    );

    const created = db.prepare('SELECT * FROM departments WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ message: 'Department created successfully.', department: created });
  } catch (err) {
    console.error('Create department error:', err);
    return res.status(500).json({ error: 'Failed to create department. Name may already exist.' });
  }
});

// Update department (Admin)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, head_name, contact_email } = req.body;

    db.prepare(`
      UPDATE departments
      SET name = COALESCE(?, name),
          description = COALESCE(?, description),
          head_name = COALESCE(?, head_name),
          contact_email = COALESCE(?, contact_email)
      WHERE id = ?
    `).run(name, description, head_name, contact_email, id);

    const updated = db.prepare('SELECT * FROM departments WHERE id = ?').get(id);
    return res.json({ message: 'Department updated successfully.', department: updated });
  } catch (err) {
    console.error('Update department error:', err);
    return res.status(500).json({ error: 'Failed to update department.' });
  }
});

export default router;
