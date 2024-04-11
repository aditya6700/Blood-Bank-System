const { register, login, logout, updateuser, changePassword, resetPassword, findUser } = require("../controllers/userController");
const Users = require("../models/userModel");
const bcrypt = require('bcryptjs');

describe('register controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should return 400 if required fields are missing', async () => {
        await register(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Every field must be filled",
            success: false
        });
    });

    it('should return 400 if city is missing', async () => {
        req.body = { name: 'John', email: 'john@example.com', password: 'password', cpassword: 'password', userType: 'user', bloodGroup: 'A+' };

        await register(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Security Question is required",
            success: false
        });
    });

    it('should return 400 if password and confirm password do not match', async () => {
        req.body = { name: 'John', email: 'john@example.com', password: 'password', cpassword: 'different', userType: 'user', bloodGroup: 'A+', city: 'City' };

        await register(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "password and confirm password must be same",
            success: false
        });
    });

    it('should return 409 if user already exists with same email', async () => {
        req.body = { name: 'John', email: 'john@example.com', password: 'password', cpassword: 'password', userType: 'user', bloodGroup: 'A+', city: 'City' };
        Users.findOne = jest.fn().mockResolvedValue({});

        await register(req, res, next);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            message: 'A user already exists with same email',
            error: {},
            success: false
        });
    });

    it('should return 201 and register user if all validations pass', async () => {
        req.body = { name: 'John', email: 'john@example.com', password: 'password', cpassword: 'password', userType: 'user', bloodGroup: 'A+', city: 'City' };
        Users.findOne = jest.fn().mockResolvedValue(null);
        Users.prototype.save = jest.fn().mockResolvedValue({});

        await register(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'User registered',
            data: {},
            success: true
        });
    });

});


describe('login controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn()
        };
        next = jest.fn();
    });

    it('should return 400 if email or password is missing', async () => {
        await login(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "email and password are required",
            success: false
        });
    });

    it('should return 401 if user is not found', async () => {
        req.body = { email: 'john@example.com', password: 'password' };
        Users.findOne = jest.fn().mockResolvedValue(null);

        await login(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: "Invalid Credentials.",
            success: false
        });
    });

    it('should return 401 if password is incorrect', async () => {
        req.body = { email: 'john@example.com', password: 'password' };
        const user = { email: 'john@example.com', password: await bcrypt.hash('different', 10) };
        Users.findOne = jest.fn().mockResolvedValue(user);

        await login(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: "Invalid Credentials.",
            success: false
        });
    });

    it('should return 200 and login user if credentials are correct', async () => {
        req.body = { email: 'john@example.com', password: 'password' };
        const user = { email: 'john@example.com', password: await bcrypt.hash('password', 10), generateJsonWebToken: jest.fn().mockResolvedValue('token') };
        Users.findOne = jest.fn().mockResolvedValue(user);

        await login(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Login success",
            user,
            token: 'token',
            success: true
        });
        expect(res.cookie).toHaveBeenCalledWith('bloodToken', 'token', {
            maxAge: 3 * 60 * 60 * 1000, // 3 hours
            httpOnly: true
        });
    });

    it('should return 500 if an error occurs during login', async () => {
        req.body = { email: 'john@example.com', password: 'password' };
        Users.findOne = jest.fn().mockRejectedValue(new Error('Some error'));

        await login(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'unknown error',
            success: false,
            error: 'Some error'
        });
    });
});


describe('logout controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = { params: {}, body: {} };
        res = {
            clearCookie: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should clear the token and return success message', async () => {
        req.params.id = 'some-id';
        const user = { _id: 'some-id', tokens: ['token1', 'token2'] };
        Users.findOneAndUpdate = jest.fn().mockResolvedValue(user);

        await logout(req, res, next);

        expect(Users.findOneAndUpdate).toHaveBeenCalledWith({ _id: 'some-id' }, { tokens: [] });
        expect(res.clearCookie).toHaveBeenCalledWith('bloodToken', { path: '/' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'user logged out',
            success: true
        });
    });

    it('should return 500 if an error occurs during logout', async () => {
        req.params.id = 'some-id';
        Users.findOneAndUpdate = jest.fn().mockRejectedValue(new Error('Some error'));

        await logout(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Logout failed!!',
            success: false,
            error: 'Some error'
        });
    });
});


