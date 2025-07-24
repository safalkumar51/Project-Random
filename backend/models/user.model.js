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
},{
    toJSON: { virtuals: true },  // 👈 Include virtuals in JSON
    toObject: { virtuals: true },
    timestamps: true
});

userSchema.virtual('friendRequests', {
    ref: 'FriendRequest',
    localField: '_id',
    foreignField: 'to',
    justOne: false,
})

userSchema.virtual('connections', {
    ref: 'FriendRequest',
    localField: '_id',
    foreignField: 'to',
    justOne: false,
    match: {status: 'connected'},
})

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'owner',
    justOne: false,
})

userSchema.index({ location: '2dsphere' },
    {
        partialFilterExpression: {
            'location.coordinates': { $exists: true }
        }
    }
);

module.exports = mongoose.model('User', userSchema);