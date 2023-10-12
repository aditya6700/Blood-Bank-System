import React from 'react';
import { Container, Row, Form, FloatingLabel, Button, Card, Col } from 'react-bootstrap';

export const Register = () => {
  return (
    <Container className='form-container' fluid="md" >
      <Row className="vh-100 d-flex justify-content-center align-items-center">
      <Col md={8} lg={6} xs={12}>
        <div className="border border-3 border-primary"></div>
        <Card className="shadow">
          <Card.Body>
            <div className="mb-3 mt-4">
              <h2 className="fw-bold mb-2 text-uppercase">BLOOD BANK</h2>
              <p className="mb-3">Please enter your details to join us!</p>
              <Form className="mb-3">
                  
                <Form.Group className="mb-3">
                  <FloatingLabel controlId="floatingInput" label="Name" >
                    <Form.Control type="text" placeholder="Dream Fuel" name="name" required />
                  </FloatingLabel> 
                </Form.Group>

                <Form.Group className="mb-3">
                  <FloatingLabel controlId="floatingInput" label="Email address"  >
                    <Form.Control type="email" placeholder="name@example.com" name="email" required />
                  </FloatingLabel> 
                </Form.Group>
                  
                <Row className="mb-3">
                  <Form.Group className="mb-3" as={Col}>
                    <FloatingLabel controlId="floatingInput" label="Password" >
                      <Form.Control type="password" placeholder="secret" name="password" required />
                    </FloatingLabel> 
                  </Form.Group>

                  <Form.Group className="mb-3" as={Col}>
                    <FloatingLabel controlId="floatingInput" label="Confirm Password" >
                      <Form.Control type="password" placeholder="secret" name="cpassword" required />
                    </FloatingLabel> 
                  </Form.Group>
                </Row>

                <div className="d-grid">
                  <Button variant="primary" type="submit">
                    Register
                  </Button>
                </div>
                  
              </Form>
            </div>
          </Card.Body>
        </Card>
      </Col>
      </Row>
    </Container> 
  );
}
