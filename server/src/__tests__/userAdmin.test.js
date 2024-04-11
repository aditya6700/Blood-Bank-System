const { statusUpdate, getDonors, getPatients, getDonationsList, getRequestsList } = require("../controllers/userAdminController");
const RequestHistory = require("../models/requestHistoryModel");
const Users = require("../models/userModel");

describe('statusUpdate controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = { params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should update user status and return success message', async () => {
        req.params.id = 'some-id';
        req.params.status = 'active';
        const updatedUser = { _id: 'some-id', name: 'Test User', status: 'active' };
        Users.findOneAndUpdate = jest.fn().mockResolvedValue(updatedUser);
        
        await statusUpdate(req, res, next);

        expect(Users.findOneAndUpdate).toHaveBeenCalledWith({ _id: 'some-id' }, { status: 'active' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'User status updated to active'
        });
    });

    it('should return 404 if user is not found', async () => {
        req.params.id = 'invalid-id';
        req.params.status = 'active';
        Users.findOneAndUpdate = jest.fn().mockResolvedValue(null);
        
        await statusUpdate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'User not found',
            success: false
        });
    });

    it('should return 500 if an error occurs during status update', async () => {
        req.params.id = 'some-id';
        req.params.status = 'active';
        Users.findOneAndUpdate = jest.fn().mockRejectedValue(new Error('Some error'));
        
        await statusUpdate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Failed to update user status',
            error: 'Some error'
        });
    });
});


describe('getDonors controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should fetch donors list and return success message', async () => {
        const donors = [
            { _id: 'id1', name: 'Donor1', email: 'donor1@example.com', status: 'active', createdAt: new Date() },
            { _id: 'id2', name: 'Donor2', email: 'donor2@example.com', status: 'pending', createdAt: new Date() }
        ];
        Users.find = jest.fn().mockResolvedValue(donors);

        await getDonors(req, res, next);

        expect(Users.find).toHaveBeenCalledWith({ userType: 'donor' }, { _id: 1, name: 1, email: 1, status: 1, createdAt: 1 });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Donors list fetched succesfully',
            success: true,
            donors: donors
        });
    });

    it('should return 500 if an error occurs during fetch donors list', async () => {
        Users.find = jest.fn().mockRejectedValue(new Error('Some error'));

        await getDonors(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Failed to fetch donors list',
            success: false,
            error: 'Some error'
        });
    });
});


describe('getPatients controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should fetch patients list and return success message', async () => {
        const patients = [
            { _id: 'id1', name: 'Patient1', email: 'patient1@example.com', status: 'active', createdAt: new Date() },
            { _id: 'id2', name: 'Patient2', email: 'patient2@example.com', status: 'pending', createdAt: new Date() }
        ];
        Users.find = jest.fn().mockResolvedValue(patients);

        await getPatients(req, res, next);

        expect(Users.find).toHaveBeenCalledWith({ userType: 'patient' }, { _id: 1, name: 1, email: 1, status: 1, createdAt: 1 });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Patients list fetched succesfully',
            success: true,
            patients: patients
        });
    });

    it('should return 500 if an error occurs during fetch patients list', async () => {
        Users.find = jest.fn().mockRejectedValue(new Error('Some error'));

        await getPatients(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Failed to fetch patients list',
            success: false,
            error: 'Some error'
        });
    });
});

describe('getDonationsList controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should fetch donations list and return success message', async () => {
        const donationsList = [
            { _id: 'id1', user: { name: 'Donor1' }, bloodGroup: 'O+', quantity: 1, status: 'pending', disease: 'None', appointmentSlot: '2024-04-13T10:00:00.000Z' },
            { _id: 'id2', user: { name: 'Donor2' }, bloodGroup: 'A+', quantity: 2, status: 'approved', disease: 'None', appointmentSlot: '2024-04-14T10:00:00.000Z' }
        ];
        RequestHistory.find = jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(donationsList)
        });
    
        await getDonationsList(req, res, next);
    
        expect(RequestHistory.find).toHaveBeenCalledWith({ type: 'donate', userType: 'donor' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Donations list fetched succesfully',
            success: true,
            donationsList: [
                { _id: 'id1', name: 'Donor1', bloodGroup: 'O+', quantity: 1, status: 'pending', disease: 'None', appointmentSlot: '2024-04-13T10:00:00.000Z' },
                { _id: 'id2', name: 'Donor2', bloodGroup: 'A+', quantity: 2, status: 'approved', disease: 'None', appointmentSlot: '2024-04-14T10:00:00.000Z' }
            ]
        });
    });


});


describe('getRequestsList controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should fetch requests list and return success message', async () => {
        const requestsList = [
            { _id: 'id1', user: { name: 'Patient1' }, bloodGroup: 'O+', quantity: 1, status: 'pending', disease: 'None', appointmentSlot: '2024-04-13T10:00:00.000Z', userType: 'patient' },
            { _id: 'id2', user: { name: 'Patient2' }, bloodGroup: 'A+', quantity: 2, status: 'approved', disease: 'None', appointmentSlot: '2024-04-14T10:00:00.000Z', userType: 'patient' }
        ];
        RequestHistory.find = jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(requestsList)
        });

        await getRequestsList(req, res, next);

        expect(RequestHistory.find).toHaveBeenCalledWith({ type: 'request' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Requests list fetched succesfully',
            success: true,
            requestsList: [
                { _id: 'id1', name: 'Patient1', bloodGroup: 'O+', quantity: 1, status: 'pending', disease: 'None', appointmentSlot: '2024-04-13T10:00:00.000Z', userType: 'patient' },
                { _id: 'id2', name: 'Patient2', bloodGroup: 'A+', quantity: 2, status: 'approved', disease: 'None', appointmentSlot: '2024-04-14T10:00:00.000Z', userType: 'patient' }
            ]
        });
    });


});