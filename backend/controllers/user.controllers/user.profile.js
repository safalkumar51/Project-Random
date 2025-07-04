const postModel = require("../../models/post.model");
const userModel = require("../../models/user.model");

const userProfile = async (req, res) => {

    try {

        const pageNumber = req.body.pageNumber || 1;
        const limit = 10;
        const skip = (pageNumber - 1) * limit;

        // 1. Get current user, select ignores fields other than name
        const user = await userModel.findOne({ _id: req.userId }).select('name email profilepic bio');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        // 2. Get posts owned the user
        // Added Pagination using skip and limit
        const posts = await postModel.find({ owner: req.userId })
            .populate('owner', 'name profilepic') // To get owner's name and profilepic
            .sort({ createdAt: -1 }) // -1 >> To sort in descending order (latest first)
            .skip(skip) // skip >> To skip posts already sent
            .limit(limit); // limit >> To send limit posts

        return res.status(200).json({
            success: true,
            page,
            totalPages: Math.ceil(total / limit),
            totalPosts: total,
            profile: user,
            posts: posts
        });

    } catch (err) {
        console.log("User Profile Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = userProfile;