// backend/routes/orders.js
import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import { verifyToken } from '../middleware/auth.js';
import PDFDocument from 'pdfkit';  // Import pdfkit
import fs from 'fs';  // For file handling

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
      currency: 'BDT',
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/** 
  * Route to handle order creation
  * Comments removed for brevity
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

// GET /api/orders/invoices/:id
router.get('/invoices/:id', (req, res) => {
  const { id } = req.params;
  const items = global.generatedInvoices?.[id];

  if (!items) {
    return res.status(404).send('<h1>Invoice Not Found</h1>');
  }

  const itemsHtml = items.map(item => 
    `<li style="padding: 5px 0; font-size: 16px; color: #555;">${item.title} - $${item.price}</li>`
  ).join('');

  const total = items.reduce((sum, item) => sum + item.price, 0);

  res.send(`
    <html>
      <head>
        <title>Invoice #${id}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
          }
          .container {
            width: 100%;
            max-width: 900px;
            margin: 50px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          h1 {
            text-align: center;
            font-size: 28px;
            color: #007bff;
          }
          h3 {
            font-size: 20px;
            color: #333;
          }
          ul {
            list-style-type: none;
            padding-left: 0;
          }
          .total {
            font-weight: bold;
            font-size: 18px;
            color: #007bff;
            text-align: right;
          }
          footer {
            text-align: center;
            font-size: 14px;
            color: #888;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Invoice #${id}</h1>
          <ul>
            ${itemsHtml}
          </ul>
          <h3 class="total">Total: $${total}</h3>
          <footer>
            <p>Thank you for your order! If you have any questions, feel free to contact us.</p>
          </footer>
        </div>
      </body>
    </html>
  `);
});

// POST /api/orders/invoice
router.post('/invoice', verifyToken, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Invalid items data' });
    }

    // Create a PDF document in memory
    const doc = new PDFDocument();
    let buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=invoice.pdf');
      res.send(pdfData);
    });

    // Build the invoice content in PDF
    doc.fontSize(20).text('Invoice', { align: 'center' });
    doc.moveDown();

    let total = 0;
    items.forEach((item, index) => {
      doc.fontSize(14).text(`${index + 1}. ${item.title} - $${item.price}`);
      total += item.price;
    });

    doc.moveDown().fontSize(16).text(`Total: $${total}`, { align: 'right' });
    doc.text('Thank you for your order!', { align: 'center', marginTop: 20 });
    doc.end();
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    res.status(500).json({ message: 'Failed to generate PDF invoice' });
  }
});

export default router;
