// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom'; //  Removed BrowserRouter
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import PrivateRoute from './context/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './context/Navbar'; // Navbar stays

function App() {
  return (
    <>
      <Navbar /> {/*  Navbar stays visible on all routes */}
      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
    </>
  );
}

export default App;
