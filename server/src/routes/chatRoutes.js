const express = require('express');
const authenticate = require('../middleware/auth');
const { findUserChats, findChat, createChat } = require('../controllers/chatController');
const chatRouter = express.Router();

chatRouter.post("/", authenticate, createChat);
chatRouter.get("/:userId", authenticate, findUserChats);
chatRouter.get("/find/:firstId/:secondId", authenticate, findChat);

module.exports = chatRouter;