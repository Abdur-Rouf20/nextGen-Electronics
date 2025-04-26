// routes/products.js
import express from 'express';
import Product from '../models/Product.js';
const router = express.Router();

// GET /products?search=term
router.get('/', async (req, res) => {
  const { search } = req.query;
  const filter = search
    ? { name: { $regex: search, $options: 'i' } }
    : {};
  res.json(await Product.find(filter));
});

router.get("/all", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ADD NEW PRODUCT
router.post("/add", async (req, res) => {
  try {
    const { name, price, image, description } = req.body;

    const newProduct = new Product({ name, price, image, description });
    await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: "Failed to add product" });
  }
});
export default router;
