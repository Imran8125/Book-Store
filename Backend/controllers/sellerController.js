const Seller = require('../models/Seller');
const Book = require('../models/Book');
const Order = require('../models/Order');

// Seller Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Seller.findOne({ email });
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

// Seller Register
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existing = await Seller.findOne({ email });
        if (existing) {
            return res.json("Already have an account");
        } else {
            await Seller.create({ email, name, password });
            return res.json("  Account Created");
        }
    } catch (err) {
        return res.json("failed ");
    }
};

// Add Book Item
exports.addBook = async (req, res) => {
    const { title, author, genre, description, price, userId, userName } = req.body;
    const itemImage = req.file ? req.file.path : '';

    try {
        const item = new Book({ 
            itemImage, 
            title, 
            author, 
            genre, 
            description, 
            price, 
            userId, 
            userName 
        });
        await item.save();
        return res.status(201).json(item);
    } catch (err) {
        return res.status(400).json({ error: 'Failed to create item' });
    }
};

// Get Items by Seller
exports.getSellerItems = async (req, res) => {
    const { userId } = req.params;
    try {
        const books = await Book.find({ userId }).sort('position');
        return res.json(books);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

// Delete Book Item
exports.deleteBook = async (req, res) => {
    const { id } = req.params;
    try {
        await Book.findByIdAndDelete(id);
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Get Orders by Seller
exports.getSellerOrders = async (req, res) => {
    const sellerId = req.params.userId;
    try {
        const orders = await Order.find({ sellerId }).sort('position');
        return res.json(orders);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};
