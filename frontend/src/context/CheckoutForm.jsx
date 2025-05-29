import { useState, useContext } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import CartContext from '../context/CartContext';

export default function CheckoutForm({ onSuccess }) {
  const { cart } = useContext(CartContext);  // Access the cart from context
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);

  // Calculate total from cart
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  // Mock invoice data using the cart items
  const invoiceData = {
    invoiceNumber: 'INV12345',
    date: new Date().toLocaleDateString(),
    items: cart,
    total: calculateTotal(),
  };

  // Function to generate the invoice
  const generateInvoice = () => {
    console.log('Generating Invoice:', invoiceData);
    setInvoiceGenerated(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
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
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-center text-2xl font-bold mb-4">Checkout</h2>
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}

      {/* Invoice Section */}
      <div className="mb-4">
        <h3 className="text-xl">Invoice Details</h3>
        <p>Invoice Number: {invoiceData.invoiceNumber}</p>
        <p>Date: {invoiceData.date}</p>
        <ul>
          {invoiceData.items.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.price}
            </li>
          ))}
        </ul>
        <p><strong>Total: ${invoiceData.total}</strong></p>
        {!invoiceGenerated ? (
          <button
            onClick={generateInvoice}
            className="w-full py-2 bg-green-600 text-white rounded mt-4"
          >
            Generate Invoice
          </button>
        ) : (
          <p className="text-green-600 mt-2">Invoice generated successfully!</p>
        )}
      </div>

      {/* Stripe Payment Section */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <PaymentElement />
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full py-2 bg-blue-600 text-white rounded mt-4"
        >
          {loading ? 'Processing…' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
}
