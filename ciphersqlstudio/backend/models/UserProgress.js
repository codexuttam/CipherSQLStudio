const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserProgressSchema = new Schema({
    userId: { type: String, required: true }, // Session ID or User ID (e.g. workspace_123 or real user)
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    sqlQuery: { type: String, default: '' },
    lastAttempt: { type: Date, default: Date.now },
    isCompleted: { type: Boolean, default: false },
    attemptCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('UserProgress', UserProgressSchema);
