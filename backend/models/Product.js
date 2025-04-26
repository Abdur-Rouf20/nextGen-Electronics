// models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', ProductSchema);
