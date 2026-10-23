import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DB_PATH, UPLOAD_DIR, IS_VERCEL } from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure directories exist
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// If running in Vercel serverless and /tmp DB doesn't exist yet, copy bundled SQLite
if (IS_VERCEL && !fs.existsSync(DB_PATH)) {
  const candidatePaths = [
    path.resolve(__dirname, '../../campuscare.sqlite'),
    path.resolve(__dirname, '../campuscare.sqlite'),
    path.resolve(process.cwd(), 'server/campuscare.sqlite'),
    path.resolve(process.cwd(), 'campuscare.sqlite'),
    path.resolve('/var/task/server/campuscare.sqlite'),
    path.resolve('/var/task/campuscare.sqlite')
  ];
  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate)) {
      try {
        fs.copyFileSync(candidate, DB_PATH);
        console.log(`[CampusCare DB] Initialized /tmp database from ${candidate}`);
        break;
      } catch (e) {
        console.warn(`[CampusCare DB] Could not copy from ${candidate}:`, e.message);
      }
    }
  }
}

const rawDb = new DatabaseSync(DB_PATH);

const normalize = (arg) => (arg === undefined ? null : arg);

export const db = {
  raw: rawDb,
  exec(sql) {
    return rawDb.exec(sql);
  },
  pragma(sql) {
    return rawDb.exec(`PRAGMA ${sql}`);
  },
  prepare(sql) {
    const stmt = rawDb.prepare(sql);
    return {
      run(...args) {
        const res = stmt.run(...args.map(normalize));
        return {
          ...res,
          lastInsertRowid: Number(res.lastInsertRowid),
          changes: Number(res.changes)
        };
      },
      get(...args) {
        return stmt.get(...args.map(normalize));
      },
      all(...args) {
        return stmt.all(...args.map(normalize));
      }
    };
  },
  close() {
    return rawDb.close();
  }
};

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('student', 'admin')),
      branch TEXT,
      semester TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      head_name TEXT,
      contact_email TEXT
    );

    CREATE TABLE IF NOT EXISTS complaints (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      image_path TEXT,
      priority TEXT NOT NULL CHECK(priority IN ('Low', 'Medium', 'High')),
      status TEXT NOT NULL CHECK(status IN ('Pending', 'In Progress', 'Resolved')),
      department_id INTEGER,
      admin_remarks TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(department_id) REFERENCES departments(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Auto-seed demo data if database is empty (e.g., fresh serverless cold-start)
  try {
    const userRow = db.prepare('SELECT COUNT(*) as count FROM users').get();
    if (!userRow || userRow.count === 0) {
      console.log('[CampusCare DB] Fresh database detected. Auto-seeding initial accounts & complaints...');
      import('./seed.js').then(({ seed }) => {
        try {
          seed();
          console.log('[CampusCare DB] Initial demo data seeded successfully.');
        } catch (seedErr) {
          console.error('[CampusCare DB] Auto-seeding failed:', seedErr.message);
        }
      }).catch(err => {
        console.error('[CampusCare DB] Could not load seed module:', err.message);
      });
    }
  } catch (err) {
    console.error('[CampusCare DB] Error checking user count:', err.message);
  }
}

export function generateComplaintId() {
  const rows = db.prepare('SELECT id FROM complaints').all();
  let maxNum = 1000;
  for (const row of rows) {
    if (typeof row.id === 'string' && row.id.startsWith('C')) {
      const num = parseInt(row.id.substring(1), 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }
  return `C${maxNum + 1}`;
}
