const mongoose = require('mongoose');

const CommentLikeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    },
    type: {
        type: String,
        enum: ['like'],
        default: 'like'
    },
},{
    timestamps: true
});

CommentLikeSchema.pre('save', function(next) {
    next();
});

module.exports = mongoose.model('CommentLike', CommentLikeSchema);
