const MessageModel = require("../models/messageModel");

module.exports.createMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body;
    try {
        const messageObj = new MessageModel({ chatId, senderId, text });
        const message = await messageObj.save();
        return res.status(200).json({
            success: true,
            message: "message created",
            message: message
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'error creating message',
            error: error.message
        });
    }
}

module.exports.getMessages = async (req, res) => {
    const chatId = req.params.chatId;
    try {
        const messages = await MessageModel.find({ chatId });
        return res.status(200).json({
            success: true,
            message: "messages fetched",
            message: messages
        });
    } catch (error) {
         console.log(error);
        res.status(500).json({
            success: false,
            message: 'error finding chat message',
            error: error.message
        });
    }
}