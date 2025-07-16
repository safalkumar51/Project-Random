const Like = require('../../models/like.model');

const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.userId;
        const { postId } = req.body;

        if (!postId) {
            return res.status(400).json({ success: false, message: 'Post ID is required' });
        }

        // Check if like document exists for user and post
        let existingLike = await Like.findOne({ user: userId, post: postId });

        if (existingLike) {
            if (existingLike.status === 'active') {
                // Unlike the post (soft delete)
                existingLike.status = 'removed';
                await existingLike.save();
                return res.status(200).json({ success: true, message: 'Post unliked' });
            } else {
                // Reactivate the like
                existingLike.status = 'active';
                existingLike.timestamp = Date.now();
                await existingLike.save();
                return res.status(200).json({ success: true, message: 'Post liked' });
            }
        } else {
            // Create new like document
            const newLike = new Like({
                user: userId,
                post: postId,
                type: 'like', // fixed type as per user request
                status: 'active',
                timestamp: Date.now()
            });
            await newLike.save();
            return res.status(200).json({ success: true, message: 'Post liked' });
        }
    } catch (error) {
        console.error('Error in like/unlike post:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { likeUnlikePost };
