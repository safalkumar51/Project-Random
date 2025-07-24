const postModel = require('../../models/post.model');
const userModel = require('../../models/user.model');

const getUserProfileByPost = async (req, res) => {
    
    try {
        const {postId} = req.body;
        if (!postId) {
            return res.status(400).json({ success: false, message: 'Post ID is required' });
        }
        console.log(postId);

        // Find the post and populate the owner field
        const post = await postModel.findOne({_id: postId}).populate('owner', 'name email bio profilepic dob');
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const owner = post.owner;
        if (!owner) {
            return res.status(404).json({ success: false, message: 'Owner not found' });
        }

        // Return the owner's profile data
        return res.status(200).json({
            success: true,
            profile: owner
        });
    } catch (error) {
        console.error('Error fetching user profile by post:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {getUserProfileByPost};
