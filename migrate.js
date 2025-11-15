const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'migrations.sql'), 'utf8');
    await pool.query(sql);
    console.log('Migrated');
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
})();
