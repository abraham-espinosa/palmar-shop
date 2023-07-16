import asyncHandler from '../middlewar/asyncHandler.js';
import Product from '../models/productModel.js'; 

// GET ALL PRODUCTS
// GET /api/products
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

// CREATE A PRODUCT
// POST /api/products (admin)
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Undifined',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Undifined',
    category: 'Undifined',
    countInStock: 0,
    numReviews: 0,
    description: 'Undifined',
  })
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// UPDATE A PRODUCT
// PUT /api/products/:id (admin)
const updateProduct = asyncHandler(async (req, res) => {
  const {name, price, description, image, brand, category, countInStock } = req.body;

  const product = await Product.findById(req.params.id);
  if (product){
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  }else{
    res.status(404);
    throw new Error('Product does not exist')
  }
});

// DELETE A PRODUCT
// DELETE /api/products/:id (admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product){
    await Product.deleteOne({_id: product._id});
    res.status(200).json({message: 'Product deleted successfully'});
  }else{
    res.status(404);
    throw new Error('Product does not exist')
  }
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

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct};