const mongoose = require('mongoose');

const friendRequestSchema = mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['pending', 'requested', 'rejected', 'connected'],
        default: 'pending'
    }
},{
    timestamps: true
})

module.exports = mongoose.model('FriendRequest', friendRequestSchema);