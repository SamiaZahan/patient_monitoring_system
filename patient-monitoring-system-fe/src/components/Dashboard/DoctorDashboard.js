import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import 'chart.js/auto';  // Needed for Chart.js

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [oxygenLevels, setOxygenLevels] = useState({});
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
        const oxygenLevel = (90 + (Math.random() * 10 - 5)).toFixed(2); // Simulated live oxygen level

        setOxygenLevels(prevState => {
          const updatedLevels = prevState[patientId] || [];

          // Limit the number of data points to the last 1 hour
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
      } catch (error) {
        console.error("Error fetching oxygen level:", error);
      }
    };

    fetchPatients();

    return () => {
      Object.keys(intervalsRef.current).forEach(patientId => clearInterval(intervalsRef.current[patientId]));
    };
  }, []);

  const handlePatientClick = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  const getChartData = (patientId) => {
    const dataPoints = oxygenLevels[patientId] || [];
    return {
      labels: dataPoints.map((point) => point.time),
      datasets: [{
        label: 'Oxygen Level (%)',
        data: dataPoints.map((point) => point.value),
        fill: false,
        borderColor: 'black',
        tension: 0.1
      }]
    };
  };

  const getCardColor = (oxygenLevel) => {
    if (oxygenLevel < 81 || oxygenLevel > 90 ) {
      return 'rgba(255, 0, 0, 0.5)'; // Red with 50% opacity
    } else if (oxygenLevel < 87) {
      return 'rgba(255, 255, 0, 0.5)'; // Yellow with 50% opacity
    } else {
      return 'rgba(0, 255, 0, 0.5)'; // Green with 50% opacity
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Registered Patients</h2>
      <Row>
        {patients.map((patient) => {
          const latestOxygenLevel = oxygenLevels[patient.patientId]?.slice(-1)[0]?.value;
          const cardColor = latestOxygenLevel ? getCardColor(latestOxygenLevel) : 'white'; // Default to white if no data

          return (
            <Col key={patient.id} md={6} className="mb-4">
              <Card 
                onClick={() => handlePatientClick(patient.patientId)} 
                className="patient-card" 
                style={{ cursor: 'pointer', backgroundColor: cardColor}}
              >
                <Card.Body>
                  <Card.Title>{patient.name}</Card.Title>
                  <Card.Text>ID: {patient.patientId}</Card.Text>
                  <Card.Text>
                    Oxygen Level: {latestOxygenLevel || <Spinner animation="border" size="sm" />}%
                  </Card.Text>

                  {/* Line Graph for Oxygen Levels */}
                  <Line data={getChartData(patient.patientId)} />
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default DoctorDashboard;
