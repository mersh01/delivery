import React from 'react';
import styled from 'styled-components';

const TestimonialsSection = styled.div`
  background: #f7f7f7;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 600;
  color: #2d3436;
  margin-bottom: 30px;
  text-align: center;
  font-family: 'Arial', sans-serif;
`;

const TestimonialCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 900px;
  margin-bottom: 30px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const QuoteText = styled.p`
  font-size: 1.2rem;
  font-style: italic;
  color: #636e72;
  margin-bottom: 20px;
`;

const UserName = styled.p`
  font-size: 1.1rem;
  font-weight: bold;
  color: #0984e3;
`;

const Testimonials = () => {
  return (
    <TestimonialsSection>
      <Title>What Our Users Say</Title>
      <TestimonialCard>
        <QuoteText>"This is the best delivery app ever! I love how easy it is to use."</QuoteText>
        <UserName>- Sarah</UserName>
      </TestimonialCard>

      <TestimonialCard>
        <QuoteText>"The service is quick and reliable, and the app is super user-friendly!"</QuoteText>
        <UserName>- John</UserName>
      </TestimonialCard>

      <TestimonialCard>
        <QuoteText>"I can order food with just a few taps! It has made my life so much easier."</QuoteText>
        <UserName>- Emily</UserName>
      </TestimonialCard>
    </TestimonialsSection>
  );
};

export default Testimonials;
