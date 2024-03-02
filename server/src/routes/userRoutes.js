const express = require('express');
const userRouter = express.Router();
const authenticate = require('../middleware/auth');
const { register, login, auth, logout, updateuser, changePassword, resetPassword, findUser } = require('../controllers/userController');
const adminAuth = require('../middleware/adminAuth');

// user routes
userRouter.post('/login', login);
userRouter.post('/register', register);
userRouter.get('/authenticate', authenticate, auth);
userRouter.get('/logout/:id', logout);
userRouter.post('/updateProfile', authenticate, updateuser);
userRouter.post('/changePassword', authenticate, changePassword);
userRouter.post('/resetPassword/:action', resetPassword);
userRouter.get('/find-user', adminAuth, findUser);

module.exports = userRouter;