const mongoose = require('mongoose');
const postModel = require("../../models/post.model");
const userModel = require("../../models/user.model");
const adminModel = require('../../models/admin.model');

const adminGetUserProfile = async (req, res) => {
    const pageNumber = Number(req.query.page) || 1;
    const limit = 20;
    const skip = (pageNumber - 1) * limit;
    const otherId = new mongoose.Types.ObjectId(req.query.otherId);

    try {
        const admin = await adminModel.findOne({ _id: req.userId }).select('token');
        if (!admin || admin.token !== req.userToken) {
            return res.status(404).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        const other = await userModel.aggregate([
            {
                $match: { _id: otherId }
            },
            {
                $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'owner',
                    pipeline: [
                        {
                            $sort: { createdAt: -1 }
                        },
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $lookup: {
                                from: "likes",
                                localField: '_id',
                                foreignField: 'post',
                                as: "likes"
                            }
                        }, {
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
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                postpic: 1,
                                caption: 1,
                                likesCount: 1,
                                commentsCount: 1,
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
                    posts: 1
                }
            }
        ]);

        if (!otherId || !other?.length) {
            return res.status(400).json({
                success: false,
                message: "Invalid Request!"
            })
        }

        if (pageNumber === 1) {
            const total = await postModel.countDocuments({ owner: otherId });

            return res.status(200).json({
                success: true,
                pageNumber,
                totalPages: Math.ceil(total / limit),
                totalPosts: total,
                profile: other[0]
            });

        } else {
            return res.status(200).json({
                success: true,
                pageNumber,
                profile: other[0]
            });
        }

    } catch (err) {
        console.log("Admin User Profile Getter Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = adminGetUserProfile;