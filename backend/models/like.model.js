const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
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
    type: {
        type: String,
        enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'],
        default: 'like'
    },
    status: {
        type: String,
        enum: ['active', 'removed'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

likeSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Like', likeSchema);
