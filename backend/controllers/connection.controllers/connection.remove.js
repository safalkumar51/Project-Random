const friendRequestModel = require("../../models/friendRequest.model");
const userModel = require("../../models/user.model");

const connectionRemove = async (req, res) => {
    const { senderId } = req.body;

    try {
        const me = await userModel.findOne({ _id: req.userId }).select('token');
        if (!me || me.token !== req.userToken) {
            return res.status(404).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        if (!senderId) {
            return res.status(400).json({
                success: false,
                message: "Invalid request: Missing required fields"
            });
        }

        // Cleanly delete both friend request directions
        const [deleted1, deleted2] = await Promise.all([
            friendRequestModel.findOneAndDelete({ from: req.userId, to: senderId }),
            friendRequestModel.findOneAndDelete({ from: senderId, to: req.userId })
        ]);

        if (!deleted1 && !deleted2) {
            return res.status(200).json({
                success: true,
                message: "Connection no longer available"
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Connection removed successfully'
        });

    } catch (err) {
        console.error("Connection Remove Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = connectionRemove;