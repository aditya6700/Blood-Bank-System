const { getStock } = require("../controllers/inventoryController");
const Inventory = require("../models/inventoryModel");
const { addStock, subtractStock } = require("../utils/inventoryOperations");


describe('addStock method', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should increment quantity if document exists in database', async () => {
        const existingInventory = { bloodGroup: 'A+', quantity: 0 };
        const updatedInventory = { bloodGroup: 'A+', quantity: 0 };

        Inventory.findOneAndUpdate = jest.fn().mockResolvedValue(existingInventory)
      

        const result = await addStock('A+', 0);

        expect(Inventory.findOneAndUpdate).toHaveBeenCalledTimes(1);
        expect(Inventory.findOneAndUpdate).toHaveBeenCalledWith(
            { bloodGroup: 'A+' },
            { $inc: { quantity: 0 } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        expect(result).toEqual(updatedInventory);
    });


    it('should throw an error if the operation fails', async () => {
        const errorMessage = 'Failed to update inventory';

        Inventory.findOneAndUpdate = jest.fn().mockRejectedValue(new Error(errorMessage));

        await expect(addStock('A+', 5)).rejects.toThrow(errorMessage);

        expect(Inventory.findOneAndUpdate).toHaveBeenCalledTimes(1);
        expect(Inventory.findOneAndUpdate).toHaveBeenCalledWith(
            { bloodGroup: 'A+' },
            { $inc: { quantity: 5 } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
    });
});


describe('subtractStock method', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should decrement quantity if document exists in database and quantity is available', async () => {
        const existingInventory = { bloodGroup: 'A+', quantity: 10 };
        const updatedInventory = { bloodGroup: 'A+', quantity: 5 };

        Inventory.findOne = jest.fn().mockResolvedValue(existingInventory);
        Inventory.findOneAndUpdate = jest.fn().mockResolvedValue(updatedInventory);

        const result = await subtractStock('A+', 5);

        expect(Inventory.findOne).toHaveBeenCalledWith({ bloodGroup: 'A+' });
        expect(Inventory.findOneAndUpdate).toHaveBeenCalledWith(
            { bloodGroup: 'A+' },
            { $inc: { quantity: -5 } },
            { new: true }
        );
        expect(result).toEqual(updatedInventory);
    });

    it('should throw an error if document exists but quantity is not available', async () => {
        const existingInventory = { bloodGroup: 'A+', quantity: 3 };

        Inventory.findOne = jest.fn().mockResolvedValue(existingInventory);

        await expect(subtractStock('A+', 5)).rejects.toThrow(
            'Requested 5 units are not available'
        );

        expect(Inventory.findOne).toHaveBeenCalledWith({ bloodGroup: 'A+' });
    });

    it('should throw an error if the document does not exist', async () => {
        Inventory.findOne = jest.fn().mockResolvedValue(null);

        await expect(subtractStock('A+', 5)).rejects.toThrow(
            'Requested 5 units are not available'
        );

        expect(Inventory.findOne).toHaveBeenCalledWith({ bloodGroup: 'A+' });
    });

    it('should throw an error if the operation fails', async () => {
        const errorMessage = 'Failed to update inventory';

        Inventory.findOne = jest.fn().mockResolvedValue({ bloodGroup: 'A+', quantity: 10 });
        Inventory.findOneAndUpdate = jest.fn().mockRejectedValue(new Error(errorMessage));

        await expect(subtractStock('A+', 5)).rejects.toThrow(errorMessage);

        expect(Inventory.findOne).toHaveBeenCalledWith({ bloodGroup: 'A+' });
        expect(Inventory.findOneAndUpdate).toHaveBeenCalledWith(
            { bloodGroup: 'A+' },
            { $inc: { quantity: -5 } },
            { new: true }
        );
    });
});


describe('getStock method', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch stock details for a specific blood group if group is provided', async () => {
        const bloodGroup = 'A+';
        const inventory = { bloodGroup, quantity: 10 };

        Inventory.findOne = jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(inventory)
        })

        const req = { query: { group: bloodGroup } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getStock(req, res);

        expect(Inventory.findOne).toHaveBeenCalledWith({ bloodGroup });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Fetched stock details from Inventory',
            success: true,
            inventory: inventory
        });
    });

    it('should fetch all stock details if group is not provided', async () => {
        const inventory = [
            { bloodGroup: 'A+', quantity: 10 },
            { bloodGroup: 'B+', quantity: 5 }
        ];

        Inventory.find = jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(inventory)
        })

        const req = { query: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getStock(req, res);

        expect(Inventory.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Fetched stock details from Inventory',
            success: true,
            inventory
        });
    });

    it('should return 400 if an invalid blood group is provided', async () => {
        const invalidGroup = 'Z';
        const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-" ];

        const req = { query: { group: invalidGroup } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getStock(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: `Blood groups allowed are ${bloodGroups}`,
            success: false
        });
    });

});