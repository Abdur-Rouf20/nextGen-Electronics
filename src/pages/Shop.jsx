import { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const { cart, dispatch } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products?search=${search}`)
      .then(res => setProducts(res.data))
      .catch(error => console.error('Error fetching products:', error));
  }, [search]);

  const handleAddToCart = (product) => {
    dispatch({ type: 'ADD', product });
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const containerStyle = {
    padding: '24px',
  };

  const searchInputStyle = {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '100%',
    maxWidth: '500px',
    marginBottom: '16px',
    fontSize: '14px',
  };

  const productGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '16px',
  };

  const productCardStyle = {
    border: '1px solid #ddd',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const productTitleStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px',
  };

  const productDescriptionStyle = {
    fontSize: '14px',
    color: '#666',
    marginBottom: '12px',
  };

  const productPriceStyle = {
    fontSize: '16px',
    color: '#2f9e44',
    fontWeight: '600',
    marginBottom: '12px',
  };

  const addToCartButtonStyle = {
    padding: '8px 16px',
    backgroundColor: '#007BFF',
    color: '#fff',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
  };

  const checkoutButtonStyle = {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: '#fff',
    borderRadius: '4px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div style={containerStyle}>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={searchInputStyle}
      />

      <div style={productGridStyle}>
        {
          products.map(p => (
            <div key={p._id} style={productCardStyle}>
              <h3 style={productTitleStyle}>{p.title}</h3>
              <h5 style={productDescriptionStyle}>{p.description}</h5>
              <p style={productPriceStyle}>${p.price}</p>
              <button 
                onClick={() => handleAddToCart(p)} 
                style={addToCartButtonStyle}
              >
                Add to Cart
              </button>
            </div>
          ))
        }
      </div>

      {/* Show checkout button only if there are items in the cart */}
      {cart && cart.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onClick={handleCheckout}
            style={checkoutButtonStyle}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
