import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
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
    navigate('/payment');
  };

  const containerStyle = {
    padding: '24px',
    maxWidth: '500px',
    margin: 'auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
    textAlign: 'center',
  };

  const listItemStyle = {
    borderBottom: '1px solid #ddd',
    padding: '8px 0',
    fontSize: '14px',
  };

  const totalPriceStyle = {
    marginTop: '16px',
    fontSize: '18px',
    fontWeight: '600',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '16px',
  };

  const generateInvoiceButtonStyle = {
    backgroundColor: '#28a745',
  };

  const proceedToPaymentButtonStyle = {
    backgroundColor: '#007bff',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Checkout</h2>
      <ul>
        {cart.map((p) => (
          <li key={p._id} style={listItemStyle}>
            {p.title} - ${p.price}
          </li>
        ))}
      </ul>
      <p style={totalPriceStyle}>Total: ${total}</p>

      <button
        onClick={handleInvoice}
        style={{ ...buttonStyle, ...generateInvoiceButtonStyle }}
      >
        Generate Invoice
      </button>

      <button
        onClick={handleProceedToPayment}
        style={{ ...buttonStyle, ...proceedToPaymentButtonStyle }}
      >
        Proceed to Payment
      </button>
    </div>
  );
}
