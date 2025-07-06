const connectionModel = require('../../models/connection.model');
const postModel = require('../../models/post.model');
const userModel = require('../../models/user.model');

const userHomeFeed = async (req, res) => {
    try{

        const pageNumber = Number(req.query.page) || 1;
        const limit = 10;
        const skip = (pageNumber - 1) * limit;

        // 1. Get current user, select ignores fields other than connections
        const user = await userModel.findOne( {_id: req.userId} ).select('connections token');
        if (!user || user.token !== req.userToken){
            return res.status(404).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        // 2. Get ids of connection of the user
        const connections = await connectionModel.find({ users: req.userId }).populate('users');
        
        const connectedUsers = [];

        connections.forEach(conn => {
            conn.users.forEach(user => {
                if (user._id.toString() !== req,userId.toString()) {
                    connectedUsers.push(user);
                }
            });
        });

        // 3. Add user's own ID to include their posts too
        const idsToFetch = [...connectedUsers, req.userId];

        // 4. Get posts owned by any of the connected users or the user themselves
        // Added Pagination using skip and limit
        const posts = await postModel.find({ owner: { $in: idsToFetch } })
            .populate('owner', 'name profilepic') // To get owner's name and profilepic
            .sort({ Date: -1 }) // -1 >> To sort in descending order (latest first)
            .skip(skip) // skip >> To skip posts already sent
            .limit(limit); // limit >> To send limit posts

        const total = await postModel.countDocuments({ owner: { $in: idsToFetch } });

        return res.status(200).json({
            success: true,
            pageNumber,
            totalPages: Math.ceil(total / limit),
            totalPosts: total,
            posts: posts
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