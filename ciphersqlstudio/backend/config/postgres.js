const { Pool } = require('pg');

// Prefer a full DATABASE_URL env var, but allow building from individual parts for convenience
const {
    DATABASE_URL,
    DB_USER,
    DB_PASS,
    DB_HOST,
    DB_PORT,
    DB_NAME,
} = process.env;

let connectionString = DATABASE_URL;
if (!connectionString) {
    const user = DB_USER || 'postgres';
    const pass = DB_PASS || 'postgres';
    const host = DB_HOST || 'localhost';
    const port = DB_PORT || '5432';
    const db = DB_NAME || 'postgres';
    connectionString = `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}/${db}`;
}

// Build pool options from environment with sensible defaults
const poolOptions = {
    connectionString,
    max: Number(process.env.DB_POOL_MAX) || 20,
    idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS) || 30000,
    connectionTimeoutMillis: Number(process.env.DB_CONN_TIMEOUT_MS) || 2000,
};

// Optional SSL: set DB_SSL=true in env for providers that require TLS (e.g. Heroku, some managed DBs)
// To skip certificate verification (not recommended for production), set DB_SSL_REJECT_UNAUTHORIZED=false
if (process.env.DB_SSL === 'true' || /sslmode=require/i.test(connectionString)) {
    poolOptions.ssl = {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
    };
}

const pool = new Pool(poolOptions);

// Helper to test connectivity quickly
pool.testConnection = async function testConnection() {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT NOW()');
        return res.rows[0];
    } finally {
        client.release();
    }
};

module.exports = pool;
