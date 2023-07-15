import asyncHandler from '../middlewar/asyncHandler.js';
import Order from '../models/orderModel.js'; 

// CREATE ORDER
// POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      } = req.body
    
      if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('There are no items selected')
      } else {
        const order = new Order({
          orderItems: orderItems.map((item)=> ({
            ...item,
            product: item._id,
            _id: undefined
          })),
          user: req.user._id,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        })
    
        const createdOrder = await order.save()
    
        res.status(201).json(createdOrder)
      }
});

// GET MY ORDERS
// GET /api/orders/myorders
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
    res.status(200).json(orders)
});

// GET ORDER BY ID
// GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
      );
    
      if (order) {
        res.status(200).json(order);
      } else {
        res.status(404)
        throw new Error('Something went wrong, your order was not found')
      }
});

// UPDATE ORDER TO BE PAID
// PUT /api/orders/:id/pay
const updateOrderToBePaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address
      };
      const updateOrder = await order.save();
      res.status(200).json(updateOrder);
    } else {
      res.status(404);
      throw new Error('Something went wrong, it was not possible to fin information about this order')
    }
});

// ADMIN CONTROLLERS --------------------------------

// UPDATE ORDER TO BE DELIVERED
// GET /api/orders/:id/deliver
const updateOrderToBeDelivered = asyncHandler(async (req, res) => {
    res.json('update order to be delivered');
});

// GET ALL ORDERS
// GET /api/orders
const getAllOrders = asyncHandler(async (req, res) => {
    res.json('get all orders');
});

export {
    createOrder, getMyOrders, getOrderById, updateOrderToBePaid, updateOrderToBeDelivered,getAllOrders
};