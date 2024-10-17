// src/components/DoctorDashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import { Navbar, Nav, Container, Table, Button } from 'react-bootstrap';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import 'chart.js/auto';  // Needed for Chart.js
import axios from 'axios';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [oxygenLevels, setOxygenLevels] = useState({});
  const [predictedLevels, setPredictedLevels] = useState({});
  const navigate = useNavigate();
  const FETCH_INTERVAL = 1000; // 10 seconds
  const HOUR_LIMIT = 60 / 2; // number of 10-second intervals in 2 mins

  const intervalsRef = useRef({});

  useEffect(() => {
    const fetchPatients = async () => {
      const response = await fetch('http://localhost:5000/api/patients');
      const data = await response.json();
      setPatients(data);

      // Fetch live oxygen level for each patient
      data.forEach(patient => {
        if (!intervalsRef.current[patient.patientId]) {
          fetchOxygenLevel(patient.patientId);
          intervalsRef.current[patient.patientId] = setInterval(() => fetchOxygenLevel(patient.patientId), FETCH_INTERVAL);
        }
      });
    };

    const fetchOxygenLevel = async (patientId) => {
      try {
        const response = await axios.get('https://api.thingspeak.com/channels/2665187/feeds.json?api_key=ICI5E0LU5026E7TH&results=10')

        // console.log("current oxygen level", response.data.feeds[0].field3);
        const oxygenLevel = response.data.feeds[[Math.floor(Math.random()*response.data.feeds.length)]].field3; // Simulated live oxygen level

        // console.log("required oxygen level", oxygenLevel);
        const predictedLevel = (oxygenLevel * (1 + (Math.random() * 0.05 - 0.025))).toFixed(2); // Simulated predicted level

        setOxygenLevels(prevState => {
          const updatedLevels = prevState[patientId] || [];
          if (updatedLevels.length >= HOUR_LIMIT) {
            updatedLevels.shift();
          }
          const newDataPoint = {
            time: new Date().toLocaleTimeString(),
            value: oxygenLevel
          };
          return {
            ...prevState,
            [patientId]: [...updatedLevels, newDataPoint]
          };
        });

        setPredictedLevels(prevState => {
          const updatedLevels = prevState[patientId] || [];
          if (updatedLevels.length >= HOUR_LIMIT) {
            updatedLevels.shift();
          }
          const newPredictedPoint = {
            time: new Date().toLocaleTimeString(),
            value: predictedLevel
          };
          return {
            ...prevState,
            [patientId]: [...updatedLevels, newPredictedPoint]
          };
        });
      } catch (error) {
        console.error("Error fetching oxygen level:", error);
      }
    };

    fetchPatients();

    return () => {
      Object.keys(intervalsRef.current).forEach(patientId => clearInterval(intervalsRef.current[patientId]));
    };
  }, []);

  const getChartData = (patientId, type) => {
    const dataPoints = type === 'actual' ? oxygenLevels[patientId] || [] : predictedLevels[patientId] || [];
    return {
      labels: dataPoints.map((point) => point.time),
      datasets: [{
        label: type === 'actual' ? 'Actual Oxygen Level (%)' : 'Predicted Oxygen Level (%)',
        data: dataPoints.map((point) => point.value),
        fill: false,
        borderColor: type === 'actual' ? 'black' : 'blue',
        tension: 0.1
      }]
    };
  };

  const getCardColor = (oxygenLevel) => {
    if (oxygenLevel < 81 || oxygenLevel > 90) {
      return 'rgba(255, 0, 0, 0.5)'; // Red with 50% opacity
    } else if (oxygenLevel < 87) {
      return 'rgba(255, 255, 0, 0.5)'; // Yellow with 50% opacity
    } else {
      return 'rgba(0, 255, 0, 0.5)'; // Green with 50% opacity
    }
  };

  const handlePatientClick = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  const getUpcomingTimes = () => {
    const times = [];
    const currentTime = new Date();
    for (let i = 0; i < patients.length; i++) {
      const newTime = new Date(currentTime.getTime() + i * 15 * 60000);
      times.push(newTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
    return times;
  };

  const upcomingTimes = getUpcomingTimes();

  return (
    <div className="doctor-dashboard-container">
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">
            <FaHome /> Home
          </Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link href="#profile">My Profile</Nav.Link>
            <Nav.Link href="#logout">
              <FaSignOutAlt /> Logout
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <div className="container">
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Upcoming Visiting Schedule</Card.Title>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Upcoming Visiting Time</th>
                  <th>Doctors's Name</th>
                  <th>Allocated Patient</th>
                  <th>Room No.</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient, index) => (
                  <tr key={index}>
                    <td>{upcomingTimes[index]}</td>
                    <td>{patient.age}</td>
                    <td>{patient.name}</td>
                    <td>{patient.roomNo}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
        <h2 className="my-4">Patients Live SPO2</h2>
        <Row>
          {patients.map((patient) => {
            const latestOxygenLevel = oxygenLevels[patient.patientId]?.slice(-1)[0]?.value;
            return (
              <Col key={patient.id} md={12} className="mb-4">
                <Card className="patient-card" style={{ backgroundColor: latestOxygenLevel ? getCardColor(latestOxygenLevel) : 'white' }}
                onClick={() => handlePatientClick(patient.patientId)} >  
                  <Card.Body>
                    <Card.Title>{patient.name}</Card.Title>
                    <Card.Text>ID: {patient.patientId}</Card.Text>
                    <Row>
                      <Col md={6}>
                        <h5>Actual Oxygen Level</h5>
                        <Line data={getChartData(patient.patientId, 'actual')} />
                      </Col>
                      <Col md={6}>
                        <h5>Predicted Oxygen Level</h5>
                        <Line data={getChartData(patient.patientId, 'predicted')} />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
        <Card>
          <Card.Body>
            <Card.Title>Chat with Staff</Card.Title>
            <Button variant="primary">Start Chat</Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;