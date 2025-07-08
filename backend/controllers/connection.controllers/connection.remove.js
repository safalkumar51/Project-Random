const friendRequestModel = require("../../models/friendRequest.model");
const userModel = require("../../models/user.model");

const connectionRemove = async (req, res) => {
    const { senderId } = req.body;

    if (!senderId) {
        return res.status(400).json({
            success: false,
            message: "Invalid request: Missing required fields"
        });
    }

    const me = await userModel.findOne({ _id: req.userId }).select('connections token');
    if (!me || me.token !== req.userToken) {
        return res.status(404).json({
            success: false,
            message: 'Log In Required!'
        });
    }
    
    try{

        // Cleanly delete both friend request directions
        const [myWay, otherWay] = await Promise.all([
            friendRequestModel.findOneAndDelete({ from: req.userId, to: senderId }),
            friendRequestModel.findOneAndDelete({ from: senderId, to: req.userId })
        ]);

        const updates = [
            userModel.updateOne(
                { _id: req.userId },
                { $pull: { connections: senderId } }
            ),
            userModel.updateOne(
                { _id: senderId },
                { $pull: { connections: req.userId } }
            )
        ];

        if (myWay) {
            updates.push(
                userModel.updateOne(
                    { _id: senderId },
                    { $pull: { friendRequests: myWay._id } }
                )
            );
        }

        if (otherWay) {
            updates.push(
                userModel.updateOne(
                    { _id: req.userId },
                    { $pull: { friendRequests: otherWay._id } }
                )
            );
        }

        await Promise.all(updates);

        if(updates.length > 0){
            return res.status(200).json({
                success: true,
                message: 'Connection removed successfully'
            });
        } else{
            return res.status(503).json({
                success: false,
                message: 'Service Unavailable'
            });
        }

    } catch(err){
        console.error("Connection Remove Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = connectionRemove;