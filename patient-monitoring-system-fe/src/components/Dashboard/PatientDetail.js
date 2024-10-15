import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar, Nav, Container, Card, Row, Col } from 'react-bootstrap';
import { FaHome, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const PatientDetail = () => {
  const { patientId } = useParams();
  const [patientData, setPatientData] = useState({});
  const [medicationData, setMedicationData] = useState([]);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        // Replace with your actual API request for patient details
        const response = await fetch(`http://localhost:5000/api/patient/${patientId}`);
        const data = await response.json();
        setPatientData(data);
      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    };
    const fetchMedicationDetails = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/medications/${patientId}`);
          const data = await response.json();
          setMedicationData(data.medications);
        } catch (error) {
          console.error("Error fetching medication details:", error);
        }
      };

    fetchPatientDetails();
    fetchMedicationDetails();
  }, [patientId]);

  return (
    <div className="patient-detail-container">
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

      <Container className="mt-5">
        {/*patient detail */}
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-lg">
              <Card.Header className="text-center bg-primary text-white">
                <FaUserCircle size={50} className="mb-3" />
                <h3>{patientData.name}</h3>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6} className="mb-3">
                    <Card.Text>
                      <strong>Patient ID:</strong> {patientData.patientId}
                    </Card.Text>
                    <Card.Text>
                      <strong>Age:</strong> {patientData.age}
                    </Card.Text>
                    <Card.Text>
                      <strong>Gender:</strong> {patientData.gender}
                    </Card.Text>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Card.Text>
                      <strong>Condition:</strong> {patientData.condition}
                    </Card.Text>
                    <Card.Text>
                      <strong>Room Number:</strong> {patientData.roomNo}
                    </Card.Text>
                    <Card.Text>
                      <strong>Current Oxygen Level:</strong> {patientData.oxygenLevel}%
                    </Card.Text>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Medication */}
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-lg mt-4">
              <Card.Body>
                <h4>Medication Schedule</h4>
                <table className="table table-striped table-bordered table-hover mt-3">
                  <thead>
                    <tr>
                      <th>Medication Name</th>
                      <th>Morning (8:00 AM)</th>
                      <th>Afternoon (12:00 PM)</th>
                      <th>Evening (6:00 PM)</th>
                      <th>Night (10:00 PM)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicationData.map((medication, index) => (
                      <tr key={index}>
                        <td>{medication.name}</td>
                        <td>{medication.morning}</td>
                        <td>{medication.afternoon}</td>
                        <td>{medication.evening}</td>
                        <td>{medication.night}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PatientDetail;