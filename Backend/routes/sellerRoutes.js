const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const upload = require('../middlewares/upload');

// Authentication
router.post('/slogin', sellerController.login);
router.post('/ssignup', sellerController.signup);

// Book Management
router.post('/items', upload.single('itemImage'), sellerController.addBook);
router.get('/getitem/:userId', sellerController.getSellerItems);
router.put('/itemupdate/:id', upload.single('itemImage'), sellerController.updateBook);
router.delete('/itemdelete/:id', sellerController.deleteBook);

// Orders
router.get('/getsellerorders/:userId', sellerController.getSellerOrders);
router.put('/orderstatus/:id', sellerController.updateOrderStatus);
router.put('/sellerprofile/:id', sellerController.updateSellerProfile);

module.exports = router;
