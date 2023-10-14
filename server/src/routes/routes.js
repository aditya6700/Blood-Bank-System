const express = require('express');
const router = express.Router();
const { register, login, auth, logout } = require('../controllers/userController');
const authenticate = require('../middleware/auth');

// user routes
router.post('/user/login', login);
router.post('/user/register', register);
router.get('/user/authenticate', authenticate, auth);
router.get('/user/logout/:id', logout);

module.exports = router;