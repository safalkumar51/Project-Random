const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
    },
    bio: {
        type: String
    },
    profilepic: {
        type: String,
        default: "https://res.cloudinary.com/project-random/image/upload/v1751710445/default_yte3vu.png"
    },
    token: {
        type: String
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    follows: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    connections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Connection'
        }
    ]
})

module.exports = mongoose.model('User', userSchema);