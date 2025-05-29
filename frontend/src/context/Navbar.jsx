import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#1f2937', // Tailwind bg-gray-900
    color: '#fff',
  };

  const logoStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: '#fff',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '16px',
  };

  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#fff',
  };

  const loginButtonStyle = {
    backgroundColor: '#2563eb', // Tailwind bg-blue-600
    border: 'none',
    textAlign: 'center',
  };

  const registerButtonStyle = {
    backgroundColor: '#10b981', // Tailwind bg-green-600
    border: 'none',
    textAlign: 'center',
  };

  const logoutButtonStyle = {
    backgroundColor: '#ef4444', // Tailwind bg-red-600
    border: 'none',
    textAlign: 'center',
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={logoStyle}>
        🛍️ Next-Gen_Electronics
      </Link>

      <div style={buttonContainerStyle}>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            style={{ ...buttonStyle, ...logoutButtonStyle }}
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              style={{ ...buttonStyle, ...loginButtonStyle }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{ ...buttonStyle, ...registerButtonStyle }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
