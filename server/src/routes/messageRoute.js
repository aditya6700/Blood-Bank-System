const express = require('express');
const { createMessage, getMessages } = require('../controllers/messageController');
const authenticate = require('../middleware/auth');
const messageRouter = express.Router();

messageRouter.post('/', authenticate, createMessage);
messageRouter.get("/:chatId", authenticate, getMessages);

module.exports = messageRouter;