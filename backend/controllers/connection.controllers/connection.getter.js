const userModel = require("../../models/user.model");
const friendRequestModel = require("../../models/friendRequest.model");

const connectionGetter = async (req, res) => {
    const pageNumber = Number(req.query.page) || 1;
    const limit = 40;
    const skip = (pageNumber - 1) * limit;

    try {

        const user = await userModel.findOne({ _id: req.userId })
            .select('token')
            .populate({
                path: 'connections',
                select: 'from updatedAt',
                options: {
                    sort: { updatedAt: -1 },        // Override default sort
                    skip: skip, // Pagination
                    limit: limit
                },
                populate: {
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

        if(pageNumber === 1){
            const total = await friendRequestModel.countDocuments({ to: req.userId, status: 'connected' });

            return res.status(200).json({
                success: true,
                pageNumber,
                totalPages: Math.ceil(total / limit),
                totalConnections: total,
                connections: user.connections,
            })

        } else {
            return res.status(200).json({
                success: true,
                pageNumber,
                connections: user.connections,
            })
        }

    } catch (err) {
        console.error("Connection Getter Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = connectionGetter;