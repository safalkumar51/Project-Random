const userModel = require("../../models/user.model");

const connectionRequestProfileGetter = async (req, res) => {
    const otherId = req.query.otherId;

    try {
        const me = await userModel.findOne({ _id: req.userId }).select('token');
        if (!me || req.userToken !== me.token) {
            return res.status(404).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        const other = await userModel.findOne({ _id: otherId })
            .select('name email profilepic bio')
            .lean();

        if (!otherId || !other) {
            return res.status(400).json({
                success: false,
                message: "Invalid Request!"
            })
        }

        return res.status(200).json({
            success: true,
            profile: other
        });

    } catch (err) {
        console.log("Connection Request Profile Getter Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = connectionRequestProfileGetter;