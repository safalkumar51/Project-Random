const express = require('express');

const isLoggedIn = require('../middleware/isLoggedIn');

const upload = require('../config/multer.config');

const userSignInOtp = require('../controllers/user.controllers/user.signInOtp');
const userSignInVerify = require('../controllers/user.controllers/user.signInVerify');
const userSignUpVerify = require('../controllers/user.controllers/user.signUpVerify');
const userSignUpOtp = require('../controllers/user.controllers/user.signUpOtp');
const userForgotPasswordOtp = require('../controllers/user.controllers/user.forgotPasswordOtp');
const userForgotPasswordVerify = require('../controllers/user.controllers/user.forgotPasswordVerify');
const userHomeFeed = require('../controllers/user.controllers/user.homeFeed');
const userProfile = require('../controllers/user.controllers/user.profile');
const userSignOut = require('../controllers/user.controllers/user.signOut');
const userDelete = require('../controllers/user.controllers/user.delete');
const userEditProfile = require('../controllers/user.controllers/user.editProfile');
const userChangeProfilePhoto = require('../controllers/user.controllers/user.changeProfilePhoto');
const userChangePassword = require('../controllers/user.controllers/user.changePassword');

const router = express.Router();



router.get('/', (req,res) => {
    res.status(200).send("User Router Working");
});

router.post('/signup/otp', userSignUpOtp);
router.post('/signup/verify', userSignUpVerify);
router.post('/signin/otp', userSignInOtp);
router.post('/signin/verify', userSignInVerify);
router.post('/forgotpassword/otp', userForgotPasswordOtp);
router.post('/forgotpassword/verify', userForgotPasswordVerify);
router.get('/home', isLoggedIn , userHomeFeed);
router.get('/profile', isLoggedIn, userProfile);
router.post('/editprofile', isLoggedIn, userEditProfile);
router.post('/changeprofilephoto', isLoggedIn, upload.single("profilepic"), userChangeProfilePhoto);
router.post('/changepassword', isLoggedIn, userChangePassword);
router.post('/signout', isLoggedIn, userSignOut);
router.post('/delete', userDelete);

module.exports = router;