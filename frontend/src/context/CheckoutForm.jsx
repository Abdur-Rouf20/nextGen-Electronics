import { useState, useContext } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { jsPDF } from 'jspdf';
import CartContext from './CartContext'; // Relative path as per your structure
import { useNavigate } from 'react-router-dom';

export default function CheckoutForm() {
  const { cart, dispatch } = useContext(CartContext);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);

  const formattedItems = cart.map(item => ({
    name: item.name,
    price: Number(item.price),
    quantity: Number(item.quantity) || 1,
  }));

  const calculateTotal = () =>
    formattedItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const invoiceData = {
    invoiceNumber: 'INV' + Date.now(),
    date: new Date().toLocaleDateString(),
    items: formattedItems,
    total: calculateTotal(),
  };

  const generateInvoice = () => {
    setInvoiceGenerated(true);
  };

  const downloadInvoice = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Invoice - ${invoiceData.invoiceNumber}`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${invoiceData.date}`, 20, 30);

    let y = 50;
    invoiceData.items.forEach((item, i) => {
      doc.text(
        `${i + 1}. ${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`,
        20,
        y
      );
      y += 10;
    });

    doc.text(`Total: $${invoiceData.total.toFixed(2)}`, 20, y + 10);
    doc.save(`Invoice_${invoiceData.invoiceNumber}.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/thank-you',
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else if (paymentIntent?.status === 'succeeded') {
      dispatch({ type: 'CLEAR' });
      navigate('/thank-you');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-center text-2xl font-bold mb-4">Checkout</h2>
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}

      <div className="mb-4">
        <h3 className="text-xl">Invoice Details</h3>
        <p>Invoice Number: {invoiceData.invoiceNumber}</p>
        <p>Date: {invoiceData.date}</p>
        <ul>
          {invoiceData.items.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
        <p><strong>Total: ${invoiceData.total.toFixed(2)}</strong></p>

        {!invoiceGenerated ? (
          <button
            onClick={generateInvoice}
            className="w-full py-2 bg-green-600 text-white rounded mt-4"
          >
            Generate Invoice
          </button>
        ) : (
          <>
            <p className="text-green-600 mt-2">Invoice generated successfully!</p>
            <button
              onClick={downloadInvoice}
              className="w-full py-2 bg-yellow-500 text-white rounded mt-2"
            >
              Download Invoice PDF
            </button>
          </>
        )}
      </div>

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
