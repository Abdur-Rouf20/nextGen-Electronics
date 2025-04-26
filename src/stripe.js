// src/stripe.js
import { loadStripe } from '@stripe/stripe-js';
export const stripePromise = loadStripe('pk_test_51RFsIJFbxcJVF0zPf8va2TeGxZxN7sJxTIdBQdVP8hF3fOJEFhcBUAtbXeNuhAFLDJrrPjRKe12SU3miRxNsllgc00izOiGvjL');

// src/stripe.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export function useStripeOptions(items) {
  const [options, setOptions] = useState(null);

  useEffect(() => {
    axios.post('http://localhost:5000/api/create-payment-intent', { items })
      .then(res => {
        setOptions({
          clientSecret: res.data.clientSecret,
          appearance: { theme: 'stripe' },
        });
      });
  }, [items]);

  return options;
}
