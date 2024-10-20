import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Navbar, Container, Nav } from 'react-bootstrap';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import MedicationSection from './MedicationSection';
import TestSection from './TestSection'

const PatientDetail = () => {
  const { patientId } = useParams();
  const [patientDetails, setPatientDetails] = useState({});
  const [medicationData, setMedicationData] = useState([]);
  const [testsData, setTestsData] = useState([]);
  const [priority, setPriority] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all patient details, including medications and tests
    axios.get(`http://localhost:5000/api/patients/${patientId}`)
      .then(response => {
        setPatientDetails(response.data);
        setMedicationData(response.data.medications);
        setTestsData(response.data.tests);
        console.log('patient details:', testsData);
      })
      .catch(error => {
        console.error('Error fetching patient details:', error);
      });
  }, [patientId]);


  const handleUpdatePriority = async () => {
    if (!priority || isNaN(priority)) {
      alert('Please enter a valid priority number');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/patients/${patientId}/priority`, {
        priority: parseInt(priority, 10)
      });
      alert(response.data.message);
      setPriority('');
      setPatientDetails(prevPatients => Array.isArray(prevPatients) ? prevPatients.map(patient => patient.patientId === patientId ? { ...patient, priority: parseInt(priority, 10) } : patient) : prevPatients);
    } catch (error) {
      console.error('Error updating priority:', error);
      alert('Error updating priority');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
       <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/doctor-dashboard">
            <FaHome /> Home
          </Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link href="../doctor-profile">Profile</Nav.Link>
            <Nav.Link onClick={handleLogout} className="w-100">
              <FaSignOutAlt /> Logout
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Patient Details */}
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg mt-4">
            <Card.Body>
              <h4>Patient Details</h4>
              <p><strong>Name:</strong> {patientDetails.name}</p>
              <p><strong>Age:</strong> {patientDetails.age}</p>
              <p><strong>Gender:</strong> {patientDetails.gender}</p>
              <p><strong>Condition:</strong> {patientDetails.condition}</p>
              <p><strong>Room No:</strong> {patientDetails.roomNo}</p>
              <p><strong>Oxygen Level:</strong> {patientDetails.oxygenLevel}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/*  Prioroty */}
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg mt-4">
            <Card.Body>
              <h4>Prioroty: {patientDetails.priority}</h4>
              <div>
                <input
                  type="number"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  placeholder="Enter new priority"
                />
                <button onClick={handleUpdatePriority}>Update Priority</button>
              </div>            
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Medication Section */}
      <Row className="justify-content-center">
        <Col md={8}>
          <MedicationSection
            patientId={patientId}
            medicationData={medicationData}
            setMedicationData={setMedicationData}
          />
        </Col>
      </Row>

      {/* Tests */}
      <Row className="justify-content-center">
        <Col md={8}>
          <TestSection
            patientId={patientId}
            testsData={testsData}
            setTestsnData={setTestsData}
          />
        </Col>
      </Row>
    </>
  );
};

export default PatientDetail;
