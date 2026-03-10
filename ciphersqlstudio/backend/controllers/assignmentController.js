const Assignment = require('../models/Assignment');

exports.list = async (req, res) => {
    try {
        const assignments = await Assignment.find({}).lean();
        // The frontend expects the old format initially.
        // It maps over tables array instead of sampleTables. So we need to format the return value.
        const formatted = assignments.map(a => ({
            ...a,
            tables: a.sampleTables.map(t => t.tableName)
        }));
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const id = req.params.id;
        const assign = await Assignment.findById(id).lean();
        if (!assign) return res.status(404).json({ error: 'Not found' });

        // Map sampleTables to strings for backward-compatibility with frontend
        assign.tables = assign.sampleTables.map(t => t.tableName);

        res.json(assign);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
