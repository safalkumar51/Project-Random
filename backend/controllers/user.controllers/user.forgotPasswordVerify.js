const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const otpModel = require("../../models/otp.model");
const userModel = require("../../models/user.model");

const userForgotPasswordVerify = async (req, res) => {

    try {

        const { email, password, otp } = req.body;
        
        if (!password || password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain alteast 8 characters."
            });
        }

        const otpExists = await otpModel.findOne({ email });
        const userExists = await userModel.findOne({ email });

        if (!otp || !otpExists || !userExists || otpExists.expiresAt < new Date() || otpExists.otp !== otp) {
            return res.status(502).json({
                success: false,
                message: "Invalid OTP!"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        userExists.password = hashedPass;
        await userExists.save();

        await otpModel.deleteOne({ email });

        const authToken = jwt.sign({ email, id: userExists._id }, process.env.JWT_SECRET);

        userExists.token = authToken;
        await userExists.save();

        return res.status(201).json({
            success: true,
            message: "Password Updated Successfully",
            authToken
        });

    } catch (err) {
        console.log("Forgot Password Verification Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = userForgotPasswordVerify;