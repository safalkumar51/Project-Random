const postModel = require("../../models/post.model");
const userModel = require("../../models/user.model");

const userProfile = async (req, res) => {

    try {

        const pageNumber = Number(req.query.page) || 1;
        const limit = 20;
        const skip = (pageNumber - 1) * limit;
        console.log(pageNumber);
        const posts = await postModel.aggregate([
            {
                $match: {owner: req.userId}
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                profilepic: 1,
                            }
                        }
                    ]
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
                    owner: {
                        $first: '$owner',
                    }
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
                    isMine: true
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

        if(pageNumber > 1){
            return res.status(200).json({
                success: true,
                pageNumber,
                posts: posts
            });
        }

        const user = await userModel.aggregate([
            {
                $match: {_id: req.userId}
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    bio: 1,
                    profilepic: 1,
                    token: 1
                }
            }
        ]);

        if (!user?.length || user[0].token !== req.userToken) {
            return res.status(404).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        const total = await postModel.countDocuments({ owner: req.userId });

        return res.status(200).json({
            success: true,
            pageNumber,
            totalPages: Math.ceil(total / limit),
            totalPosts: total,
            profile: user[0],
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