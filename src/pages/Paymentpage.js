import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import Footer from '../components/Footer';
import Navbars from '../components/Navbars';
import config from '../config'; // Import the configuration file

const PaymentPageContainer = styled.div`
  padding: 100px;
  text-align: center;
`;

const PaymentButton = styled.button`
  background-color: #FF5722;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
`;

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user_id, totalPrice, order_id } = location.state || {};
  const [paymentUrl, setPaymentUrl] = useState(null);

  useEffect(() => {
    // Make an API call to create a payment session on your backend
    const createPaymentSession = async () => {
      try {
        const response = await axios.post(`${config.backendUrl}/create_payment_session`, {
          user_id: user_id,
          amount: totalPrice, // Total amount the user needs to pay
        });

        if (response.status === 200) {
          setPaymentUrl(response.data.payment_url); // Chapa's payment URL
        }
      } catch (error) {
        console.error('Error creating payment session:', error);
      }
    };

    createPaymentSession();
  }, [user_id, totalPrice]);

  const handlePaymentRedirect = () => {
    if (paymentUrl) {
      // Redirect to Chapa's payment gateway
      window.location.href = paymentUrl;
    }
  };

  // Handle the payment success callback
  useEffect(() => {
    const handlePaymentSuccess = async (paymentReference) => {
      try {
        const response = await axios.post(`${config.backendUrl}/payment_callback`, {
          payment_reference: paymentReference,
          order_id: order_id,
        });

        if (response.status === 200 && response.data.status === 'success') {
          // Navigate to the "Placed Order" page upon successful payment
          navigate('/placed-order', { state: { order_id } });
        } else {
          alert('Payment failed. Please try again.');
        }
      } catch (error) {
        console.error('Error handling payment callback:', error);
      }
    };

    // Assuming Chapa sends the payment reference via URL (or query parameters)
    const urlParams = new URLSearchParams(window.location.search);
    const paymentReference = urlParams.get('payment_reference');
    
    if (paymentReference) {
      handlePaymentSuccess(paymentReference);
    }
  }, [navigate, order_id]);

  return (
    <>
      <Navbars />
      <PaymentPageContainer>
        <h1>Complete Your Payment</h1>
        <p>Total Amount: ${totalPrice}</p>

        <PaymentButton onClick={handlePaymentRedirect}>
          Pay with Chapa
        </PaymentButton>
      </PaymentPageContainer>
      <Footer />
    </>
  );
};

export default PaymentPage;
