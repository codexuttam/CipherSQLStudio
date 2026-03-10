const pool = require('../config/postgres');
const Assignment = require('../models/Assignment');

function isSelectOnly(sql) {
    if (!sql) return false;
    let cleanSql = sql.trim();
    if (cleanSql.endsWith(';')) cleanSql = cleanSql.slice(0, -1);
    // Disallow semicolons inside the statement to prevent multi-statement execution
    if (cleanSql.includes(';')) return false;
    // Allow queries that start with SELECT or WITH (common for CTEs)
    return /^\s*(SELECT|WITH)\b/i.test(cleanSql);
}

exports.execute = async (req, res) => {
    const { query, assignmentId } = req.body;
    if (!isSelectOnly(query)) {
        return res.status(400).json({ error: 'Only SELECT/ WITH queries are allowed.' });
    }

    if (!assignmentId) {
        return res.status(400).json({ error: 'Assignment ID is required.' });
    }

    let assignment;
    try {
        assignment = await Assignment.findById(assignmentId).lean();
        if (!assignment) return res.status(404).json({ error: 'Assignment not found.' });
    } catch (err) {
        return res.status(500).json({ error: 'Database error fetching assignment.' });
    }

    const sandboxSchema = 'workspace_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        await client.query(`CREATE SCHEMA ${sandboxSchema}`);
        await client.query(`SET search_path TO ${sandboxSchema}`);

        // Construct tables from the assignment definitions
        if (assignment.sampleTables && assignment.sampleTables.length > 0) {
            for (const table of assignment.sampleTables) {
                const cols = table.columns.map(c => `"${c.columnName}" ${c.dataType}`).join(', ');
                await client.query(`CREATE TABLE "${table.tableName}" (${cols})`);

                if (table.rows && table.rows.length > 0) {
                    for (const row of table.rows) {
                        const keys = Object.keys(row);
                        const vals = Object.values(row);

                        const placeholders = vals.map((_, i) => `$${i + 1}`).join(', ');
                        const colNames = keys.map(k => `"${k}"`).join(', ');

                        const insertSql = `INSERT INTO "${table.tableName}" (${colNames}) VALUES (${placeholders})`;
                        await client.query(insertSql, vals);
                    }
                }
            }
        }

        const result = await client.query(query);
        res.json({ rows: result.rows, fields: result.fields.map(f => f.name) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await client.query('ROLLBACK');
        client.release();
    }
};
