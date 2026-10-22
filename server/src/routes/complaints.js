import express from 'express';
import { db, generateComplaintId } from '../db/index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { uploadComplaintImage } from '../middleware/upload.js';
import { formatDDMMYYYY } from '../utils/date.js';

const router = express.Router();

// Get complaints list (Role-aware & Filterable)
router.get('/', authenticateToken, (req, res) => {
  try {
    const { status, category, priority, department_id, search } = req.query;
    const isStudent = req.user.role === 'student';

    let sql = `
      SELECT
        c.id,
        c.user_id,
        c.title,
        c.category,
        c.description,
        c.image_path,
        c.priority,
        c.status,
        c.department_id,
        c.admin_remarks,
        c.created_at,
        c.updated_at,
        u.name AS student_name,
        u.email AS student_email,
        u.branch AS student_branch,
        u.semester AS student_semester,
        d.name AS department_name
      FROM complaints c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN departments d ON c.department_id = d.id
      WHERE 1=1
    `;

    const params = [];

    if (isStudent) {
      sql += ' AND c.user_id = ?';
      params.push(req.user.id);
    }

    if (status && status !== 'All') {
      sql += ' AND c.status = ?';
      params.push(status);
    }

    if (category && category !== 'All') {
      sql += ' AND c.category = ?';
      params.push(category);
    }

    if (priority && priority !== 'All') {
      sql += ' AND c.priority = ?';
      params.push(priority);
    }

    if (department_id && department_id !== 'All') {
      sql += ' AND c.department_id = ?';
      params.push(parseInt(department_id, 10));
    }

    if (search && search.trim() !== '') {
      const q = `%${search.trim().toLowerCase()}%`;
      sql += ' AND (LOWER(c.id) LIKE ? OR LOWER(c.title) LIKE ? OR LOWER(c.description) LIKE ? OR LOWER(u.name) LIKE ?)';
      params.push(q, q, q, q);
    }

    sql += ' ORDER BY c.id DESC';

    const complaints = db.prepare(sql).all(...params);
    return res.json(complaints);
  } catch (err) {
    console.error('Fetch complaints error:', err);
    return res.status(500).json({ error: 'Failed to fetch complaints.' });
  }
});

// Get single complaint details
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const complaint = db.prepare(`
      SELECT
        c.*,
        u.name AS student_name,
        u.email AS student_email,
        u.branch AS student_branch,
        u.semester AS student_semester,
        d.name AS department_name,
        d.head_name AS department_head,
        d.contact_email AS department_email
      FROM complaints c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN departments d ON c.department_id = d.id
      WHERE c.id = ?
    `).get(id);

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found.' });
    }

    // Authorization check
    if (req.user.role === 'student' && complaint.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to view this complaint.' });
    }

    return res.json(complaint);
  } catch (err) {
    console.error('Fetch complaint by id error:', err);
    return res.status(500).json({ error: 'Failed to fetch complaint details.' });
  }
});

// Submit new complaint (Student)
router.post('/', authenticateToken, (req, res) => {
  uploadComplaintImage(req, res, (uploadErr) => {
    if (uploadErr) {
      return res.status(400).json({ error: uploadErr.message });
    }

    try {
      const { title, category, description, priority = 'Medium' } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Complaint title is required.' });
      }
      if (!category || !category.trim()) {
        return res.status(400).json({ error: 'Please select a valid complaint category.' });
      }
      if (!description || !description.trim()) {
        return res.status(400).json({ error: 'Detailed complaint description is required.' });
      }

      const validPriorities = ['Low', 'Medium', 'High'];
      const chosenPriority = validPriorities.includes(priority) ? priority : 'Medium';

      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
      const complaintId = generateComplaintId();
      const todayDate = formatDDMMYYYY();

      const insert = db.prepare(`
        INSERT INTO complaints (
          id, user_id, title, category, description, image_path, priority, status, department_id, admin_remarks, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', NULL, NULL, ?, ?)
      `);

      insert.run(
        complaintId,
        req.user.id,
        title.trim(),
        category.trim(),
        description.trim(),
        imagePath,
        chosenPriority,
        todayDate,
        todayDate
      );

      // Notification for student
      db.prepare(`
        INSERT INTO notifications (user_id, message, is_read, created_at)
        VALUES (?, ?, 0, ?)
      `).run(
        req.user.id,
        `Your complaint ${complaintId} ("${title.trim().slice(0, 30)}...") has been successfully logged.`,
        todayDate
      );

      // Fetch created record
      const created = db.prepare(`
        SELECT c.*, u.name AS student_name, d.name AS department_name
        FROM complaints c
        LEFT JOIN users u ON c.user_id = u.id
        LEFT JOIN departments d ON c.department_id = d.id
        WHERE c.id = ?
      `).get(complaintId);

      return res.status(201).json({
        message: 'Complaint submitted successfully.',
        complaint: created
      });
    } catch (err) {
      console.error('Create complaint error:', err);
      return res.status(500).json({ error: 'Failed to create complaint.' });
    }
  });
});

