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
router.delete('/itemdelete/:id', sellerController.deleteBook);

// Orders
router.get('/getsellerorders/:userId', sellerController.getSellerOrders);

module.exports = router;
