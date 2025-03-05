import React from 'react';
import styled, { keyframes } from 'styled-components';
import logo from '../assets/delivery-icon.png';
import { useNavigate } from 'react-router-dom';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleUp = keyframes`
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const HeroSection = styled.section`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  background-color: white;
  text-align: center;
  flex-direction: column;
  padding: 20px;
  overflow: hidden;

  background-image: url(${() => logo});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: left;
`;

const HeroText = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: red;
  animation: ${fadeIn} 1s ease-in-out;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const HeroDescription = styled.p`
  font-size: 1.8rem;
  color: red;
  animation: ${fadeIn} 1.2s ease-in-out;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const CallToAction = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 15px;
  animation: ${scaleUp} 1.5s ease-in-out;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  animation: ${slideIn} 1.5s ease-in-out;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.05);
  }
`;

const SignInButton = styled(Button)`
  background-color: #4caf50;
  color: white;

  &:hover {
    background-color: #388e3c;
  }
`;

const SignUpButton = styled(Button)`
  background-color: #ff9800;
  color: white;

  &:hover {
    background-color: #e68900;
  }
`;

const DownloadButton = styled.a`
  padding: 12px 20px;
  background-color: #007aff;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1rem;
  text-align: center;
  transition: background 0.3s ease-in-out, transform 0.2s;

  &:hover {
    background-color: #4cd2fc;
    transform: scale(1.05);
  }
`;

const Hero = () => {
  const navigate = useNavigate();

  return (
    <HeroSection>
      <HeroText>Welcome to DeliveryApp</HeroText>
      <HeroDescription>Your favorite food delivered fast to your door.</HeroDescription>
      <CallToAction>🚀 Order Now & Enjoy Fast Delivery! 🍔</CallToAction>

      {/* Sign In and Sign Up Buttons */}
      <ButtonsContainer>
        <SignInButton onClick={() => navigate('/login')}>Sign In</SignInButton>
        <SignUpButton onClick={() => navigate('/registration')}>Sign Up</SignUpButton>
      </ButtonsContainer>

      {/* App Download Buttons */}
      <ButtonsContainer>
        <DownloadButton href="https://play.google.com/store/apps/details?id=com.example.app" target="_blank">
          Download for Android
        </DownloadButton>
        <DownloadButton href="https://apps.apple.com/us/app/example-app/id123456789" target="_blank">
          Download for iOS
        </DownloadButton>
      </ButtonsContainer>
    </HeroSection>
  );
};

export default Hero;
