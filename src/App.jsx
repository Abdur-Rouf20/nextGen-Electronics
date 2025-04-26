// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';  // Import Routes and Route
import { CartProvider } from './context/CartContext';  // Correct import of CartProvider
import Shop from './pages/Shop';  // Shop page
import Checkout from './pages/Checkout';  // Checkout page
import Payment from './pages/Payment';  // Payment page
import PrivateRoute from './context/PrivateRoute';  // Protect checkout and payment routes
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <CartProvider>  {/* Make sure to wrap everything in CartContext if you use the context */}
      <Routes>
        <Route path="/" element={<Shop />} />  {/* Default route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Protected routes */}
        <Route 
          path="/checkout" 
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route 
          path="/payment" 
          element={
            <PrivateRoute>
              <Payment />
            </PrivateRoute>
          }
        />
      </Routes>
    </CartProvider>
  );
}

export default App;
