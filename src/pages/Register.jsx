import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { email, password });
      navigate('/login');  // Redirect to login page after successful registration
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  const containerStyle = {
    padding: '24px',
    maxWidth: '400px',
    margin: 'auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const headingStyle = {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '14px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
  };

  const errorStyle = {
    color: '#FF4C4C',
    marginBottom: '16px',
  };

  const linkStyle = {
    color: '#007BFF',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Register</h2>
      {error && <p style={errorStyle}>{error}</p>}
      <form onSubmit={handleRegister}>
        <div>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Confirm Password</label>
          <input
            type="password"
            style={inputStyle}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={buttonStyle}>
          Register
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <p style={{ fontSize: '14px' }}>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} style={linkStyle}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
