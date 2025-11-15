const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function initDB() {
  // run simple migration - create tables if not exist
  const migrationSql = fs.readFileSync(path.join(__dirname, 'migrations.sql'), 'utf8');
  await pool.query(migrationSql);
  console.log('DB initialized');
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  initDB
};

