const fs = require('fs');

const userModel = require("../../models/user.model");
const uploadOnCloudinary = require("../../utils/cloudinary");

const userChangeProfilePhoto = async (req, res) => {
    const localFilePath = req.file?.path;

    try {

        let user = await userModel.findOne({ _id: req.userId }).select('profilepic token');
        if (!user || user.token !== req.userToken) {
            return res.status(404).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        if (!localFilePath) {
            return res.status(400).json({
                success: false,
                message: 'Profile Photo not uploaded'
            });
        }

        const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

        // Delete the temp file whether upload succeeds or fails
        await fs.promises.unlink(localFilePath).catch(err => {
            console.error('Error deleting temp file:', err);
        });

        if (!cloudinaryResponse) {
            return res.status(500).json({
                success: false,
                message: 'Cloudinary upload failed'
            });
        }
        else {
            user.profilepic = cloudinaryResponse.secure_url;
            await user.save();
        }

        return res.status(200).json({
            success: true,
            message: "Profile Photo Changed Successfully"
        });

    } catch (err) {
        console.error('User Change Profile Photo Error:', err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

module.exports = userChangeProfilePhoto;