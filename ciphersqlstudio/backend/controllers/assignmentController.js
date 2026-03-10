const path = require('path');
const assignments = require('../data/assignments.json');

exports.list = (req, res) => {
    res.json(assignments);
};

exports.getById = (req, res) => {
    const id = req.params.id;
    const assign = assignments.find(a => a._id === id);
    if (!assign) return res.status(404).json({ error: 'Not found' });
    res.json(assign);
};
