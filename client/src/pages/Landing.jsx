import React, { useState } from 'react';
import NavigationBar from '../components/NavigationBar'
import { Container, Row, Button, Col } from 'react-bootstrap';
import RegisterModal from './modals/RegisterModal';
import LoginModal from './modals/LoginModal';


export default function Landing() {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const goHome = () => {
    setShowLogin(false);
    setShowRegister(false);
  }

  return (
    <>
      <Container fluid className='landing-page' >
        <NavigationBar goHome={goHome} /> 
        <Container className='landing-wrapper'>
          <Row  className='my-row full-height-row d-flex justify-content-start align-items-center'>
          {
              !showRegister && !showLogin &&
              <Col className='my-col justify-content-between' sm={8}>
                <h1 className='landing-title'>donate blood today!</h1>
                <h3 className='landing-slogan'> </h3>
                <p className='landing-qoute'>In the tapestry of humanity, your blood becomes a thread of compassion, weaving stories of survival and strength. Donate generously, for in each drop lies the power to heal and unite us in the symphony of life's resilience.</p>
                <Button
                  className='donate-button px-3 py-1'
                  variant="outline-danger"
                  style={{ borderRadius: 0, borderWidth: "2px" }}
                  onClick={() => setShowLogin(true)}>
                  Transfuse Now
                </Button>
              </Col>
            }
            
            {
              showRegister  && <Col md={6}> <RegisterModal setShowLogin={setShowLogin} setShowRegister={setShowRegister} /> </Col>
            }
            {
              showLogin && <Col md={6}> <LoginModal setShowLogin={setShowLogin} setShowRegister={setShowRegister} /> </Col>
            }
            
          </Row>
        </Container>
      </Container>
    </>
  )
}
