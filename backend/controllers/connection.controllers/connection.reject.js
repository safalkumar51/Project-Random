const friendRequestModel = require("../../models/friendRequest.model");
const userModel = require("../../models/user.model");

const connectionReject = async (req, res) => {
    const { requestId, senderId } = req.body;

    try {
        const user = await userModel.findOne({ _id: req.userId }).select('friendRequests token');
        if (!user || user.token !== req.userToken) {
            return res.status(401).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        if (!requestId || !senderId) {
            return res.status(400).json({
                success: false,
                message: "Invalid request: Missing required fields"
            });
        }

        // Delete both friend requests
        const [deleted1, deleted2] = await Promise.all([
            friendRequestModel.findOneAndDelete({ from: req.userId, to: senderId }),
            friendRequestModel.findOneAndDelete({ from: senderId, to: req.userId })
        ]);

        if(!deleted1 && !deleted2){
            return res.status(200).json({
                success: true,
                message: "Friend request(s) no longer available"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Friend request(s) deleted successfully"
        });

    } catch (err) {
        console.log("Friend Request Reject Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = connectionReject;