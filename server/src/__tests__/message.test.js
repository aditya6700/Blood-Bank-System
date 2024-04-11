const { createMessage, getMessages } = require("../controllers/messageController");
const MessageModel = require("../models/messageModel");


describe('createMessage controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should create a message and return success message', async () => {
        req.body = { chatId: 'chat-id', senderId: 'sender-id', text: 'Hello' };
        const message = { _id: 'message-id', chatId: 'chat-id', senderId: 'sender-id', text: 'Hello' };
        const messageObj = { save: jest.fn().mockResolvedValue(message) };
        MessageModel.prototype.save = jest.fn().mockResolvedValue(message);

        await createMessage(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'message created',
            messages: message
        });
    });

    it('should return 500 if an error occurs during message creation', async () => {
        req.body = { chatId: 'chat-id', senderId: 'sender-id', text: 'Hello' };
        const errorMessage = 'Some error';
        MessageModel.prototype.save = jest.fn().mockRejectedValue(new Error(errorMessage));

        await createMessage(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'error creating message',
            error: errorMessage
        });
    });
});



describe('getMessages controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = { params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should fetch messages for a chat and return success message', async () => {
        req.params.chatId = 'chat-id';
        const messages = [
            { _id: 'id1', chatId: 'chat-id', senderId: 'sender-id', text: 'Message 1' },
            { _id: 'id2', chatId: 'chat-id', senderId: 'sender-id', text: 'Message 2' }
        ];
        MessageModel.find = jest.fn().mockResolvedValue(messages);

        await getMessages(req, res, next);

        expect(MessageModel.find).toHaveBeenCalledWith({ chatId: 'chat-id' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'messages fetched',
            messages: messages
        });
    });

    it('should return 500 if an error occurs during message fetching', async () => {
        req.params.chatId = 'chat-id';
        const errorMessage = 'Some error';
        MessageModel.find = jest.fn().mockRejectedValue(new Error(errorMessage));

        await getMessages(req, res, next);

        expect(MessageModel.find).toHaveBeenCalledWith({ chatId: 'chat-id' });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'error finding chat message',
            error: errorMessage
        });
    });
});