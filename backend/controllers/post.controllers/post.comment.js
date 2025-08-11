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

        return res.status(201).json({ success: true, message: 'Comment added', comment: newComment });

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

        const comment = await Comment.findById(commentId);

        if (!commentId || !comment) {
            return res.status(400).json({ success: false, message: 'Invalid Request' });
        }

        // Only comment owner or admin can delete
        if (comment.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete this comment' });
        }

        await comment.delete();

        return res.status(200).json({ success: true, message: 'Comment deleted' });

    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { addComment, deleteComment };
