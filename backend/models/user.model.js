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
    friendRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FriendRequest'
        }
    ],
    connections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            validate: {
                validator: function (val) {
                    return !val || (Array.isArray(val) && val.length === 2);
                },
                message: 'Coordinates must be an array of two numbers [lon, lat]'
            }
        }
    }
});

userSchema.index({ location: '2dsphere' },
    {
        partialFilterExpression: {
            'location.coordinates': { $exists: true }
        }
    }
);

module.exports = mongoose.model('User', userSchema);