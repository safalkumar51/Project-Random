const friendRequestModel = require("../../models/friendRequest.model");
const userModel = require("../../models/user.model");

const connectionAccept = async (req, res) => {
    const { requestId, senderId } = req.body;

    try {
        const user = await userModel.findOne({ _id: req.userId }).select('token');
        if (!user || user.token !== req.userToken) {
            return res.status(404).json({
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
        
        const sender = await userModel.findOne({ _id: senderId }).select('_id');

        // Ensure both requests exist
        let myWay = await friendRequestModel.findOne({ from: req.userId, to: senderId });
        let otherWay = await friendRequestModel.findOne({ from: senderId, to: req.userId });

        if (!sender || !myWay || !otherWay) {
            await friendRequestModel.deleteMany({
                $or: [
                    { from: senderId, to: req.userId },
                    { from: req.userId, to: senderId }
                ]
            });

            return res.status(400).json({
                success: false,
                message: "Friend request no longer valid"
            });
        }

        if (myWay.status === 'requested') {
            // 1. Mutually accepted – create connection
            otherWay.status = 'connected';
            myWay.status = 'connected';

            // 2. Save both friend request updates in parallel
            await Promise.all([otherWay.save(), myWay.save()]);

            const io = req.app.get('io');
            io.to(senderId).emit('receive_connection', myWay);

            return res.status(201).json({
                success: true,
                message: "Connected successfully",
                status: "connected"
            });
            
        } else {
            // First time acceptance
            otherWay.status = 'requested';
            await otherWay.save();

            return res.status(202).json({
                success: true,
                message: "Friend request accepted successfully",
                status: "requested"
            });
        }

    } catch (err) {
        console.error("Friend Request Accept Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

module.exports = connectionAccept;
