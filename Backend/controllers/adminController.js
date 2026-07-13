const Admin = require('../models/Admin');
const User = require('../models/User');
const Seller = require('../models/Seller');
const Book = require('../models/Book');
const Order = require('../models/Order');

// Admin Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Admin.findOne({ email });
        if (user) {
            if (user.password === password) {
                return res.json({ 
                    Status: "Success", 
                    user: { id: user.id, name: user.name, email: user.email } 
                });
            } else {
                return res.json("login fail");
            }
        } else {
            return res.json("no user");
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Admin Register
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existing = await Admin.findOne({ email });
        if (existing) {
            return res.json("Already have an account");
        } else {
            await Admin.create({ email, name, password });
            return res.json("  Account Created");
        }
    } catch (err) {
        return res.json("failed ");
    }
};

// Get All Users
exports.getUsers = async (req, res) => {
    try {
        const usersList = await User.find();
        return res.status(200).json(usersList);
    } catch (err) {
        return res.sendStatus(500);
    }
};

// Delete a User
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a User Order
exports.deleteUserOrder = async (req, res) => {
    const { id } = req.params;
    try {
        await Order.findByIdAndDelete(id);
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a User Item/Book
exports.deleteUserItem = async (req, res) => {
    const { id } = req.params;
    try {
        await Book.findByIdAndDelete(id);
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Get All Sellers
exports.getSellers = async (req, res) => {
    try {
        const sellersList = await Seller.find();
        return res.status(200).json(sellersList);
    } catch (err) {
        return res.sendStatus(500);
    }
};

// Delete a Seller
exports.deleteSeller = async (req, res) => {
    const { id } = req.params;
    try {
        await Seller.findByIdAndDelete(id);
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Get All Orders
exports.getOrders = async (req, res) => {
    try {
        const ordersList = await Order.find();
        return res.status(200).json(ordersList);
    } catch (err) {
        return res.sendStatus(500);
    }
};
