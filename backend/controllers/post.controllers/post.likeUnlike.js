const likeModel = require('../../models/like.model');
const postModel = require('../../models/post.model');
const userModel = require('../../models/user.model');

const likeUnlikePost = async (req, res) => {
    try {

        const { postId } = req.body;

        const user = await userModel.findOne({ _id: req.userId }).select('token');
        if (!user || user.token !== req.userToken) {
            return res.status(404).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        const post = await postModel.findOne({ _id: postId });

        if (!postId || !post) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Request'
            });
        }

        // Check if like document exists for user and post
        let existingLike = await likeModel.findOne({ user: req.userId, post: postId });

        if (existingLike) {
            // Unlike the post
            await likeModel.findOneAndDelete({ user: req.userId, post: postId });
            return res.status(200).json({ success: true, message: 'Post unliked' });
        } else {
            // Create new like document
            await likeModel.create({
                user: user._id,
                post: post._id,
            })

            return res.status(200).json({ success: true, message: 'Post liked' });
        }
    } catch (error) {
        console.error('Error in like/unlike post:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = likeUnlikePost;
