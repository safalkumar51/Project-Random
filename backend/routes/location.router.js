const express = require('express');

const isLoggedIn = require('../middleware/isLoggedIn');
const userModel = require('../models/user.model');
const friendRequestModel = require('../models/friendRequest.model');

const router = express.Router();

router.post('/', isLoggedIn, async (req, res) => {
    const { lat, lon } = req.body;
    
    console.log(req.body);
    return res.status(200).json({ success: true });;

    if (!lat || !lon) {
        return res.status(400).json({ message: "Latitude and Longitude required" });
    }

    try {

        let me = await userModel.findOne({ _id: req.userId });
        if (!me || me.token !== req.userToken) {
            return res.status(404).json({ message: "User not found or token mismatch" });
        }

        // set new location of the user
        me.location = { type: 'Point', coordinates: [lon, lat] };
        await me.save();

        if(lat===85.0 && lon===-179.0){
            return res.status(200);
        }

        // find users in loaction: lon and lat with range maxDist, except user himself
        const nearby = await userModel.find({
            _id: { $ne: req.userId }, // to exclude the user
            'location.coordinates': { $exists: true }, //added so that Mongo can use the partial index
            location: {
                // $near is used to search nearby
                $near: {
                    $geometry: { type: 'Point', coordinates: [lon, lat] }, // location
                    $maxDistance: 40 // Range: 40 meters
                }
            }
        });

        for (let other of nearby) {
            // find if request already exists
            const existing = await friendRequestModel.findOne({
                $or: [
                    { from: me._id, to: other._id },
                    { from: other._id, to: me._id }
                ]
            });

            if (!existing) {
                //create request both ways
                const [myWay, otherWay] = await Promise.all([
                    friendRequestModel.create({ from: me._id, to: other._id }),
                    friendRequestModel.create({ from: other._id, to: me._id })
                ]);

                const [myWayPopulated, otherWayPopulated] = await Promise.all([
                    friendRequestModel.findById(myWay._id)
                        .select('from status createdAt')
                        .populate('from', 'name profilepic'),
                    friendRequestModel.findById(otherWay._id)
                        .select('from status createdAt')
                        .populate('from', 'name profilepic')
                ]);

                const io = req.app.get('io');
                io.to(me._id.toString()).emit('receive_request', otherWayPopulated);
                io.to(other._id.toString()).emit('receive_request', myWayPopulated);
            }
        }

        return res.status(200).json({
            discovered: nearby.map(other => other._id)
        });

    } catch (err) {
        console.log("Location Error:", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

module.exports = router;