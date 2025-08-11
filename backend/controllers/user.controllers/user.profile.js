const postModel = require("../../models/post.model");
const userModel = require("../../models/user.model");

const userProfile = async (req, res) => {

    try {

        const pageNumber = Number(req.query.page) || 1;
        const limit = 20;
        const skip = (pageNumber - 1) * limit;

        // 1. Get current user, select ignores fields other than name
        //const user = await userModel.findOne({ _id: req.userId })
        //    .select('name email profilepic bio token')
        //    .populate({
        //        path: 'posts',
        //        select: 'postpic caption owner createdAt',
        //        options: {
        //            sort: {createdAt: -1},
        //            skip: skip,
        //            limit: limit
        //        },
        //        populate: {
        //            path: 'owner',
        //            select: 'name profilepic'
        //        }
        //    });

        const user = await userModel.aggregate([
            {
                $match: {_id: req.userId}
            },
            {
                $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'owner',
                    pipeline: [
                        { $sort: {createdAt: -1} },
                        { $skip: skip },
                        { $limit: limit },
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
                                isMine: true
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                postpic: 1,
                                caption: 1,
                                likesCount: 1,
                                commentsCount: 1,
                                isLiked: 1,
                                isCommented: 1,
                                isMine: 1,
                                createdAt: 1,
                            }
                        }
                    ],
                    as: "posts"
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    bio: 1,
                    profilepic: 1,
                    token: 1,
                    posts: 1
                }
            }
        ]);

        if (!user?.length || user[0].token !== req.userToken) {
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
                profile: user[0]
            });

        } else{
            return res.status(200).json({
                success: true,
                pageNumber,
                profile: user[0]
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