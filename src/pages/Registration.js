import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Registration = () => {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [idPicture, setIdPicture] = useState(null);
  const navigate = useNavigate();

  // Get user's current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to retrieve your location. Please enter it manually.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser. Please enter your location manually.');
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!fullname || !username || !address || !phone || !email || !password || !latitude || !longitude || !idPicture) {
      toast.error('Please fill in all fields and select an ID picture.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append('fullname', fullname);
    formData.append('username', username);
    formData.append('address', address);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('id_picture', idPicture);

    try {
      const response = await axios.post('http://localhost:5000/registration', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201 && response.data.success) {
        toast.success('Registration successful!');
        navigate('/login'); // Redirect to login page
      } else {
        toast.error(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error registering:', error);
      if (error.response) {
        toast.error(error.response.data.message || 'An error occurred. Please try again later.');
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdPicture(file);
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h1>Register as Customer</h1>
        <form onSubmit={handleRegister}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
              style={styles.input}
            />
          </div>
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
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div style={styles.inputGroup}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.submitButton}>
            Register
          </button>
        </form>
        <button 
          type="button" 
          onClick={() => navigate('/login')} 
          style={styles.loginButton}
        >
          Already have an account? Login
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
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  loginButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Registration;