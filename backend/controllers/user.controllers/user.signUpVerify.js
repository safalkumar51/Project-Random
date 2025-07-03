const jwt = require('jsonwebtoken');

const otpModel = require("../../models/otp.model");
const userModel = require("../../models/user.model");

const userSignUpVerify = async (req, res) => {
    try{

        const { email, otp } = req.body;

        const otpExists = await otpModel.findOne({ email });

        if (!otp || !otpExists || otpExists.expiresAt < new Date() || otpExists.otp !== otp) {
            return res.status(502).json({
                success: false,
                message: "Invalid OTP!"
            });
        }

        let createdUser = await userModel.create({
            name: otpExists.name,
            email: otpExists.email,
            password: otpExists.password
        });

        await otpModel.deleteOne({ email });

        const authToken = jwt.sign({ email, id: createdUser._id }, process.env.JWT_SECRET);

        return res.status(202).json({
            success: true,
            message: "User Registered",
            authToken
        });

    } catch(err){
        console.log("Sign Up Registration Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = userSignUpVerify;