// src/components/DoctorDashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Navbar, Nav, Container, Table, Button } from 'react-bootstrap';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import 'chart.js/auto';  // Needed for Chart.js
import axios from 'axios';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [oxygenLevels, setOxygenLevels] = useState({});
  const [predictedLevels, setPredictedLevels] = useState({});
  const [criticalAlert, setCriticalAlert] = useState(null);
  const navigate = useNavigate();
  const FETCH_INTERVAL = 16000; // Fetch interval in milliseconds (16 seconds to allow some buffer)
  const HOUR_LIMIT = 12; // Assuming data points are collected every 15 seconds for a 3-minute window

  const intervalsRef = useRef({});

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/patients');
        const data = await response.json();
        data.sort((a, b) => a.priority - b.priority);
        setPatients(data);

        // Fetch live oxygen level for each patient
        data.forEach(patient => {
          if (!intervalsRef.current[patient.patientId]) {
            fetchOxygenLevel(patient.patientId, patient.channelId, patient.readAPI);
            intervalsRef.current[patient.patientId] = setInterval(() => fetchOxygenLevel(patient.patientId, patient.channelId, patient.readAPI), FETCH_INTERVAL);
          }
        });
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    const fetchOxygenLevel = async (patientId, channelId, readAPI) => {
      try {
        const response = await axios.get(`https://api.thingspeak.com/channels/${channelId}/feeds.json`, {
          params: {
            api_key: readAPI,
            results: 1, // Fetch only the latest data point
          },
        });
        const feed = response.data.feeds[0]; // Get the latest data point
    
        if (feed) {
          const oxygenLevel = parseFloat(feed.field1);
          const createdAt = feed.created_at;

          if (oxygenLevel) {
            setOxygenLevels((prevState) => {
              const updatedLevels = prevState[patientId] || [];
              if (updatedLevels.length >= HOUR_LIMIT) {
                updatedLevels.shift(); // Remove oldest data point if limit is reached
              }
              const newDataPoint = {
                time: new Date(createdAt).toLocaleTimeString(),
                value: oxygenLevel,
              };
              return {
                ...prevState,
                [patientId]: [...updatedLevels, newDataPoint],
              };
            });

            // Fetch predictions from the backend
            fetchPredictions(patientId, channelId, readAPI, new Date(createdAt));

            // Check for critical oxygen level and set alert
            checkForCriticalAlert(patientId, oxygenLevel);
          }
        }
      } catch (error) {
        console.error('Error fetching oxygen level:', error);
      }
    };

    const fetchPredictions = async (patientId, channelId, readAPI, lastRealTime) => {
      try {
        const response = await axios.post('http://localhost:5000/api/predictOxygen', {
          channelId,
          readApiKey: readAPI
        });
        const predictions = response.data;

        console.log("predictions", predictions);

        setPredictedLevels((prevState) => {
          const updatedLevels = [];
          predictions.forEach((value, index) => {
            const predictionTime = new Date(lastRealTime.getTime() + (index + 1) * 16000);
            updatedLevels.push({
              time: predictionTime.toLocaleTimeString(),
              value: value,
            });
          });
          return {
            ...prevState,
            [patientId]: updatedLevels,
          };
        });
      } catch (error) {
        console.error('Error fetching predictions:', error);
      }
    };

    const checkForCriticalAlert = (patientId, oxygenLevel) => {
      if (oxygenLevel < 89) {
        setCriticalAlert(`Critical oxygen level detected for patient ${patientId}: ${oxygenLevel}%`);
        setTimeout(() => {
          setCriticalAlert(null);
        }, 10000); // Clear alert after 10 seconds
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

  const getCardColor = (patient) => {
    const latestOxygenLevel = oxygenLevels[patient.patientId]?.slice(-1)[0]?.value;
    const predictedValues = predictedLevels[patient.patientId]?.map(point => point.value) || [];

    // Determine zones based on age group
    let normalZone, riskyZone, criticalZone;
    if (patient.age <= 1) {
      normalZone = [95, 100];
      riskyZone = [90, 94];
      criticalZone = [0, 89];
    } else if (patient.age <= 12) {
      normalZone = [95, 100];
      riskyZone = [90, 94];
      criticalZone = [0, 89];
    } else if (patient.age <= 18) {
      normalZone = [95, 100];
      riskyZone = [90, 94];
      criticalZone = [0, 89];
    } else if (patient.age <= 64) {
      normalZone = [95, 100];
      riskyZone = [90, 94];
      criticalZone = [0, 89];
    } else {
      normalZone = [94, 98];
      riskyZone = [88, 93];
      criticalZone = [0, 87];
    }

    // Check the actual and predicted oxygen levels
    const isCritical = latestOxygenLevel <= criticalZone[1] || predictedValues.some(value => value <= criticalZone[1]);
    const isRisky = latestOxygenLevel >= riskyZone[0] && latestOxygenLevel <= riskyZone[1] || predictedValues.some(value => value >= riskyZone[0] && value <= riskyZone[1]);

    if (isCritical) {
      return 'rgba(255, 0, 0, 0.5)'; // Red with 50% opacity
    } else if (isRisky) {
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const upcomingTimes = getUpcomingTimes();

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

      <div className="container">
        {criticalAlert && <Alert variant="danger">{criticalAlert}</Alert>}
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
            return (
              <Col key={patient.patientId} md={12} className="mb-4">
                <Card className="patient-card" style={{ backgroundColor: getCardColor(patient) }}
                  onClick={() => handlePatientClick(patient.patientId)}>
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
