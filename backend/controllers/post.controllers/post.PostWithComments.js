const mongoose = require('mongoose');
const postModel = require('../../models/post.model');
const userModel = require('../../models/user.model');
const commentModel = require('../../models/comment.model');

const getPostWithComments = async (req, res) => {
    try {
        const postId = mongoose.Types.ObjectId.createFromHexString(req.query.postId);
        const pageNumber = Number(req.query.page) || 1;
        const limit = 30;
        const skip = (pageNumber - 1) * limit;

        const user = await userModel.findOne({ _id: req.userId }).select('token');
        if (!user || user.token !== req.userToken) {
            return res.status(404).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        const comments = await commentModel.aggregate([
            {
                $match: { post: postId }
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'commentOwner',
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
                    from: "commentlikes",
                    localField: '_id',
                    foreignField: 'comment',
                    as: "commentlikes"
                }
            },
            {
                $addFields: {
                    commentOwner: {
                        $first: '$commentOwner',
                    }
                }
            },
            {
                $addFields: {
                    commentLikesCount: { $size: "$commentlikes" },
                    isCommentLiked: {
                        $in: [
                            user._id,
                            { $map: { input: "$commentlikes", as: "cl", in: "$$cl.user" } }
                        ]
                    },
                    isCommentMine: {
                        $eq: ["$commentOwner._id", user._id]
                    },
                }
            },
            {
                $project: {
                    _id: 1,
                    text: 1,
                    commentOwner: 1,
                    createdAt: 1,
                    isCommentMine: 1,
                    isCommentLiked: 1,
                    commentLikesCount: 1
                }
            }
        ]);

        if(pageNumber > 1){
            return res.status(200).json({
                success: true,
                comments: comments
            });
        }

        const post = await postModel.aggregate([
            {
                $match: { _id: postId }
            },
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
                    ],
                },
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
                                    user._id,
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
                                    user._id,
                                    { $map: { input: "$comments", as: "comment", in: "$$comment.user" } }
                                ]
                            },
                            then: true,
                            else: false
                        }
                    },
                    isMine: {
                        $cond: {
                            if: { $eq: ["$owner._id", user._id] },
                            then: true,
                            else: false
                        }
                    },
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

        if (!postId || !post?.length) {
            return res.status(400).json({ success: false, message: 'Invalid Request' });
        }

        const total = await commentModel.countDocuments({ post: postId });

        return res.status(200).json({
            success: true,
            pageNumber,
            totalPages: Math.ceil(total / limit),
            totalPosts: total,
            post: post[0],
            comments: comments
        });

    } catch (error) {
        console.error('Error fetching post with comments:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = getPostWithComments;
