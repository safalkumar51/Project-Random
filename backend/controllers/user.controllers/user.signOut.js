const userModel = require("../../models/user.model")

const userSignOut = async (req, res) => {
    
    try{

        const user = await userModel.findOne({ _id: req.userId });

        if (!user || user.token !== req.userToken) {
            return res.status(404).json({
                success: false,
                message: "Invalid Request"
            })
        }

        user.token = "";
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User Successfully Signed Out"
        })

    } catch(err){
        console.log("User Sign Out Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = userSignOut;