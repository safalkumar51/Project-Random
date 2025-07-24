const bcrypt = require('bcrypt'); 
const userModel = require("../../models/user.model");

const userChangePassword = async (req,res) => {
    const { oldPassword, newPassword } = req.body;

    try{

        const user = await userModel.findOne({_id: req.userId}).select('password token');
        if(!user || user.token !== req.userToken){
            return res.status(404).json({
                success: false,
                message: "Log In Required!",
            })
        }

        if(!oldPassword || !newPassword){
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        if(newPassword.length < 8){
            return res.status(400).json({
                success: false,
                message: "Password must contain alteast 8 characters."
            });
        }

        bcrypt.compare(oldPassword, user.password, async (err, result) => {
            if(err){
                return res.status(500).json({
                    success: false,
                    message: "Internal server error while verifying password.",
                    error: err.message
                });
            }

            if(result){
                const salt = await bcrypt.genSalt(10);
                const hashedPass = await bcrypt.hash(newPassword, salt);

                user.password = hashedPass;
                await user.save();

                return res.status(200).json({
                    success: true,
                    message: "Password Changed Successfully!"
                })

            } else{
                return res.status(409).json({
                    success: false,
                    message: "Existing Password didn't match!"
                })
            }
        })

    } catch(err){
        console.log("User Change Password Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = userChangePassword;