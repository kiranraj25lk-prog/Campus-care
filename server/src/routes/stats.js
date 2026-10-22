import express from 'express';
import { db } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/overview', authenticateToken, (req, res) => {
  try {
    const isStudent = req.user.role === 'student';
    const userId = req.user.id;

    // 4 Stat Cards
    let statSql = `
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) AS in_progress,
        SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) AS resolved
      FROM complaints
    `;
    const statParams = [];
    if (isStudent) {
      statSql += ' WHERE user_id = ?';
      statParams.push(userId);
    }
    const counts = db.prepare(statSql).get(...statParams) || { total: 0, pending: 0, in_progress: 0, resolved: 0 };

    // Category Distribution (for Pie Chart)
    let catSql = `
      SELECT category, COUNT(*) AS count
      FROM complaints
    `;
    const catParams = [];
    if (isStudent) {
      catSql += ' WHERE user_id = ?';
      catParams.push(userId);
    }
    catSql += ' GROUP BY category ORDER BY count DESC';
    const rawCategories = db.prepare(catSql).all(...catParams);

    // Color palette for categories (clean, accessible, navy/cobalt aligned)
    const categoryColors = {
      'Classroom': '#1D63E9',
      'Hostel': '#0B1F3A',
      'Wi-Fi/Network': '#0284C7',
      'Canteen': '#F59E0B',
      'Electrical': '#EF4444',
      'Plumbing': '#10B981',
      'Academic/Faculty': '#6366F1',
      'Other': '#64748B'
    };

    const categoryData = rawCategories.map(c => ({
      name: c.category,
      value: c.count,
      color: categoryColors[c.category] || '#64748B'
    }));

    // Monthly Complaints (for Bar Chart)
    // Parse DD-MM-YYYY dates into months
    const allComplaintsForMonthly = db.prepare(`
      SELECT created_at, status
      FROM complaints
      ${isStudent ? 'WHERE user_id = ?' : ''}
    `).all(...(isStudent ? [userId] : []));

    const monthBuckets = {
      '07-2026': { month: 'Jul', total: 0, resolved: 0 },
      '08-2026': { month: 'Aug', total: 0, resolved: 0 },
      '09-2026': { month: 'Sep', total: 0, resolved: 0 },
      '10-2026': { month: 'Oct', total: 0, resolved: 0 }
    };

    for (const row of allComplaintsForMonthly) {
      if (row.created_at && row.created_at.includes('-')) {
        const parts = row.created_at.split('-');
        if (parts.length === 3) {
          const key = `${parts[1]}-${parts[2]}`;
          if (!monthBuckets[key]) {
            const mNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const mIndex = parseInt(parts[1], 10) - 1;
            monthBuckets[key] = { month: mNames[mIndex] || parts[1], total: 0, resolved: 0 };
          }
          monthBuckets[key].total += 1;
          if (row.status === 'Resolved') {
            monthBuckets[key].resolved += 1;
          }
        }
      }
    }

    const monthlyData = Object.values(monthBuckets);

    // Recent Complaints for Dashboard Table
    let recentSql = `
      SELECT
        c.id,
        c.title,
        c.category,
        c.created_at AS date,
        c.status,
        c.priority,
        u.name AS student_name,
        d.name AS department_name
      FROM complaints c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN departments d ON c.department_id = d.id
    `;
    const recentParams = [];
    if (isStudent) {
      recentSql += ' WHERE c.user_id = ?';
      recentParams.push(userId);
    }
    recentSql += ' ORDER BY c.id DESC LIMIT 5';
    const recentComplaints = db.prepare(recentSql).all(...recentParams);

    return res.json({
      stats: {
        total: counts.total || 0,
        pending: counts.pending || 0,
        in_progress: counts.in_progress || 0,
        resolved: counts.resolved || 0
      },
      categoryData,
      monthlyData,
      recentComplaints
    });
  } catch (err) {
    console.error('Fetch stats overview error:', err);
    return res.status(500).json({ error: 'Failed to fetch statistics.' });
  }
});

export default router;
