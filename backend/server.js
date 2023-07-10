import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import express from 'express';
import productRoutes from './routes/productRoutes.js'
import {notFound, errorHandler} from './middlewar/errorMiddlewar.js'; 

//ES module
//const express = require("express");
const port = process.env.PORT || 5000;

connectDB(); 

const app = express();

// ROUTE
app.get('/', (req, res) => { res.send('API running');});

// PRODUCTS
app.use('/api/products', productRoutes);
// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);



app.listen(port, () => console.log(`Server listening on port ${port}`));