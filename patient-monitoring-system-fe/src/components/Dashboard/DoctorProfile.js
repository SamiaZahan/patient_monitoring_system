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
  const navigate = useNavigate();
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
      <h1>Profile</h1>
    </diiv>
    </div>
   
  )
}

export default DoctorProfile;
