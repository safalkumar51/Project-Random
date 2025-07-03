const express = require('express');
const userSignInOtp = require('../controllers/user.controllers/user.signInOtp');
const userSignInVerify = require('../controllers/user.controllers/user.signInVerify');
const userSignUpVerify = require('../controllers/user.controllers/user.signUpVerify');
const userSignUpOtp = require('../controllers/user.controllers/user.signUpOtp');
const router = express.Router();



router.get('/', (req,res) => {
    res.status(200).send("working");
});

router.post('/signUpOtp', userSignUpOtp);
router.post('/signUpVerify', userSignUpVerify);
router.post('/signInOtp', userSignInOtp);
router.post('/signInVerify', userSignInVerify);

module.exports = router;