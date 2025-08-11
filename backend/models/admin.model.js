const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    profilepic: {
        type: String,
        default: "default.png"
    },
    token: {
        type: String
    },
})

module.exports = mongoose.model('Admin', adminSchema);