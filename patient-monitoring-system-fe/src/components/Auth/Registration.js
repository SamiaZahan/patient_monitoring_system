import React from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import backgroundImage from '../../asset/bg.jpg';
import './Auth.css'

const backgroundStyle = {
  position: 'relative',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const backgroundImageStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: 'blur(2px)',
  zIndex: -1,
};

const cardStyle = {
  padding: '2rem',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  borderRadius: '10px',
  zIndex: 1,
};

const Register = () => {
  return (
    <div style={backgroundStyle}>
    <div style={backgroundImageStyle}></div>
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <Card style={cardStyle}>
            <Card.Body>
              <h2 className="my-4">Register</h2>
              <Form>
              <Form.Group controlId="formBasicRole" className="left-aligned-group">
                <Form.Label className="left-aligned-label">Choose A Role</Form.Label>
                <Form.Control as="select" defaultValue="">
                  <option value="" disabled>Select a role</option>
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="staff">Staff</option>
                </Form.Control>
              </Form.Group>

              
                <Form.Group controlId="formBasicName" className="left-aligned-group">
                  <Form.Label className="left-aligned-label">Full Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter your name" />
                </Form.Group>

                <Form.Group controlId="formBasicEmail" className="left-aligned-group">
                  <Form.Label className="left-aligned-label">Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="left-aligned-group">
                  <Form.Label className="left-aligned-label">Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3 w-100">
                  Register
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default Register;
