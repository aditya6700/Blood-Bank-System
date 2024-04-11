const mongoose = require('mongoose');
const { changePassword } = require('../controllers/userController');

mongoose.pluralize(null)

const chatSchema = new mongoose.Schema({
    members: Array,
}, { timestamps: true });

const ChatModel = mongoose.model("Chat", chatSchema);
module.exports = ChatModel;