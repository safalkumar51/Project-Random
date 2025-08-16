const commentModel = require('../../models/comment.model');
const postModel = require('../../models/post.model');
const userModel = require('../../models/user.model');

const addComment = async (req, res) => {
    try {
        
        const { postId, text } = req.body;

        const user = await userModel.findOne({_id: req.userId}).select('token');
        if (!user || user.token !== req.userToken) {
            return res.status(404).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        const post = await postModel.findOne({_id: postId});

        if (!postId || !text?.trim() || !post) {
            return res.status(400).json({ success: false, message: 'Invalid Request' });
        }

        const newComment = await commentModel.create({
            user: user._id,
            post: post._id,
            text: text.trim(),
        });

        const comment = await commentModel.aggregate([
            {
                $match: { _id: newComment._id }
            },
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
                    ]
                }
            },
            {
                $addFields: {
                    commentLikesCount: 0,
                    isCommentLiked: false,
                    isCommentMine: true,
                    commentOwner: {
                        $first: '$commentOwner',
                    }
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
        ])

        return res.status(201).json({ success: true, message: 'Comment added', comment: comment[0] });

    } catch (error) {
        console.error('Error adding comment:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

const deleteComment = async (req, res) => {
    try {
        const userId = req.userId;
        const { commentId } = req.body;

        const user = await userModel.findOne({ _id: req.userId }).select('token');
        if (!user || user.token !== req.userToken) {
            return res.status(404).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        const comment = await Comment.findOne({_id: commentId})
            .select('user post')
            .populate({
                path: 'post',
                select: 'owner',
                populate: {
                    path: 'owner',
                    select: '_id'
                }
            });

        if (!commentId || !comment || (comment.user !== req.userId && comment.post.owner._id !== req.userId)) {
            return res.status(400).json({ success: false, message: 'Invalid Request' });
        }

        await commentModel.findOneAndDelete({ _id: commentId });
        
        return res.status(200).json({ success: true, message: 'Comment deleted', comment: comment });

    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { addComment, deleteComment };
