const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    postpic: {
        type: String
    },
    caption: {
        type: String
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    Date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Post', postSchema);