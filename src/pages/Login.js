import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Correct usage of 'useNavigate'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import config from '../config'; // Import the configuration file

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  // Correct usage of 'useNavigate'

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.backendUrl}/login`, {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response from API:', response.data);
    
      if (response.status === 200 && response.data.success) {
        const { user_id, username } = response.data;
        localStorage.setItem('user_id', user_id);
        localStorage.setItem('username', username);
        toast.success('Login successful!');
        navigate(`/list?user_id=${user_id}&username=${username}`);  // Corrected string interpolation
      } else {
        toast.error(response.data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      if (error.response) {
        console.error('Response error data:', error.response.data);
        toast.error(error.response.data.message || 'An error occurred. Please try again later.');
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/registration'); // Navigate to the registration page
  };

  return (
    <>
      {/* Navbar rendered outside help-container */}
      <Navbar />
      <div style={styles.container}>
        <h1>Login as Customer</h1>
        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.submitButton}>
            Login
          </button>
        </form>
        <button 
          type="button" 
          onClick={handleRegisterRedirect} 
          style={styles.registerButton}
        >
          Register
        </button>
        <ToastContainer />
      </div>
      <Footer />
    </>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '400px',
    margin: '100px auto',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '5px 0',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#ff5722',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '10px', // Added margin to separate from the register button
  },
  registerButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4CAF50', // Different color for the register button
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Login;