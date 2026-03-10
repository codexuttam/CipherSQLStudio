const { Pool } = require('pg');

// Use DATABASE_URL env var or fallback to localhost defaults
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres';

const pool = new Pool({ connectionString });

module.exports = pool;
