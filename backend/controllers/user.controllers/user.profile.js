const postModel = require("../../models/post.model");
const userModel = require("../../models/user.model");

const userProfile = async (req, res) => {

    try {

        const pageNumber = Number(req.query.page) || 1;
        const limit = 20;
        const skip = (pageNumber - 1) * limit;

        // 1. Get current user, select ignores fields other than name
        const user = await userModel.findOne({ _id: req.userId })
            .select('name email profilepic bio token')
            .populate({
                path: 'posts',
                select: 'postpic caption owner createdAt',
                options: {
                    sort: {createdAt: -1},
                    skip: skip,
                    limit: limit
                },
                populate: {
                    path: 'owner',
                    select: 'name profilepic'
                }
            });

        if (!user || user.token !== req.userToken) {
            return res.status(404).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        if(pageNumber === 1){
            const total = await postModel.countDocuments({ owner: req.userId });

            return res.status(200).json({
                success: true,
                pageNumber,
                totalPages: Math.ceil(total / limit),
                totalPosts: total,
                profile: user
            });

        } else{
            return res.status(200).json({
                success: true,
                pageNumber,
                profile: user
            });
        }

    } catch (err) {
        console.log("User Profile Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = userProfile;