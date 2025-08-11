const bcrypt = require('bcrypt');
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const otpModel = require('../../models/otp.model');
const adminModel = require('../../models/admin.model');

// Nodemailer config
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const adminSignUpOtp = async (req, res) => {
    try{

        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        if(!email.endsWith("@hbtu.ac.in")){
            return res.status(401).json({
                success: false,
                message: "Only college email allowed."
            });
        }
        
        if(password.length < 8){
            return res.status(400).json({
                success: false,
                message: "Password must contain alteast 8 characters."
            });
        }



        const adminExists = await adminModel.findOne({email});
        if(adminExists){
            return res.status(409).json({
                success: false,
                message: "Admin Already Exists!"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // res.json({ otp, expiresAt, name, email, password });

        let createdOtp = await otpModel.findOneAndUpdate(
            {email},
            {
                otp,
                expiresAt,
                name,
                email,
                password: hashedPass,
            },
            {upsert: true}
        );

        /* await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "Your OTP for Random Social Media App",
            text: `Your OTP is ${otp}. It expires in 5 minutes. Don't share this otp with anyone!`,
        }); */

        return res.status(201).json({
            success: true,
            message: "OTP sent",
        })

    } catch(err){
        console.log("Sign Up Verification Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

module.exports = adminSignUpOtp;