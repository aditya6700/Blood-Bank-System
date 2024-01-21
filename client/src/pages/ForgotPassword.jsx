import axios from 'axios';
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { resetPasswordRoute } from '../utils/ApiRoutes';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('In which city were you born?'); 
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [showSecurityQuestion, setShowSecurityQuestion] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState('');
  const [userData, setUserData] = useState({});

  const api = axios.create({
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`${resetPasswordRoute}/email`, { email });
      if (data.success) {
        setUserData(data.validUser);
        setShowSecurityQuestion(true);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
    
  };

  const handleSecurityQuestionSubmit = (e) => {
    e.preventDefault();
   
    if (securityAnswer.toLowerCase() === userData.city) {
      setSecurityQuestion(''); 
      setShowSecurityQuestion(false);
      setShowNewPassword(true);
    } else {
      alert('Incorrect security answer. Please try again.');
    }
  };

  const handleNewPasswordSubmit = (e) => {
    e.preventDefault();
    
    alert('New password submitted: ' + newPassword);
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={12} md={6}>
          <h2 className="mb-4">Forgot Password</h2>

          {!showSecurityQuestion && !showNewPassword && (
            <Form onSubmit={handleEmailSubmit}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-3">
                Next
              </Button>
            </Form>
          )}

          {showSecurityQuestion && (
            <Form onSubmit={handleSecurityQuestionSubmit}>
              <Form.Group controlId="formSecurityQuestion">
                <Form.Label>{securityQuestion}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Your answer"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-3">
                Verify Security Answer
              </Button>
            </Form>
          )}

          {showNewPassword && !showSecurityQuestion && (
            <Form onSubmit={handleNewPasswordSubmit}>
              <Form.Group controlId="formNewPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-3">
                Reset Password
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};