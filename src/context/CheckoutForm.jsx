import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

export default function CheckoutForm({ onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const { error } = await stripe.confirmPayment({
      // `elements` contains the PaymentElement you render below
      elements,
      confirmParams: {
        // Where to redirect after a successful payment
        return_url: window.location.origin + '/success',
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else {
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-2 bg-blue-600 text-white rounded"
      >
        {loading ? 'Processing…' : 'Pay Now'}
      </button>
    </form>
  );
}
