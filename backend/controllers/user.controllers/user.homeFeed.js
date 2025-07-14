const postModel = require('../../models/post.model');
const userModel = require('../../models/user.model');

const userHomeFeed = async (req, res) => {
    try{

        const pageNumber = Number(req.query.page) || 1;
        const limit = 20;
        const skip = (pageNumber - 1) * limit;

        // 1. Get user's connections
        const user = await userModel.findOne({_id: req.userId})
            .select('token')
            .populate({
                path: 'connections',
                select: 'from',
                populate: {
                    path: 'from',
                    select: '_id'
                }
            })
            .lean();

        if (!user || user.token !== req.userToken) {
            return res.status(401).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        // 2. Prepare all user IDs to fetch posts from (connections + self)
        const idsToFetch = user.connections.map(c => c.from._id);
        idsToFetch.push(req.userId); // Include user's own posts

        // 3. Fetch paginated posts
        const posts = await postModel.find({ owner: { $in: idsToFetch } })
            .sort({ createdAt: -1 }) // -1 >> To sort in descending order (latest first)
            .skip(skip) // skip >> To skip posts already sent
            .limit(limit) // limit >> To send limit posts
            .populate('owner', 'name profilepic') // To get owner's name and profilepic
            .lean(); // to fetch posts for read only, optimize the db load
        
        if(pageNumber === 1){
            const total = await postModel.countDocuments({ owner: { $in: idsToFetch } });
            
            return res.status(200).json({
                success: true,
                pageNumber,
                totalPages: Math.ceil(total / limit),
                totalPosts: total,
                posts
            });

        } else{
            return res.status(200).json({
                success: true,
                pageNumber,
                posts
            });
        }

    } catch(err){
        console.log("User Home Feed Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = userHomeFeed;