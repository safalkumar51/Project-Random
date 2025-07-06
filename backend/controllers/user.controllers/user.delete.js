const connectionModel = require("../../models/connection.model");
const postModel = require("../../models/post.model");
const userModel = require("../../models/user.model");

const userDelete = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.userId });

        if (!user || user.token !== req.userToken) {
            return res.status(404).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        // Delete all posts by user
        await postModel.deleteMany({ owner: req.userId });

        // Delete all connections involving user
        await connectionModel.deleteMany({ users: req.userId });

        // Delete the user
        await userModel.findOneAndDelete({ _id: req.userId });

        return res.status(200).json({
            success: true,
            message: 'User and associated data deleted successfully.'
        });

    } catch (err) {
        console.log("User Delete Error:", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};
  

module.exports = userDelete;