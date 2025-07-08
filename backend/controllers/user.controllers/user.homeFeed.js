const postModel = require('../../models/post.model');
const userModel = require('../../models/user.model');

const userHomeFeed = async (req, res) => {
    try{

        const pageNumber = Number(req.query.page) || 1;
        const limit = 20;
        const skip = (pageNumber - 1) * limit;

        // 1. Get current user (only `connections` and `token`)
        const user = await userModel.findById(req.userId).select('connections token');
        if (!user || user.token !== req.userToken) {
            return res.status(401).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        // 2. Prepare all user IDs to fetch posts from (connections + self)
        const idsToFetch = [...user.connections, req.userId];

        // 5. Fetch paginated posts
        const [posts, total] = await Promise.all([
            postModel.find({ owner: { $in: idsToFetch } })
                .populate('owner', 'name profilepic') // To get owner's name and profilepic
                .sort({ createdAt: -1 }) // -1 >> To sort in descending order (latest first)
                .skip(skip) // skip >> To skip posts already sent
                .limit(limit) // limit >> To send limit posts
                .lean(), // to fetch posts for read only, optimize the db load
            postModel.countDocuments({ owner: { $in: idsToFetch } })
        ]);

        return res.status(200).json({
            success: true,
            pageNumber,
            totalPages: Math.ceil(total / limit),
            totalPosts: total,
            posts
        });

        
    } catch(err){
        console.log("User Home Feed Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = userHomeFeed;