import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');  // Check if token is present

  if (!token) {
    return <Navigate to="/login" />;  // If no token, redirect to login page
  }

  return children;  // If there's a token, render the children (Checkout or Payment page)
};

export default PrivateRoute;
