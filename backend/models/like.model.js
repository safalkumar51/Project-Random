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
        enum: ['like'],
        default: 'like'
    },
},{
    timestamps: true
});

likeSchema.pre('save', function(next) {
    next();
});

module.exports = mongoose.model('Like', likeSchema);
