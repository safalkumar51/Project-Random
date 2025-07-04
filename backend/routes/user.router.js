const express = require('express');

const userSignInOtp = require('../controllers/user.controllers/user.signInOtp');
const userSignInVerify = require('../controllers/user.controllers/user.signInVerify');
const userSignUpVerify = require('../controllers/user.controllers/user.signUpVerify');
const userSignUpOtp = require('../controllers/user.controllers/user.signUpOtp');
const userForgotPasswordOtp = require('../controllers/user.controllers/user.forgotPasswordOtp');
const userForgotPasswordVerify = require('../controllers/user.controllers/user.forgotPasswordVerify');

const router = express.Router();



router.get('/', (req,res) => {
    res.status(200).send("working");
});

router.post('/signup/otp', userSignUpOtp);
router.post('/signup/verify', userSignUpVerify);
router.post('/signin/otp', userSignInOtp);
router.post('/signin/verify', userSignInVerify);
router.post('/forgotpassword/otp', userForgotPasswordOtp);
router.post('/forgotpassword/verify', userForgotPasswordVerify);

module.exports = router;