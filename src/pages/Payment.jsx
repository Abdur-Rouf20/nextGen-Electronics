import React, { useState, useContext, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
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

  const formContainerStyle = {
    padding: '16px',
    maxWidth: '500px',
    margin: 'auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const headingStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '12px',
    textAlign: 'center',
  };

  const errorMessageStyle = {
    color: '#f87171',
    textAlign: 'center',
    fontSize: '14px',
  };

  const cardElementStyle = {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '16px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    color: '#fff',
    backgroundColor: '#007bff',
  };

  const disabledButtonStyle = {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed',
  };

  return (
    <form onSubmit={handleSubmit} style={formContainerStyle}>
      <h2 style={headingStyle}>Total: ${total.toFixed(2)}</h2>
      {error && <p style={errorMessageStyle}>{error}</p>}

      {!cart.length ? (
        <p style={{ textAlign: 'center' }}>Your cart is empty.</p>
      ) : !clientSecret ? (
        <p style={{ textAlign: 'center' }}>Loading payment details…</p>
      ) : (
        <>
          <CardElement style={cardElementStyle} />
          <button
            type="submit"
            disabled={!stripe || loading}
            style={{
              ...buttonStyle,
              ...(loading ? disabledButtonStyle : {}),
            }}
          >
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
