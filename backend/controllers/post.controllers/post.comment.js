const Comment = require('../../models/comment.model');

const addComment = async (req, res) => {
    try {
        const userId = req.userId;
        const { postId, text, parentComment } = req.body;

        if (!postId || !text) {
            return res.status(400).json({ success: false, message: 'Post ID and comment text are required' });
        }

        const newComment = new Comment({
            user: userId,
            post: postId,
            text: text.trim(),
            parentComment: parentComment || null,
            status: 'active'
        });

        await newComment.save();

        return res.status(201).json({ success: true, message: 'Comment added', comment: newComment });
    } catch (error) {
        console.error('Error adding comment:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

const deleteComment = async (req, res) => {
    try {
        const userId = req.userId;
        const { commentId } = req.params;

        if (!commentId) {
            return res.status(400).json({ success: false, message: 'Comment ID is required' });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        // Only comment owner or admin can delete
        if (comment.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete this comment' });
        }

        comment.status = 'removed';
        await comment.save();

        return res.status(200).json({ success: true, message: 'Comment deleted' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { addComment, deleteComment };
