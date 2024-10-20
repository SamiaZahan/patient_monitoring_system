// Samia
import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import { Navbar, Nav, Container, Table, Button } from 'react-bootstrap';
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
      <diiv>
      {doctorProfile ? (
        <div className="doctor-profile">
          <h2>Welcome, Dr. {doctorProfile.name}</h2>
          <p>Email: {doctorProfile.email}</p>
          <p>Phone: {doctorProfile.phone}</p>
          <p>Qualifications: {doctorProfile.qualifications}</p>
        </div>
        ) : (
          <p>Loading profile...</p>
        )}

      </diiv>
    </div>
   
  )
}

export default DoctorProfile;
