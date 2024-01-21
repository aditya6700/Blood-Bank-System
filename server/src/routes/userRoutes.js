const express = require('express');
const userRouter = express.Router();
const authenticate = require('../middleware/auth');
const { register, login, auth, logout, updateuser, changePassword, resetPassword } = require('../controllers/userController');

// user routes
userRouter.post('/login', login);
userRouter.post('/register', register);
userRouter.get('/authenticate', authenticate, auth);
userRouter.get('/logout/:id', logout);
userRouter.post('/updateProfile', authenticate, updateuser);
userRouter.post('/changePassword', authenticate, changePassword);
userRouter.post('/resetPassword/:action', resetPassword);

module.exports = userRouter;