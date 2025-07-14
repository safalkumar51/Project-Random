const friendRequestModel = require("../../models/friendRequest.model");
const userModel = require("../../models/user.model");

const connectionRequestsGetter = async (req, res) => {
    const pageNumber = Number(req.query.page) || 1;
    const limit = 30;
    const skip = (pageNumber - 1) * limit;

    try {

        const user = await userModel.findOne({ _id: req.userId })
            .select('token')
            .populate({
                path: 'friendRequests',
                select: 'from status createdAt',
                options: {
                    sort: { createdAt: -1 }, // Sort requests by newest first (recommended)
                    skip: skip,
                    limit: limit
                },
                populate: { // Nested populate for 'from'
                    path: 'from',
                    select: 'name profilepic'
                }
            })
            .lean();

        if (!user || user.token !== req.userToken) {
            return res.status(404).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        if (pageNumber === 1) {
            const total = await friendRequestModel.countDocuments({ to: req.userId });

            return res.status(200).json({
                success: true,
                pageNumber,
                totalPages: Math.ceil(total / limit),
                totalConnections: total,
                requests: user.friendRequests
            })

        } else{
            return res.status(200).json({
                success: true,
                pageNumber,
                requests: user.friendRequests
            })
        }

    } catch (err) {
        console.error("Connection Get Requests Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = connectionRequestsGetter;