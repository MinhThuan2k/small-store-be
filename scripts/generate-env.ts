import { readFileSync, writeFileSync } from 'fs';
import { configDotenv } from 'dotenv';
import { resolve } from 'path';

const envPath = resolve(__dirname, '../.env');
configDotenv({ path: envPath });

const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT = 3306 } = process.env;

if (!DB_USER || !DB_HOST || !DB_NAME) {
  console.error('❌ Thiếu biến môi trường DB_*');
  process.exit(1);
}

const DATABASE_URL = `mysql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

let envContent = readFileSync(envPath, 'utf-8');

// Xóa dòng cũ DATABASE_URL nếu có
envContent = envContent.replace(/^DATABASE_URL=.*\n?/gm, '');

// Ghi lại file với DATABASE_URL ở cuối
envContent += `\nDATABASE_URL="${DATABASE_URL}"\n`;

writeFileSync(envPath, envContent);
console.log('✅ Đã cập nhật DATABASE_URL trong .env');
