import express from 'express';
const router = express.Router();
import { 
    createOrder, getMyOrders, getOrderById, updateOrderToBePaid, updateOrderToBeDelivered,getAllOrders } from '../controllers/orderController.js';
import {protect, admin} from '../middlewar/authMiddleware.js'

    //CREATE ORDER (USER) AND GET ALL ORDERS (ADMIN)
    router.route('/')
        .post(protect, createOrder)
        .get(protect, admin, getAllOrders);
    //GET MY ORDERS (USER)
    router.route('/myorders').get(protect, getMyOrders);
    // GET ORDER BY ID (USER)
    router.route('/:id').get(protect, getOrderById);
    // PAY ORDER (USER)
    router.route('/:id/pay').put(protect, updateOrderToBePaid);
    // DELIVER ORDER (ADMIN)
    router.route('/:id/deliver').put(protect, admin, updateOrderToBeDelivered);

    export default router;