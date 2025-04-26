/* 
import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);  
router.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: 'usd',
  });
  res.json({ clientSecret: paymentIntent.client_secret });
});

export default router;
*/


// backend/routes/orders.js
import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import { verifyToken } from '../middleware/auth.js';

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST /api/orders/create-payment-intent
 * Creates a Stripe PaymentIntent and returns its client secret.
 * Expects: { amount: number }
 */
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * POST /api/orders/
 * Records a new order in MongoDB.
 * Protected: requires valid JWT (verifyToken middleware)
 * Expects: { userId: string, products: Array }
 */
router.post('/', verifyToken, async (req, res) => {
  const { userId, products } = req.body;
  try {
    const newOrder = new Order({ userId, products });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating order' });
  }
});

/**
 * GET /api/orders/:userId
 * Retrieves all orders for a given user.
 * Protected: requires valid JWT
 */
router.get('/:userId', verifyToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

export default router;
