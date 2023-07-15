import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
import connectDB from './config/db.js';
import express from 'express';
import productRoutes from './routes/productRoutes.js';
import {notFound, errorHandler} from './middlewar/errorMiddleware.js'; 
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';


//ES module
//const express = require("express");
const port = process.env.PORT || 5000;

connectDB(); 

const app = express();

// Middleware to get body data from req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware cookie parser
app.use(cookieParser());


// ROUTE
app.get('/', (req, res) => { res.send('API running');});

// PRODUCTS
app.use('/api/products', productRoutes);
// USERS
app.use('/api/users', userRoutes);
//ORDERS
app.use('/api/orders', orderRoutes);
//PAYPAL
app.get('/api/config/paypal', (req, res) => res.send({clientId: process.env.PAYPAL_CLIENT_ID}));
// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);



app.listen(port, () => console.log(`Server listening on port ${port}`));