const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/backendsocial");

const userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    dob: {
        type: Date,
    },
    bio: {
        type: String
    },
    profilepic: {
        type: String,
        default: "default.png"
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
})

module.exports = mongoose.model('User', userSchema);