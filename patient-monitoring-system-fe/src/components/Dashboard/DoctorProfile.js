// Samia
import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container} from 'react-bootstrap';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import 'chart.js/auto';  // Needed for Chart.js
import axios from 'axios';
const DoctorProfile = () => {
  const [doctorProfile, setDoctorProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/'); // Redirect to login if no token found
        }

        const response = await axios.get('http://localhost:5000/api/doctor/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setDoctorProfile(response.data);
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
        alert('Error fetching profile');
    
      }
    };

    fetchDoctorProfile();
  },[]);


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="doctor-dashboard-container">
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/doctor-dashboard">
            <FaHome /> Home
          </Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link href="doctor-profile">Profile</Nav.Link>
            <Nav.Link onClick={handleLogout} className="w-100">
              <FaSignOutAlt /> Logout
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <div className="container doctor-profile w-50">
      {doctorProfile ? (
        <Card className="shadow-lg p-3 m-5 bg-white rounded">
          <Row className="no-gutters">
            <Col md={12}>
              <Card.Body>
              <Image
                src={doctorProfile.image || 'https://via.placeholder.com/150'}
                roundedCircle
                alt="Doctor Profile"
                fluid
                className="my-3 profile-image"
              />
                <h2 className="card-title">{doctorProfile.name}</h2>
                <Card.Text>
                  <strong>Email:</strong> {doctorProfile.email} <br />
                  <strong>Phone:</strong> {doctorProfile.phone} <br />
                  <strong>Qualifications:</strong> {doctorProfile.qualifications}
                </Card.Text>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
    </div>
   
  )
}

export default DoctorProfile;
