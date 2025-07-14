const postModel = require('../../models/post.model');
const commentModel = require('../../models/comment.model');

const getPostWithComments = async (req, res) => {
    try {
        const { postId } = req.body;
        if (!postId) {
            return res.status(400).json({ success: false, message: 'Post ID is required' });
        }

        // Find the post and populate the owner field
        const post = await postModel.findOne({ _id: postId }).populate('owner', 'name email bio profilepic dob');
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Find comments for the post and populate the user field
        const comments = await commentModel.find({ post: postId })
            .populate('user', 'name email profilepic')
            .sort({ createdAt: 1 }); // sort by oldest first

        return res.status(200).json({
            success: true,
            post,
            comments
        });
    } catch (error) {
        console.error('Error fetching post with comments:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { getPostWithComments };
