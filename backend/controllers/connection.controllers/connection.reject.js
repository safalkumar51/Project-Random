const friendRequestModel = require("../../models/friendRequest.model");
const userModel = require("../../models/user.model");

const connectionReject = async (req, res) => {
    const { requestId, senderId } = req.body;

    if (!requestId || !senderId) {
        return res.status(400).json({
            success: false,
            message: "Invalid request: Missing required fields"
        });
    }

    const user = await userModel.findOne({ _id: req.userId }).select('friendRequests token');
    if (!user || user.token !== req.userToken) {
        return res.status(401).json({
            success: false,
            message: 'Log In Required!'
        });
    }

    try {

        const sender = await userModel.findOne({ _id: senderId }).select('friendRequests');

        // 1. Delete both friend requests
        const myWay = await friendRequestModel.findOneAndDelete({ from: req.userId, to: senderId });
        const otherWay = await friendRequestModel.findOneAndDelete({ from: senderId, to: req.userId });

        // 2. Remove them from both users' friendRequests arrays (if they existed)
        const updates = [];

        if (myWay) {
            updates.push(
                userModel.updateOne(
                    { _id: sender._id },
                    { $pull: { friendRequests: myWay._id } }
                )
            );
        }

        if (otherWay) {
            updates.push(
                userModel.updateOne(
                    { _id: user._id },
                    { $pull: { friendRequests: otherWay._id } }
                )
            );
        }

        await Promise.all(updates); // Run in parallel for efficiency
        if (updates.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Friend request(s) deleted successfully"
            });
        } else{
            return res.status(503).json({
                success: false,
                message: 'Service Unavailable'
            });
        }


    } catch (err) {
        console.log("Friend Request Reject Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = connectionReject;