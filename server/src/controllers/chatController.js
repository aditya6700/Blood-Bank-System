const ChatModel = require("../models/chatModel");

module.exports.createChat = async (req,res) => {
    const { firstId, secondId } = req.body;
    try {
        const existingChat = await ChatModel.findOne({
            members: { $all: [firstId, secondId] }
        });
        
        if (existingChat) {
            return res.status(409).json({
                success: true,
                message: "chat already exists",
                chat: existingChat
            });
        }

        const newChatObj = new ChatModel({ members: [firstId, secondId] });
        const newChat = await newChatObj.save();

        res.status(201).json({
            success: true,
            message: "new chat created",
            chat: newChat
        })
    }
    catch (error) {
        // console.log(error);
        res.status(500).json({
            success: false,
            message: 'error creating chat',
            error: error.message
        });
    }
}

module.exports.findUserChats = async (req, res) => {
    const userId = req.params.userId;
    try {
        const userChats = await ChatModel.find({ members: { $in: [userId] } });
        return res.status(200).json({
            success: true,
            message: "user chats fetched",
            chat: userChats
        });
    }
    catch (error) {
        // console.log(error);
        res.status(500).json({
            success: false,
            message: 'failed to fetch user chat',
            error: error.message
        });
    }
};


module.exports.findChat = async (req, res) => {
    const { firstId, secondId } = req.params;
    try {
        const chats = await ChatModel.findOne({ members: { $all: [firstId, secondId] } });
        return res.status(200).json({
            success: true,
            message: "user chats fetched",
            chat: chats
        });
    }
    catch (error) {
        // console.log(error);
        res.status(500).json({
            success: false,
            message: 'failed to fetch chats',
            error: error.message
        });
    }
};