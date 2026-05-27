const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/ordersController');

router.post('/', authMiddleware, createOrder);
router.get('/my', authMiddleware, getMyOrders);
router.get('/all', authMiddleware, getAllOrders);
router.patch('/:id/status', authMiddleware, updateOrderStatus);

module.exports = router;