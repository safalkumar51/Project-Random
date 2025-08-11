const mongoose = require('mongoose');

const helpSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problem: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'resolved'],
        default: 'pending'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Help', helpSchema);