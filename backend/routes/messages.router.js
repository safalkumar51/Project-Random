const express = require('express');

const isLoggedIn = require('../middleware/isLoggedIn');
const userModel = require('../models/user.model');
const messagesModel = require('../models/messages.model');

const router = express.Router();

router.get('/', isLoggedIn, async (req,res) => {
    const pageNumber = Number(req.query.page) || 1;
    const limit = 30;
    const skip = (pageNumber - 1) * limit;

    try{

        const user = await userModel.findOne({_id: req.userId}).select('token');
        if(!user || user.token !== req.userToken){
            return res.status(404).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        const messages = await messagesModel.find({to: req.userId})
            .select('from newMessages updatedAt')
            .sort({updatedAt: -1})
            .skip(skip) // skip >> To skip posts already sent
            .limit(limit) // limit >> To send limit posts
            .populate('from', 'name profilepic')
            .lean();
        ;

        return res.status(200).json({
            success: true,
            message: "Messages Sent Successfully!",
            messages: messages,
        })

    } catch(err){
        console.log("Messages Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

module.exports = router;