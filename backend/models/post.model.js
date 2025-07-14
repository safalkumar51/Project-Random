const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    postpic: {
        type: String
    },
    caption: {
        type: String,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    timestamps: true
})

postSchema.index({ owner: 1, createdAt: -1 }); // For feed query

module.exports = mongoose.model('Post', postSchema);