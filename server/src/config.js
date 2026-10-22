import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from server directory or project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const IS_VERCEL = !!process.env.VERCEL;
export const PORT = Number(process.env.PORT) || 5001;
export const JWT_SECRET = process.env.JWT_SECRET || 'campuscare_jwt_secret_dev_key_2026';

export const UPLOAD_DIR = IS_VERCEL
  ? path.join('/tmp', 'uploads')
  : path.resolve(__dirname, '../uploads');

export const DB_PATH = IS_VERCEL
  ? path.join('/tmp', 'campuscare.sqlite')
  : path.resolve(__dirname, '../campuscare.sqlite');
