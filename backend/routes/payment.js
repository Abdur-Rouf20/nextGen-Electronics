// routes/payment.js
import express from 'express';
import Stripe from 'stripe';
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', async (req, res) => {
  const { items } = req.body; 
  const amount = calculateOrderAmount(items);
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
  });
  res.json({ clientSecret: paymentIntent.client_secret });
});

export default router;
