const likeModel = require('../../models/like.model');
const postModel = require('../../models/post.model');
const userModel = require('../../models/user.model');

const postDelete = async (req, res) => {
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

        if (!postId || !post || post.user !== req.userId) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Request'
            });
        }

        await Promise.all([
            likeModel.deleteMany({ post: post._id }),
            commentModel.deleteMany({ post: post._id }),
            postModel.deleteOne({ _id: post._id })
        ]);

        return res.status(200).json({
            success: true,
            message: "Post Deleted Successfully",
            post: post
        })
        
    } catch (error) {
        console.error('Post Delete Error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = postDelete;
