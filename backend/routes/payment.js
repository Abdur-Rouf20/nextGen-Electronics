// backend/routes/payment.js
import express from 'express';
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Create Payment Intent 
router.post('/create-payment-intent', async (req, res) => {
  const { items } = req.body;

  // Calculate the total amount from items (assumed you already have a method for this)
  const amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  try {
    // Create a Payment Intent with the amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert amount to cents (Stripe expects cents)
      currency: 'BDT', 
    });

    // Respond with the client secret to be used in the frontend
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Error creating payment intent:', err);
    res.status(500).json({ message: 'Error creating payment intent' });
  }
});

// Create Stripe Checkout Session 
router.post('/create-session', async (req, res) => {
  const { items } = req.body;

  // Map cart items to Stripe line items
  const lineItems = items.map(item => ({
    price_data: {
      currency: 'BDT',
      product_data: {
        name: item.name,
      },
      unit_amount: item.price * 100, // Stripe expects amount in cents
    },
    quantity: 1,
  }));

  try {
    // Create a checkout session with Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    // Send back the Stripe session URL for redirection
    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe session creation error:', err);
    res.status(500).json({ message: 'Error creating payment session' });
  }
});

export default router;
