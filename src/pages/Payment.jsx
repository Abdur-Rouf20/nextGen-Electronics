// src/pages/Payment.jsx
import React, { useState, useContext, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import {CartContext} from '../context/CartContext';
import axios from 'axios';

// Ensure you are properly loading the Stripe public key from Vite environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, dispatch } = useContext(CartContext);
  const [total, setTotal] = useState(0);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Calculate total and initialize payment intent
  useEffect(() => {
    const amount = cart.reduce((sum, p) => sum + p.price, 0);
    setTotal(amount);

    if (cart.length) {
      axios.post('http://localhost:5000/api/orders/create-payment-intent', { amount })
        .then(res => setClientSecret(res.data.clientSecret))
        .catch(() => setError('Unable to initialize payment.'));
    }
  }, [cart]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    setError(null);

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) }
    });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      dispatch({ type: 'CLEAR' });
      navigate('/thank-you');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Total: ${total.toFixed(2)}</h2>
      {error && <p className="text-red-500">{error}</p>}

      {!cart.length ? (
        <p>Your cart is empty.</p>
      ) : !clientSecret ? (
        <p>Loading payment details…</p>
      ) : (
        <>
          <CardElement className="p-2 border rounded" />
          <button
            type="submit"
            disabled={!stripe || loading}
            className={`w-full py-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {loading ? 'Processing…' : `Pay $${total.toFixed(2)}`}
          </button>
        </>
      )}
    </form>
  );
}

export default function Payment() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
