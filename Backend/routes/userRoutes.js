const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Authentication
router.post('/login', userController.login);
router.post('/signup', userController.signup);

// Items (Books)
router.get('/item', userController.getItems);
router.get('/item/:id', userController.getItemById);

// Orders
router.post('/userorder', userController.placeOrder);
router.get('/getorders/:userId', userController.getUserOrders);

// Wishlist
router.get('/wishlist', userController.getAllWishlistItems);
router.get('/wishlist/:userId', userController.getUserWishlist);
router.post('/wishlist/add', userController.addToWishlist);
router.post('/wishlist/remove', userController.removeFromWishlist);

module.exports = router;