describe('updateuser controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should update the user profile and return success message', async () => {
        req.body = { _id: 'some-id', name: 'New Name', email: 'new@example.com', phone: '1234567890' };
        const updatedUser = { _id: 'some-id', name: 'New Name', email: 'new@example.com', phone: '1234567890' };
        Users.findOneAndUpdate = jest.fn().mockResolvedValue(updatedUser);

        await updateuser(req, res, next);

        expect(Users.findOneAndUpdate).toHaveBeenCalledWith({ _id: 'some-id' }, { name: 'New Name', email: 'new@example.com', phone: '1234567890' }, { new: true });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'profile updated',
            updatedUser,
            success: true
        });
    });

    it('should return 500 if an error occurs during update', async () => {
        req.body = { _id: 'some-id', name: 'New Name', email: 'new@example.com', phone: '1234567890' };
        Users.findOneAndUpdate = jest.fn().mockRejectedValue(new Error('Some error'));

        await updateuser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Failed to update',
            success: false,
            error: 'Some error'
        });
    });
});



describe('changePassword controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should return 401 if existing password is wrong', async () => {
        req.body = { _id: 'some-id', oldPassword: 'wrong-password', newPassword: 'new-password' };
        const existingUser = { _id: 'some-id', password: await bcrypt.hash('password', 10) };
        Users.findOne = jest.fn().mockResolvedValue(existingUser);

        await changePassword(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Existiting password is wrong.',
            success: false,
        });
    });

    it('should change the password and return success message', async () => {
        req.body = { _id: 'some-id', oldPassword: 'password', newPassword: 'new-password' };
        const existingUser = { _id: 'some-id', password: await bcrypt.hash('password', 10) };
        Users.findOne = jest.fn().mockResolvedValue(existingUser);
        Users.findOneAndUpdate = jest.fn().mockResolvedValue(existingUser);

        await changePassword(req, res, next);

        expect(Users.findOneAndUpdate).toHaveBeenCalledWith({ _id: 'some-id' }, { password: expect.any(String), cpassword: expect.any(String) });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'password changed successfully',
            success: true
        });
    });

    it('should return 500 if an error occurs during password change', async () => {
        req.body = { _id: 'some-id', oldPassword: 'password', newPassword: 'new-password' };
        Users.findOne = jest.fn().mockRejectedValue(new Error('Some error'));

        await changePassword(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'password change failed',
            success: false,
            error: 'Some error'
        });
    });
});

describe('resetPassword controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {}, params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should verify email and return success message', async () => {
        req.params.action = 'email';
        req.body = { email: 'test@example.com' };
        const validUser = { _id: 'some-id', email: 'test@example.com', city: 'City' };
        Users.findOne = jest.fn().mockResolvedValue(validUser);
        
        await resetPassword(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'email verified',
            validUser,
            success: true
        });
    });

    it('should change password and return success message', async () => {
        req.params.action = 'password';
        req.body = { _id: 'some-id', password: 'new-password' };
        Users.findOneAndUpdate = jest.fn().mockResolvedValue({});

        await resetPassword(req, res, next);

        expect(Users.findOneAndUpdate).toHaveBeenCalledWith({ _id: 'some-id' }, { password: expect.any(String), cpassword: expect.any(String) }, { new: true });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'password changed',
            validUser: {},
            success: true
        });
    });

    it('should return 500 if an error occurs during reset password', async () => {
        req.params.action = 'password';
        req.body = { _id: 'some-id', password: 'new-password' };
        Users.findOneAndUpdate = jest.fn().mockRejectedValue(new Error('Some error'));

        await resetPassword(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'reset password failed',
            success: false,
            error: 'Some error'
        });
    });
});

describe('findUser controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = { query: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should find user by id and return success message', async () => {
        req.query.id = 'some-id';
        const user = { _id: 'some-id', name: 'Test User', email: 'test@example.com' };
        Users.findOne = jest.fn().mockResolvedValue(user);
        
        await findUser(req, res, next);

        expect(Users.findOne).toHaveBeenCalledWith({ _id: 'some-id' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'fetched user details',
            user: user
        });
    });

    it('should find all users and return success message', async () => {
        const users = [
            { _id: 'id1', name: 'User1', email: 'user1@example.com' },
            { _id: 'id2', name: 'User2', email: 'user2@example.com' }
        ];
        Users.find = jest.fn().mockResolvedValue(users);

        await findUser(req, res, next);

        expect(Users.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'fetched user details',
            user: users
        });
    });

    it('should return 500 if an error occurs during find user', async () => {
        req.query.id = 'some-id';
        Users.findOne = jest.fn().mockRejectedValue(new Error('Some error'));

        await findUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Failed to query users',
            error: 'Some error'
        });
    });
});