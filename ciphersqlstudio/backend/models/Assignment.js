const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AssignmentSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true }, // "Easy", "Medium", "Hard"
    question: { type: String, required: true },
    sampleTables: [
        {
            tableName: String,
            columns: [
                {
                    columnName: String,
                    dataType: String // "INTEGER", "TEXT", "REAL", etc.
                }
            ],
            rows: [Schema.Types.Mixed] // Flexible field for row data arrays
        }
    ],
    expectedOutput: {
        type: { type: String }, // "table", "single_value", "column", "count"
        value: Schema.Types.Mixed // Flexible field to store any type of expected result
    }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', AssignmentSchema);
