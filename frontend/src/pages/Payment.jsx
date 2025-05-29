import React, { useEffect, useState, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../context/CheckoutForm'; // Assuming this is the right path
import { CartContext } from '../context/CartContext';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function Payment() {
  const [clientSecret, setClientSecret] = useState('');
  const { cart } = useContext(CartContext);

  useEffect(() => {
    if (cart.length) {
      axios.post('http://localhost:5000/api/orders/create-payment-intent', { items: cart })
        .then(res => setClientSecret(res.data.clientSecret))
        .catch(err => console.error('Error fetching client secret', err));
    }
  }, [cart]);

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  };

  return (
    <>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      ) : (
        <p className="text-center p-6">Loading payment details…</p>
      )}
    </>
  );
}
