import React from 'react';
import styled from 'styled-components';
import logo from '../assets/delivery-icon.png';

const HeroSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  background-color: white;
  color: black;
  text-align: center;
  flex-direction: column;

  /* Background image styling */
  background-image: url(${logo}); /* Use the imported logo */
  background-size: contain; /* Make sure the whole logo is visible */
  background-repeat: no-repeat; /* Prevent the image from repeating */
  background-position: 90%; /* Center the image in the background */
`;

// The rest of your component remains the same
const AndroidButton = styled.a`
  margin-top: 1rem;
  padding: 1rem 2rem;
  background-color: #34b7f1;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  &:hover {
    background-color: #0073e6;
  }
`;

const IosButton = styled.a`
  margin-top: 1rem;
  padding: 1rem 2rem;
  background-color: #007aff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  &:hover {
    background-color: #4cd2fc;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  padding: 10px;
  width: 80%;
  gap: 20px;
`;

const Hero = () => {
  return (
    <HeroSection>
      <h1>Welcome to DeliveryApp</h1>
      <p>Your favorite food delivered fast at your door.</p>
      <ButtonsContainer>
        <AndroidButton href="https://play.google.com/store/apps/details?id=com.example.app" target="_blank">
          Download for Android
        </AndroidButton>
        <IosButton href="https://apps.apple.com/us/app/example-app/id123456789" target="_blank">
          Download for iOS
        </IosButton>
      </ButtonsContainer>
    </HeroSection>
  );
};

export default Hero;
