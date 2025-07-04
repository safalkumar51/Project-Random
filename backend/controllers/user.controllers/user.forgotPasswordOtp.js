const bcrypt = require('bcrypt');
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const otpModel = require('../../models/otp.model');
const userModel = require('../../models/user.model');

// Nodemailer config
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const userForgotPasswordOtp = async (req, res) => {
    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        if (!email.endsWith("@hbtu.ac.in")) {
            return res.status(401).json({
                success: false,
                message: "Only college email allowed."
            });
        }

        const userExists = await userModel.findOne({ email });
        if (!userExists) {
            return res.status(400).json({
                success: false,
                message: "User doesn't exists!"
            });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        await otpModel.findOneAndUpdate(
            { email },
            { otp, expiresAt, email },
            { upsert: true }
        );

        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "Your OTP for Random Social Media App",
            text: `Your OTP is ${otp}. It expires in 5 minutes. Don't share this OTP with anyone!`,
        });

        return res.status(201).json({
            success: true,
            message: "OTP sent",
        });


    } catch (err) {
        console.log("Forgot Password OTP Generation Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = userForgotPasswordOtp;