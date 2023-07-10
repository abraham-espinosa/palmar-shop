import asyncHandler from '../middlewar/asyncHandler.js';
import Product from '../models/productModel.js'; 

// GET ALL PRODUCTS
// GET /api/products
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

// GET PRODUCT BY ID
// GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      return  res.json(product);
    } else {
      res.status(404);
      throw new Error('URL not found');
    }
});

export { getProducts, getProductById};