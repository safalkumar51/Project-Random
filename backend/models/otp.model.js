const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        required: true,
        index: { expires: 0 } // TTL index
    },
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
})

module.exports = mongoose.model('Otp', otpSchema);