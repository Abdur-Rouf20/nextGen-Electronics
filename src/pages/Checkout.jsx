// src/pages/Checkout.jsx
import { useContext } from 'react';
import {CartContext}from '../context/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { cart, dispatch } = useContext(CartContext);
  
  const total = cart.reduce((sum, p) => sum + p.price, 0);

  const handleInvoice = async () => {
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        alert('You must be logged in to generate an invoice.');
        return;
      }
  
      const res = await axios.post(
        'http://localhost:5000/api/orders/invoice',
        { items: cart },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',  // Important for binary PDF data
        }
      );
  
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      dispatch({ type: 'CLEAR' });
  
    } catch (err) {
      console.error('Invoice generation failed:', err);
      alert('Failed to generate invoice. Please try again.');
    }
  };  

  const navigate = useNavigate();
  const handleProceedToPayment = () => {
    //setShowPaymentForm(true); // Show the Stripe CheckoutForm
    navigate('/payment');
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <ul className="space-y-2">
        {cart.map((p) => (
          <li key={p._id} className="border-b py-1">
            {p.title} - ${p.price}
          </li>
        ))}
      </ul>
      <p className="mt-4 font-semibold">Total: ${total}</p>
        <>
          <button
            onClick={handleInvoice}
            className="mt-4 w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Generate Invoice
          </button>

          <button
            onClick={handleProceedToPayment}
            className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Proceed to Payment
          </button>
        </>
    </div>
  );
}
