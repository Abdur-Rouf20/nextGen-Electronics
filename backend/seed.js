import mongoose from 'mongoose';
import Product from './models/Product.js';
import dotenv from 'dotenv';
dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const products = [
  { title: 'Product A', description: 'Desc A', price: 10, imageUrl: '/a.jpg' },
  { title: 'Product B', description: 'Desc B', price: 20, imageUrl: '/b.jpg' },
  { title: 'Product C', description: 'Desc C', price: 30, imageUrl: '/c.jpg' }
];

const run = async () => {
  await Product.deleteMany({});
  await Product.create(products);
  mongoose.disconnect();
};

run();
