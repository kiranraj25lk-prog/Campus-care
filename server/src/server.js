import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PORT, UPLOAD_DIR } from './config.js';
import { initDatabase } from './db/index.js';

import authRoutes from './routes/auth.js';
import complaintsRoutes from './routes/complaints.js';
import departmentsRoutes from './routes/departments.js';
import usersRoutes from './routes/users.js';
import statsRoutes from './routes/stats.js';
import notificationsRoutes from './routes/notifications.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverPublic = path.resolve(__dirname, '../public');
const clientDist = path.resolve(__dirname, '../../client/dist');

// Prefer server/public, fallback to client/dist
const staticDir = fs.existsSync(serverPublic) ? serverPublic : clientDist;

// Initialize SQLite database schema
initDatabase();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded complaint files
app.use('/uploads', express.static(UPLOAD_DIR));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CampusCare API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/notifications', notificationsRoutes);

// Serve static frontend assets & SPA
if (fs.existsSync(staticDir)) {
  // Static assets (CSS, JS, SVG, etc.) - index: false so root '/' goes to our handler below
  app.use(express.static(staticDir, { index: false }));

  const indexPath = path.join(staticDir, 'index.html');

  // SPA fallback for all frontend routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    try {
      if (fs.existsSync(indexPath)) {
        const html = fs.readFileSync(indexPath, 'utf8');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(html);
      }
      return next();
    } catch (err) {
      console.error('Error reading index.html:', err);
      return res.status(500).send('Unable to serve frontend application: ' + err.message);
    }
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: err.message || 'An unexpected internal server error occurred.'
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CampusCare API] Server running on http://localhost:${PORT}`);
  });
}

export default app;
