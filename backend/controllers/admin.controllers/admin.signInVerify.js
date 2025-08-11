const jwt = require('jsonwebtoken');

const otpModel = require("../../models/otp.model");
const adminModel = require('../../models/admin.model');

const adminSignInVerify = async (req, res) => {

    try {

        const { email, otp } = req.body;

        const otpExists = await otpModel.findOne({ email });
        const adminExists = await adminModel.findOne({ email });

        if (!otp || !otpExists || !adminExists || otpExists.expiresAt < new Date() || otpExists.otp !== otp) {
            return res.status(502).json({
                success: false,
                message: "Invalid OTP!"
            });
        }

        await otpModel.deleteOne({ email });

        const authToken = jwt.sign({ email, id: userExists._id }, process.env.JWT_SECRET);

        adminExists.token = authToken;
        await adminExists.save();

        return res.status(201).json({
            success: true,
            message: "Admin Verified",
            authToken
        });

    } catch (err) {
        console.log("Sign In Verification Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = adminSignInVerify;