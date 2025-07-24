const friendRequestModel = require("../../models/friendRequest.model");
const postModel = require("../../models/post.model");
const userModel = require("../../models/user.model");

const connectionProfileGetter = async (req, res) => {
    const pageNumber = Number(req.query.page) || 1;
    const limit = 20;
    const skip = (pageNumber - 1) * limit;
    const otherId = req.query.otherId;

    try {
        const me = await userModel.findOne({ _id: req.userId }).select('token');
        if (!me || req.userToken !== me.token) {
            return res.status(404).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        const request = await friendRequestModel.findOne({from:otherId, to:req.userId});

        const other = await userModel.findOne({ _id: otherId })
            .select('name email profilepic bio')
            .populate({
                path: 'posts',
                select: 'postpic caption owner',
                options: {
                    sort: { createdAt: -1 },
                    skip: skip,
                    limit: limit
                },
                populate: {
                    path: 'owner',
                    select: 'name profilepic'
                }
            });

        if (!otherId || !other || !request || request.status !== 'connected') {
            return res.status(400).json({
                success: false,
                message: "Invalid Request!"
            })
        }

        if (pageNumber === 1) {
            const total = await postModel.countDocuments({ owner: otherId });

            return res.status(200).json({
                success: true,
                pageNumber,
                totalPages: Math.ceil(total / limit),
                totalPosts: total,
                profile: other
            });

        } else {
            return res.status(200).json({
                success: true,
                pageNumber,
                profile: other
            });
        }

    } catch (err) {
        console.log("Connection Profile Getter Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = connectionProfileGetter;