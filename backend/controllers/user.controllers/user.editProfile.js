const userModel = require("../../models/user.model");

const userEditProfile = async (req,res) => {
    const { name, bio } = req.body;

    try{

        let user = await userModel.findOne({_id: req.userId})
            .select('name bio token');

        if(!user || req.userToken !== user.token){
            return res.status(404).json({
                success: false,
                message: "Log In Required!"
            })
        }

        if(!name){
            return res.status(400).json({
                success: false,
                message: "Name field is required!"
            })
        }

        user.name = name;
        user.bio = bio;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile Edited Successfully",
            name: user.name,
            bio: user.bio
        })

    } catch(err){
        console.log("User Profile Edit Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = userEditProfile;