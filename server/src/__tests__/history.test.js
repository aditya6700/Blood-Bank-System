const { donorRequest, patientRequest, getSlots } = require("../controllers/historyController");
const RequestHistory = require("../models/requestHistoryModel");

describe('donorRequest method', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new request history record for a valid request', async () => {
        const requestBody = {
            bloodGroup: 'A+',
            quantity: 2,
            userId: 'user_id',
            disease: 'some disease',
            appointmentSlot: '2022-05-01T08:00:00.000Z'
        };
        const type = 'donate';
        const saveMock = jest.fn().mockResolvedValue({
            _id: 'request_id',
            bloodGroup: requestBody.bloodGroup,
            quantity: requestBody.quantity,
            type,
            disease: requestBody.disease,
            status: 'pending',
            user: requestBody.userId,
            userType: 'donor',
            appointmentSlot: requestBody.appointmentSlot,
            populate: jest.fn().mockResolvedValue({ user: { name: 'John Doe' } }) // Mock populate method
        });

        RequestHistory.prototype.save = saveMock;

        const req = {
            body: requestBody,
            params: { type }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await donorRequest(req, res);

        expect(saveMock).toHaveBeenCalledTimes(1);
        expect(saveMock).toHaveBeenCalledWith();
        expect(res.status).toHaveBeenCalledWith(201); // Corrected assertion
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Requested created successfully',
            result: 'request_id'
        });
    });

    it('should return 400 for an invalid request type', async () => {
        const requestBody = {
            bloodGroup: 'A+',
            quantity: 2,
            userId: 'user_id',
            disease: 'some disease',
            appointmentSlot: '2022-05-01T08:00:00.000Z'
        };
        const type = 'invalid_type';

        const req = {
            body: requestBody,
            params: { type }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await donorRequest(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: `Invalid request = ${type}`
        });
    });

});

describe('patientRequest', () => {
    describe('valid requests', () => {
        it('should create a new request history record for a valid patient request', async () => {
            const requestBody = {
                bloodGroup: 'A+',
                quantity: 2,
                userId: 'user_id',
                disease: 'some disease',
                appointmentSlot: '2022-05-01T08:00:00.000Z'
            };

            const saveMock = jest.fn().mockResolvedValue({
                _id: 'request_id',
                bloodGroup: requestBody.bloodGroup,
                quantity: requestBody.quantity,
                type: 'request',
                disease: requestBody.disease,
                status: 'pending',
                user: requestBody.userId,
                userType: 'patient',
                appointmentSlot: requestBody.appointmentSlot,
                populate: jest.fn().mockResolvedValue({ user: { name: 'John Doe' } }) // Mock populate method
            });

            RequestHistory.prototype.save = saveMock;

            const req = {
                body: requestBody
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await patientRequest(req, res);

            expect(saveMock).toHaveBeenCalledTimes(1);
            expect(saveMock).toHaveBeenCalledWith();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Requested created successfully',
                result: 'request_id'
            });
        });
    });

    describe('invalid requests', () => {
        it('should return 400 for invalid blood group', async () => {
            const requestBody = {
                bloodGroup: 'Invalid',
                quantity: 2,
                userId: 'user_id',
                disease: 'some disease',
                appointmentSlot: '2022-05-01T08:00:00.000Z'
            };

            const req = {
                body: requestBody
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await patientRequest(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Invalid blood group Invalid'
            });
        });
    });

});

describe('getSlots', () => {
    it('should return available slots for donation', async () => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const threeDaysLater = new Date(currentDate);
        threeDaysLater.setDate(currentDate.getDate() + 3);

        const slots = [
            { appointmentSlot: currentDate },
            { appointmentSlot: threeDaysLater }
        ];

        const findMock = jest.spyOn(RequestHistory, 'find').mockResolvedValue(slots);

        const req = { query: { type: 'donate' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getSlots(req, res);

        expect(findMock).toHaveBeenCalledTimes(1);
        expect(findMock).toHaveBeenCalledWith(
            { type: 'donate', status: 'pending', appointmentSlot: { $gte: currentDate, $lt: threeDaysLater } },
            { appointmentSlot: 1 }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            bookedSlots: slots,
            message: 'successfully fetched available slots'
        });
    });

    it('should return 404 for invalid slot type', async () => {
        const req = { query: { type: 'invalid' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getSlots(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'invalid type for fetching slots: invalid'
        });
    });

});