import path from 'path'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
import connectDB from './config/db.js';
import express from 'express';
import productRoutes from './routes/productRoutes.js';
import {notFound, errorHandler} from './middlewar/errorMiddleware.js'; 
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';


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
//app.get('/', (req, res) => { res.send('API running');});

// PRODUCTS
app.use('/api/products', productRoutes);
// USERS
app.use('/api/users', userRoutes);
//ORDERS
app.use('/api/orders', orderRoutes);
//SUBMIT
app.use('/api/upload', uploadRoutes);
//PAYPAL
app.get('/api/config/paypal', (req, res) => res.send({clientId: process.env.PAYPAL_CLIENT_ID}));

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '/frontend/build')));
    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    );
} else {
    app.get('/', (req, res) => { res.send('API running');});
}

// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);



app.listen(port, () => console.log(`Server listening on port ${port}`));