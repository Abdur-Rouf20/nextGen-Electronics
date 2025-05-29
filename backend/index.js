// Load .env before anything else
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import ordersRouter from './routes/orders.js';
import paymentRoutes from './routes/payment.js';
const app = express();
connectDB();


app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' https://js.stripe.com https://m.stripe.network 'unsafe-inline'; " +
    "style-src 'self' https://m.stripe.network 'unsafe-inline'; " +
    "frame-src https://js.stripe.com https://hooks.stripe.com; " +
    "connect-src 'self' https://api.stripe.com https://m.stripe.network; " +
    "img-src 'self' data:;"
  );
  next();
});

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
};
app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', ordersRouter);
app.use('/api/payment', paymentRoutes); // payment route

// Health check
app.get('/', (req, res) => res.send('API is running'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

// Start the server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('DB connection error:', err);
    process.exit(1);
  });
