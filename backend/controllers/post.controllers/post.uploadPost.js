const fs = require('fs');
const path = require('path');

const postModel = require('../../models/post.model');
const userModel = require('../../models/user.model');
const uploadOnCloudinary = require('../../utils/cloudinary');

const uploadPost = async (req, res) => {

    try{

        const { caption } = req.body;
        const userId = req.userId;
        const localFilePath = req.file?.path;

        if(!caption && !localFilePath){
            return res.status(400).json({
                success: false,
                message: 'Post not uploaded'
            });
        }

        // get current user, select ignores fields other than posts
        let user = await userModel.findOne({ _id: userId }).select('posts token');
        if (!user || user.token !== req.userToken) {
            return res.status(404).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        let createdPost = await postModel.create({
            owner: req.userId
        });

        if(caption){
            createdPost.caption = caption;
            await createdPost.save();
        }

        if(localFilePath){
            const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

            // Delete the temp file whether upload succeeds or fails
            await fs.promises.unlink(localFilePath).catch(err => {
                console.error('Error deleting temp file:', err);
            });

            if (!cloudinaryResponse) {
                await postModel.findOneAndDelete( {_id: createdPost._id} );
                return res.status(500).json({
                    success: false,
                    message: 'Cloudinary upload failed'
                });
            }
            else{
                createdPost.postpic = cloudinaryResponse.secure_url;
                await createdPost.save();
            }
        }

        user.posts.push(createdPost._id);
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Post uploaded successfully'
        });

    } catch(err){
        console.error('Upload Post Error:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }

}

module.exports = uploadPost;