// Update complaint status & remarks (Admin only)
router.put('/:id/status', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_remarks } = req.body;

    const validStatuses = ['Pending', 'In Progress', 'Resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value. Must be Pending, In Progress, or Resolved.' });
    }

    const complaint = db.prepare('SELECT * FROM complaints WHERE id = ?').get(id);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found.' });
    }

    const todayDate = formatDDMMYYYY();
    db.prepare(`
      UPDATE complaints
      SET status = ?,
          admin_remarks = COALESCE(?, admin_remarks),
          updated_at = ?
      WHERE id = ?
    `).run(status, admin_remarks !== undefined ? admin_remarks : null, todayDate, id);

    // Notify student
    db.prepare(`
      INSERT INTO notifications (user_id, message, is_read, created_at)
      VALUES (?, ?, 0, ?)
    `).run(
      complaint.user_id,
      `Status update for ${id}: Changed to "${status}" by college administration.`,
      todayDate
    );

    const updated = db.prepare(`
      SELECT c.*, u.name AS student_name, d.name AS department_name
      FROM complaints c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN departments d ON c.department_id = d.id
      WHERE c.id = ?
    `).get(id);

    return res.json({ message: 'Complaint status updated successfully.', complaint: updated });
  } catch (err) {
    console.error('Update status error:', err);
    return res.status(500).json({ error: 'Failed to update complaint status.' });
  }
});

// Assign complaint to department (Admin only)
router.put('/:id/assign', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { department_id, admin_remarks, status } = req.body;

    const complaint = db.prepare('SELECT * FROM complaints WHERE id = ?').get(id);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found.' });
    }

    const dept = db.prepare('SELECT * FROM departments WHERE id = ?').get(department_id);
    if (!dept) {
      return res.status(400).json({ error: 'Invalid department ID.' });
    }

    const todayDate = formatDDMMYYYY();
    const newStatus = status || (complaint.status === 'Pending' ? 'In Progress' : complaint.status);

    db.prepare(`
      UPDATE complaints
      SET department_id = ?,
          status = ?,
          admin_remarks = COALESCE(?, admin_remarks),
          updated_at = ?
      WHERE id = ?
    `).run(department_id, newStatus, admin_remarks !== undefined ? admin_remarks : null, todayDate, id);

    // Notify student
    db.prepare(`
      INSERT INTO notifications (user_id, message, is_read, created_at)
      VALUES (?, ?, 0, ?)
    `).run(
      complaint.user_id,
      `Your complaint ${id} has been routed to "${dept.name}" for resolution.`,
      todayDate
    );

    const updated = db.prepare(`
      SELECT c.*, u.name AS student_name, d.name AS department_name
      FROM complaints c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN departments d ON c.department_id = d.id
      WHERE c.id = ?
    `).get(id);

    return res.json({ message: `Assigned complaint to ${dept.name}.`, complaint: updated });
  } catch (err) {
    console.error('Assign complaint error:', err);
    return res.status(500).json({ error: 'Failed to assign complaint.' });
  }
});

// Delete complaint (Admin or owner if Pending)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const complaint = db.prepare('SELECT * FROM complaints WHERE id = ?').get(id);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found.' });
    }

    if (req.user.role !== 'admin' && (complaint.user_id !== req.user.id || complaint.status !== 'Pending')) {
      return res.status(403).json({ error: 'Only pending complaints can be withdrawn by student, or deleted by admin.' });
    }

    db.prepare('DELETE FROM complaints WHERE id = ?').run(id);
    return res.json({ message: `Complaint ${id} removed successfully.` });
  } catch (err) {
    console.error('Delete complaint error:', err);
    return res.status(500).json({ error: 'Failed to delete complaint.' });
  }
});

export default router;
