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

  return (
    <div className="p-6">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded w-full max-w-md"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {  
        products.map(p => (
          <div key={p._id} className="border p-4 rounded shadow">
            <h3 className="font-bold text-lg">{p.title}</h3>
            <h5 className="text-sm text-gray-600">{p.description}</h5>
            <p className="text-green-600 font-semibold">${p.price}</p>
            <button 
              onClick={() => handleAddToCart(p)} 
              className="mt-2 px-4 py-1 bg-blue-500 text-white rounded"
            >
              Add to Cart
            </button>
          </div>
        ))
        }
      </div>

      {/* Show checkout button only if there are items in the cart */}
      {cart && cart.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={handleCheckout}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded shadow hover:bg-green-700"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
