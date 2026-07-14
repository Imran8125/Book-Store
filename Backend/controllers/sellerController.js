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
                if (!user.isApproved) {
                    return res.json("Seller not approved yet");
                }
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
    const { title, author, genre, description, price, userId, userName, stock, formats } = req.body;
    const itemImage = req.file ? req.file.path : '';

    try {
        let parsedFormats = ['Paperback', 'E-Book'];
        if (formats) {
            try {
                parsedFormats = typeof formats === 'string' ? JSON.parse(formats) : formats;
            } catch (e) {
                parsedFormats = formats.split(',').map(f => f.trim());
            }
        }
        const item = new Book({ 
            itemImage, 
            title, 
            author, 
            genre, 
            description, 
            price, 
            userId, 
            userName,
            stock: stock ? parseInt(stock, 10) : 5,
            formats: parsedFormats
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

// Update Book Item
exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, author, genre, description, price, stock, formats } = req.body;
    try {
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        if (title) book.title = title;
        if (author) book.author = author;
        if (genre) book.genre = genre;
        if (description) book.description = description;
        if (price) book.price = price;
        if (stock !== undefined) book.stock = parseInt(stock, 10);
        if (formats) {
            try {
                book.formats = typeof formats === 'string' ? JSON.parse(formats) : formats;
            } catch (e) {
                book.formats = formats.split(',').map(f => f.trim());
            }
        }
        if (req.file) {
            book.itemImage = req.file.path;
        }

        await book.save();
        return res.json(book);
    } catch (err) {
        return res.status(400).json({ error: 'Failed to update book' });
    }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        order.status = status;
        await order.save();
        return res.json(order);
    } catch (err) {
        return res.status(400).json({ error: 'Failed to update order status' });
    }
};

// Update Seller Profile
exports.updateSellerProfile = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    try {
        const seller = await Seller.findById(id);
        if (!seller) {
            return res.status(404).json({ error: 'Seller not found' });
        }
        if (name) seller.name = name;
        if (email) {
            const existing = await Seller.findOne({ email });
            if (existing && existing._id.toString() !== id) {
                return res.status(400).json({ error: 'Email already in use' });
            }
            seller.email = email;
        }
        if (password) seller.password = password;
        await seller.save();
        return res.json({
            Status: "Success",
            user: { id: seller.id, name: seller.name, email: seller.email }
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
