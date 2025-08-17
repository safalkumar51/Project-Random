const mongoose = require('mongoose');
const postModel = require("../../models/post.model");
const userModel = require("../../models/user.model");
const friendRequestModel = require('../../models/friendRequest.model');

const userOtherProfile = async (req, res) => {

    try {

        const pageNumber = Number(req.query.page) || 1;
        const limit = 20;
        const skip = (pageNumber - 1) * limit;

        const otherId = mongoose.Types.ObjectId.createFromHexString(req.query.otherId);
        
        const user = await userModel.findOne({ _id: req.userId }).select('token');
        if (!user || user.token !== req.userToken) {
            return res.status(404).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        const otherWay = await friendRequestModel.findOne({ from: otherId, to: req.userId });

        if(!otherId || !otherWay || (pageNumber > 1 && otherWay.status !== "connected")){
            return res.status(400).json({
                success: false,
                message: "Invalid request"
            });
        }

        let posts = [];

        if(otherWay.status === "connected"){
            posts = await postModel.aggregate([
                {
                    $match: { owner: otherId }
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
                        isMine: false,
                        myCommentsCount: {
                            $size: {
                                $filter: {
                                    input: "$comments",
                                    as: "cl",
                                    cond: { $eq: ["$$cl.user", req.userId] }
                                }
                            }
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
                        myCommentsCount: 1,
                    }
                }
            ]);
        }

        if (pageNumber > 1) {
            return res.status(200).json({
                success: true,
                pageNumber,
                posts: posts
            });
        }

        const other = await userModel.aggregate([
            {
                $match: { _id: otherId }
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

        if(!other?.length){
            return res.status(400).json({
                success: false,
                message: "Invalid request"
            });
        }

        const total = await postModel.countDocuments({ owner: otherId });

        return res.status(200).json({
            success: true,
            pageNumber,
            totalPages: Math.ceil(total / limit),
            totalPosts: total,
            profile: other[0],
            request: otherWay,
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

module.exports = userOtherProfile;