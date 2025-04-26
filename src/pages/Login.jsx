// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);  // Save token to localStorage
      navigate('/checkout');  // Redirect to checkout page
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const goToRegister = () => {
    navigate('/register');  // Navigate to Register page
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-center text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">
          Login
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm">
          Don't have an account?{' '}
          <button onClick={goToRegister} className="text-blue-600">
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}
