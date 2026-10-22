import express from 'express';
import { db } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  try {
    const notifications = db.prepare(`
      SELECT id, user_id, message, is_read, created_at
      FROM notifications
      WHERE user_id = ?
      ORDER BY id DESC
      LIMIT 30
    `).all(req.user.id);

    const unreadCount = db.prepare(`
      SELECT COUNT(*) AS count
      FROM notifications
      WHERE user_id = ? AND is_read = 0
    `).get(req.user.id).count;

    return res.json({ notifications, unreadCount });
  } catch (err) {
    console.error('Fetch notifications error:', err);
    return res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
});

router.put('/:id/read', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').run(id, req.user.id);
    return res.json({ message: 'Notification marked as read.' });
  } catch (err) {
    console.error('Mark notification read error:', err);
    return res.status(500).json({ error: 'Failed to update notification.' });
  }
});

router.put('/read-all', authenticateToken, (req, res) => {
  try {
    db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(req.user.id);
    return res.json({ message: 'All notifications marked as read.' });
  } catch (err) {
    console.error('Mark all read error:', err);
    return res.status(500).json({ error: 'Failed to mark notifications read.' });
  }
});

export default router;
