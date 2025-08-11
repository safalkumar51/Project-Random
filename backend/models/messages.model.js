const mongoose = require('mongoose');

const messagesSchema = mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    newMessages: {
        type: Number,
        default: 0
    }
},{
    timestamps: true,
})

module.exports = mongoose.model('Messages', messagesSchema);