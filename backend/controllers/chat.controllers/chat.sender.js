const chatModel = require("../../models/chat.model");
const messagesModel = require("../../models/messages.model");
const userModel = require("../../models/user.model");

const chatSender = async (req, res) => {
    const { otherId, message } = req.body;

    try {

        const me = await userModel.findOne({ _id: req.userId }).select('token');
        if (!me || me.token !== req.userToken) {
            return res.status(404).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        const other = await userModel.findOne({ _id: otherId });
        if (!otherId || !other) {
            return res.status(400).json({
                success: false,
                message: "Invalid Request!"
            })
        }

        let messages = await messagesModel.findOne({ from: otherId, to: req.userId }).select('newMessages');

        if (messages) {
            const otherMessages = await messagesModel.findOne({ from: req.userId, to: otherId }).select('newMessages');

            messages.newMessages = 0;
            otherMessages.newMessages++;

            await Promise.all([messages.save(), otherMessages.save()]); // ✅ save both in parallel
        } else {
            messages = new messagesModel({
                from: req.userId,
                to: otherId,
                newMessages: 1
            });

            const otherMessages = new messagesModel({
                from: otherId,
                to: req.userId,
            });

            await Promise.all([messages.save(), otherMessages.save()]); // ✅ save both new docs in parallel
        }


        const chat = await chatModel.create({
            from: req.userId,
            to: otherId,
            message: message
        })

        const io = req.app.get('io');
        io.to(otherId).emit('receive_chat', chat);

        return res.status(200).json({
            success: true,
            message: "Chat Sender Successful",
            chat: chat
        })

    } catch (err) {
        console.log("Chat Sender Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = chatSender;