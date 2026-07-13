const User = require('../models/User');
const Book = require('../models/Book');
const Order = require('../models/Order');
const Wishlist = require('../models/Wishlist');

// User Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            if (user.password === password) {
                return res.json({ 
                    Status: "Success", 
                    user: { id: user.id, name: user.name, email: user.email } 
                });
            } else {
                return res.json("Invalid Password");
            }
        } else {
            return res.json("User not found");
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// User Register
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.json("Already have an account");
        } else {
            await User.create({ email, name, password });
            return res.json("  Account Created");
        }
    } catch (err) {
        return res.json("failed ");
    }
};

// Get All Items (Books)
exports.getItems = async (req, res) => {
    try {
        const items = await Book.find();
        return res.json(items);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server Error');
    }
};

// Get Single Item (Book)
exports.getItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Book.findById(id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        return res.json(item);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Place Order
exports.placeOrder = async (req, res) => {
    const { 
        flatno, 
        city, 
        state, 
        pincode, 
        totalamount, 
        seller, 
        sellerId, 
        BookingDate, 
        description, 
        Delivery, 
        userId, 
        userName, 
        booktitle, 
        bookauthor, 
        bookgenre, 
        itemImage 
    } = req.body;

    try {
        const order = new Order({ 
            flatno, 
            city, 
            state, 
            pincode, 
            totalamount, 
            seller, 
            sellerId, 
            BookingDate, 
            description, 
            userId, 
            Delivery, 
            userName, 
            booktitle, 
            bookauthor, 
            bookgenre, 
            itemImage 
        });
        await order.save();
        return res.status(201).json(order);
    } catch (err) {
        return res.status(400).json({ error: 'Failed to create order' });
    }
};

// Get Orders by User
exports.getUserOrders = async (req, res) => {
    const { userId } = req.params;
    try {
        const orders = await Order.find({ userId }).sort('position');
        return res.json(orders);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

// Get All Wishlist Items
exports.getAllWishlistItems = async (req, res) => {
    try {
        const wishlistItems = await Wishlist.find();
        return res.json(wishlistItems);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server Error');
    }
};

// Get Wishlist Items by User
exports.getUserWishlist = async (req, res) => {
    const { userId } = req.params;
    try {
        const items = await Wishlist.find({ userId }).sort('position');
        return res.json(items);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

// Add Item to Wishlist
exports.addToWishlist = async (req, res) => {
    const { itemId, title, itemImage, userId, userName } = req.body;
    try {
        // Prevent duplicate wishlist items for the same user
        const existingItem = await Wishlist.findOne({ itemId, userId });
        if (existingItem) {
            return res.status(400).json({ msg: 'Item already in wishlist' });
        }
        
        const newItem = new Wishlist({ 
            itemId, 
            title, 
            itemImage, 
            userId, 
            userName 
        });
        await newItem.save();
        return res.json(newItem);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server Error');
    }
};

// Remove Item from Wishlist
exports.removeFromWishlist = async (req, res) => {
    const { itemId, userId } = req.body;
    try {
        // Build query matching both itemId and optional userId for backward compatibility
        const query = userId ? { itemId, userId } : { itemId };
        await Wishlist.findOneAndDelete(query);
        return res.json({ msg: 'Item removed from wishlist' });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server Error');
    }
};
