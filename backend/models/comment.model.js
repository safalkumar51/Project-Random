const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    likesCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'removed', 'flagged'],
        default: 'active'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

commentSchema.pre('save', function(next) {
    next();
});

module.exports = mongoose.model('Comment', commentSchema);
