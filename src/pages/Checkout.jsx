// src/pages/Checkout.jsx
import { useContext } from 'react';
import CartContext from '../context/CartContext';
import axios from 'axios';

export default function Checkout() {
  const { cart, dispatch } = useContext(CartContext);
  const total = cart.reduce((sum, p) => sum + p.price, 0);

  const handleInvoice = async () => {
    try{
      const res = await axios.post('/api/orders/invoice', { items: cart });
      window.open(res.data.invoiceUrl, '_blank');
      dispatch({ type: 'CLEAR' });
    } catch (err) {
      console.error("Invoice generation failed:", err);
    }
  };

  return (
    <>
      <h2>Checkout</h2>
      <ul>{cart.map(p => <li key={p._id}>{p.title} - ${p.price}</li>)}</ul>
      <p>Total: ${total}</p>
      <button onClick={handleInvoice}>Generate Invoice</button>
    </>
  );
}
