const postModel = require('../../models/post.model');
const friendRequestModel = require('../../models/friendRequest.model');
const userModel = require('../../models/user.model');

const userHomeFeed = async (req, res) => {
    try{

        const pageNumber = Number(req.query.page) || 1;
        const limit = 20;
        const skip = (pageNumber - 1) * limit;

        //// 1. Get user's connections
        //const user = await userModel.findOne({_id: req.userId})
        //    .select('token')
        //    .populate({
        //        path: 'connections',
        //        select: 'from',
        //        populate: {
        //            path: 'from',
        //            select: '_id'
        //        }
        //    })
        //    .lean();
//
        
//
        //// 2. Prepare all user IDs to fetch posts from (connections + self)
        //const idsToFetch = user.connections.map(c => c.from._id);
        //idsToFetch.push(req.userId); // Include user's own posts
        //const user = await userModel.findOne({_id: req.userId}).select('token');
        
        const user = await userModel.aggregate([
            {
                $match: {_id: req.userId}
            },
            {
                $lookup: {
                    from: 'friendrequests',
                    let: { userId: "$_id"},
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$to", req.userId] },
                                        { $eq: ["$status", "connected"] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                from: 1
                            }
                        }
                    ],
                    as: 'connections'
                }
            },
            {
                $project: {
                    _id: 1,
                    token: 1,
                    connections: 1,
                }
            }
        ]);
        if (!user?.length || user[0].token !== req.userToken) {
            return res.status(401).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        const idsToFetch = user[0].connections.map(conn => conn.from);

        // Include the current user
        idsToFetch.push(req.userId);

        const posts = await postModel.aggregate([
            {
                $match: { owner: { $in: idsToFetch } }
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "users",
                    localField: 'owner',
                    foreignField: '_id',
                    as: "owner",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                profilepic: 1,
                            }
                        }
                    ],
                    
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: '_id',
                    foreignField: 'post',
                    as: "likes"
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'post',
                    as: 'comments',
                }
            },
            {
                $addFields: {
                    likesCount: {
                        $size: "$likes"
                    },
                    commentsCount: {
                        $size: "$comments"
                    },
                    isLiked: {
                        $cond: {
                            if: {
                                $in: [
                                    req.userId,
                                    { $map: { input: "$likes", as: "like", in: "$$like.user" } }
                                ]
                            },
                            then: true,
                            else: false
                        }
                    },
                    isCommented: {
                        $cond: {
                            if: {
                                $in: [
                                    req.userId,
                                    { $map: { input: "$comments", as: "comment", in: "$$comment.user" } }
                                ]
                            },
                            then: true,
                            else: false
                        }
                    },
                    isMine: {
                        $cond: {
                            if: {
                                $eq: [
                                    "$owner._id", req.userId
                                ]
                            },
                            then: true,
                            else: false
                        }
                    },
                    owner: {
                        $first: '$owner',
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    postpic: 1,
                    caption: 1,
                    owner: 1,
                    likesCount: 1,
                    commentsCount: 1,
                    isLiked: 1,
                    isCommented: 1,
                    isMine: 1,
                    createdAt: 1,
                }
            }
        ]);

        //// 3. Fetch paginated posts
        //const posts = await postModel.find({ owner: { $in: idsToFetch } })
        //    .sort({ createdAt: -1 }) // -1 >> To sort in descending order (latest first)
        //    .skip(skip) // skip >> To skip posts already sent
        //    .limit(limit) // limit >> To send limit posts
        //    .populate('owner', 'name profilepic') // To get owner's name and profilepic
        //    .lean(); // to fetch posts for read only, optimize the db load
        
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