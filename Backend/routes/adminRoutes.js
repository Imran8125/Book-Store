const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Authentication
router.post('/alogin', adminController.login);
router.post('/asignup', adminController.signup);

// User Management
router.get('/users', adminController.getUsers);
router.delete('/userdelete/:id', adminController.deleteUser);
router.delete('/userorderdelete/:id', adminController.deleteUserOrder);
router.delete('/useritemdelete/:id', adminController.deleteUserItem);

// Seller Management
router.get('/sellers', adminController.getSellers);
router.delete('/sellerdelete/:id', adminController.deleteSeller);

// Order Management
router.get('/orders', adminController.getOrders);

module.exports = router;
