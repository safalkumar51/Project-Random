const commentModel = require('../../models/comment.model');
const commentlikeModel = require('../../models/commentlike.model');
const userModel = require('../../models/user.model');

const likeUnlikeComment = async (req, res) => {
    try {
        const { commentId } = req.body;

        const user = await userModel.findOne({ _id: req.userId }).select('token');
        if (!user || user.token !== req.userToken) {
            return res.status(404).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        const comment = await commentModel.findOne({ _id: commentId });

        if (!commentId || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Request'
            });
        }

        // Check if like document exists for user and post
        let existingLike = await commentlikeModel.findOne({ user: req.userId, comment: commentId });

        if (existingLike) {
            // Unlike the post
            await commentlikeModel.findOneAndDelete({ user: req.userId, comment: commentId });
            return res.status(200).json({ success: true, message: 'Comment unliked' });
        } else {
            // Create new like document
            await commentlikeModel.create({
                user: user._id,
                comment: comment._id,
            })

            return res.status(200).json({ success: true, message: 'comment liked' });
        }
    } catch (error) {
        console.error('Error in like/unlike comment:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = likeUnlikeComment;
