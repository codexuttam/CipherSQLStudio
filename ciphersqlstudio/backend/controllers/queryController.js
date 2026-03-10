const pool = require('../config/postgres');

function isSelectOnly(sql) {
    if (!sql) return false;
    // Disallow semicolons to prevent multi-statement execution
    if (sql.includes(';')) return false;
    // Allow queries that start with SELECT or WITH (common for CTEs)
    return /^\s*(SELECT|WITH)\b/i.test(sql);
}

exports.execute = async (req, res) => {
    const { query } = req.body;
    if (!isSelectOnly(query)) {
        return res.status(400).json({ error: 'Only SELECT/ WITH queries are allowed.' });
    }
    try {
        const result = await pool.query(query);
        res.json({ rows: result.rows, fields: result.fields.map(f => f.name) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
