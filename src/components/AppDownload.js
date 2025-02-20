import React, { useState } from 'react';
import styled from 'styled-components';

const AppDownloadSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #6c8ef1, #2f5aa9);
  color: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 1000px;
  margin: auto;
`;

const Heading = styled.h2`
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #fff;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 30px;
  font-weight: 400;
  color: #e0e0e0;
  line-height: 1.5;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
`;

const PlatformButton = styled.a`
  padding: 15px 30px;
  background: linear-gradient(145deg, #3b7ee5, #1e56a0);
  color: white;
  font-size: 1.1rem;
  text-decoration: none;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 820px;
  text-align: center;

  &:hover {
    background: linear-gradient(145deg, #1e56a0, #3b7ee5);
    transform: translateY(-4px);
    box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.1);
  }
`;

const FeedbackSection = styled.div`
  margin-top: 40px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  color: #333;
  width: 100%;
  max-width: 1000px;
`;

const FeedbackHeading = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
`;

const FeedbackForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ddd;
  resize: vertical;
  min-height: 150px;
  width: 100%;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ddd;
  width: 100%;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background: linear-gradient(145deg, #4c84e4, #1f5a9a);
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1f5a9a;
  }

  &:active {
    transform: translateY(2px);
  }
`;

const AppDownload = () => {
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name || !feedback) {
      alert('Please provide both your name and feedback.');
      return;
    }

    const feedbackData = { name, feedback };

    try {
      const response = await fetch('http://localhost/food_ordering_api/web/submit_feedback.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setName('');
        setFeedback('');
      } else {
        alert(result.message || 'There was an error submitting your feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('There was an error submitting your feedback. Please try again.');
    }
  };

  return (
    <AppDownloadSection>
      <Heading>Download Our App Now</Heading>
      <Description>
        Experience the convenience of delivery at your fingertips. Order food, track delivery, and more!
      </Description>

      <ButtonContainer>
        <PlatformButton href="https://play.google.com/store/apps/details?id=com.example.app" target="_blank">
          Download for Android
        </PlatformButton>
        <PlatformButton href="https://apps.apple.com/us/app/example-app/id123456789" target="_blank">
          Download for iOS
        </PlatformButton>
      </ButtonContainer>

      {/* Feedback Section Below */}
      <FeedbackSection>
        <FeedbackHeading>We Value Your Feedback</FeedbackHeading>
        <FeedbackForm onSubmit={handleSubmit}>
          <Input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Your Name"
          />
          <TextArea
            value={feedback}
            onChange={handleFeedbackChange}
            placeholder="Share your thoughts about our app..."
          />
          <SubmitButton type="submit">Submit Feedback</SubmitButton>
        </FeedbackForm>
      </FeedbackSection>
    </AppDownloadSection>
  );
};

export default AppDownload;
