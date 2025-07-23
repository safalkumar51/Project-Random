const userModel = require("../../models/user.model");
const chatModel = require("../../models/chat.model");
const messagesModel = require("../../models/messages.model");

const chatGetter = async (req, res) => {
    const otherId = req.query.otherId;
    const pageNumber = Number(req.query.page) || 1;
    const limit = 50;
    const skip = (pageNumber - 1) * limit;

    try{

        const me = await userModel.findOne({_id: req.userId}).select('token');
        if(!me || me.token !== req.userToken){
            return res.status(404).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        const other = await userModel.findOne({_id: otherId});
        if(!otherId || !other){
            return res.status(400).json({
                success: false,
                message: "Invalid Request!"
            })
        }

        const messages = await messagesModel.findOne({from: otherId, to: req.userId}).select('newMessages');

        if(messages){
            messages.newMessages = 0;
            await messages.save();

            const chats = await chatModel.find({
                $or: [
                    { from: req.userId, to: otherId },
                    { from: otherId, to: req.userId }
                ]
            })
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit)
            .lean();

            return res.status(200).json({
                success: true,
                message: "Chat Getter Successful",
                chats: chats
            })

        } else{
            return res.status(200).json({
                success: true,
                message: "Chat Getter Successful",
                chats: []
            })
        }      

    } catch(err){
        console.log("Chat Getter Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = chatGetter;