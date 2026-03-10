// Load environment variables from .env early
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const assignmentsRouter = require('./routes/assignments');
const queryRouter = require('./routes/query');
const hintRouter = require('./routes/hint');
const pool = require('./config/postgres');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

app.use('/api/assignments', assignmentsRouter);
app.use('/api/execute-query', queryRouter);
app.use('/api/get-hint', hintRouter);

// Health endpoint to verify DB connectivity
app.get('/health', async (req, res) => {
    try {
        const now = await pool.testConnection();
        return res.json({ status: 'ok', now });
    } catch (err) {
        return res.status(500).json({ status: 'error', error: err.message });
    }
});

const PORT = process.env.PORT || 4000;

// Start server and keep reference for graceful shutdown/restart
let server = app.listen(PORT, () => {
    console.log(`CipherSQL backend running on port ${PORT}`);
});

// Handle server errors (e.g., port already in use)
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
    } else {
        console.error('Server error:', err);
    }
    // Attempt graceful shutdown of DB pool then exit so process manager (nodemon) can restart cleanly
    if (pool && typeof pool.end === 'function') {
        pool.end().catch(() => { }).finally(() => process.exit(1));
    } else {
        process.exit(1);
    }
});

// Graceful shutdown helper
const gracefulShutdown = async (signal) => {
    console.log(`Received ${signal} - shutting down gracefully.`);
    try {
        if (server) {
            await new Promise((resolve, reject) => {
                server.close((err) => (err ? reject(err) : resolve()));
            });
            console.log('HTTP server closed.');
        }
        if (pool && typeof pool.end === 'function') {
            await pool.end();
            console.log('DB pool closed.');
        }
    } catch (err) {
        console.error('Error during shutdown:', err);
    } finally {
        // If nodemon sent SIGUSR2, re-emit it to allow restart
        if (signal === 'SIGUSR2') {
            process.kill(process.pid, 'SIGUSR2');
        } else {
            process.exit(0);
        }
    }
};

// Listen for termination / restart signals
process.once('SIGUSR2', () => gracefulShutdown('SIGUSR2'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Catch unhandled rejections and exceptions to attempt graceful shutdown
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    gracefulShutdown('unhandledRejection');
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    gracefulShutdown('uncaughtException');
});
