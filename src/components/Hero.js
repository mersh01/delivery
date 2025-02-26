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
  padding: 20px;

  /* Background image styling */
  background-image: url(${() => logo});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  /* Responsive */
  @media (max-width: 768px) {
    height: 50vh;
    background-size: 50%;
  }

  @media (max-width: 480px) {
    height: 40vh;
    background-size: 40%;
  }
`;

const AndroidButton = styled.a`
  padding: 1rem 2rem;
  background-color: #34b7f1;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1rem;
  text-align: center;
  transition: background 0.3s ease-in-out;

  &:hover {
    background-color: #0073e6;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.8rem 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.6rem 1.2rem;
  }
`;

const IosButton = styled(AndroidButton)`
  background-color: #007aff;

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
  flex-wrap: wrap; /* Makes buttons wrap on small screens */

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
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
