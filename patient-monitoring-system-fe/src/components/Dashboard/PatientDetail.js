import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar, Nav, Container, Card, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { FaHome, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const PatientDetail = () => {
  const { patientId } = useParams();
  const [patientData, setPatientData] = useState({});
  const [medicationData, setMedicationData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newMedication, setNewMedication] = useState({ name: '', morning: '', afternoon: '', evening: '', night: '' });
  const [selectedMedicationIndex, setSelectedMedicationIndex] = useState(null);

  const handleAddMedication = () => {
    setShowAddModal(true);
  };

  const handleUpdateMedication = (index) => {
    setSelectedMedicationIndex(index);
    setNewMedication(medicationData[index]);
    setShowUpdateModal(true);
  };

  const handleSaveNewMedication = async () => {
    try {
      // API request to add a new medication
      const response = await fetch(`http://localhost:5000/api/medications/${patientId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMedication),
      });
      if (response.ok) {
        const addedMedication = await response.json();
        setMedicationData([...medicationData, addedMedication]);
        setNewMedication({ name: '', morning: '', afternoon: '', evening: '', night: '' });
        setShowAddModal(false);
      } else {
        console.error("Failed to add medication");
      }
    } catch (error) {
      console.error("Error adding medication:", error);
    }
  };

  const handleSaveUpdatedMedication = async () => {
    try {
      // API request to update medication
      const response = await fetch(`http://localhost:5000/api/medications/${patientId}/${medicationData[selectedMedicationIndex]._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMedication),
      });
      if (response.ok) {
        const updatedMedications = [...medicationData];
        updatedMedications[selectedMedicationIndex] = newMedication;
        setMedicationData(updatedMedications);
        setNewMedication({ name: '', morning: '', afternoon: '', evening: '', night: '' });
        setShowUpdateModal(false);
      } else {
        console.error("Failed to update medication");
      }
    } catch (error) {
      console.error("Error updating medication:", error);
    }
  };

  const handleDeleteMedication = async (index) => {
    try {
      // API request to delete medication
      const response = await fetch(`http://localhost:5000/api/medications/${patientId}/${medicationData[index]._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const updatedMedications = medicationData.filter((_, i) => i !== index);
        setMedicationData(updatedMedications);
      } else {
        console.error("Failed to delete medication");
      }
    } catch (error) {
      console.error("Error deleting medication:", error);
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
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

        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-lg mt-4">
              <Card.Body>
                <h4>Medication Schedule</h4>
                <Button className="mb-3" variant="primary" onClick={handleAddMedication}>Add Medication</Button>
                <table className="table table-striped table-bordered table-hover mt-3">
                  <thead>
                    <tr>
                      <th>Medication Name</th>
                      <th>Morning (8:00 AM)</th>
                      <th>Afternoon (12:00 PM)</th>
                      <th>Evening (6:00 PM)</th>
                      <th>Night (10:00 PM)</th>
                      <th>Actions</th>
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
                        <td>
                          <Button variant="warning" onClick={() => handleUpdateMedication(index)} className="m-2">Update</Button>
                          <Button variant="danger" onClick={() => handleDeleteMedication(index)}>Delete</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Modal show={showAddModal} onHide={handleCloseAddModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Medication</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="medicationName">
                <Form.Label>Medication Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                  placeholder="Enter medication name"
                />
              </Form.Group>
              <Form.Group controlId="morning">
                <Form.Label>Morning (8:00 AM)</Form.Label>
                <Form.Control
                  type="text"
                  value={newMedication.morning}
                  onChange={(e) => setNewMedication({ ...newMedication, morning: e.target.value })}
                  placeholder="Enter dosage for morning"
                />
              </Form.Group>
              <Form.Group controlId="afternoon">
                <Form.Label>Afternoon (12:00 PM)</Form.Label>
                <Form.Control
                  type="text"
                  value={newMedication.afternoon}
                  onChange={(e) => setNewMedication({ ...newMedication, afternoon: e.target.value })}
                  placeholder="Enter dosage for afternoon"
                />
              </Form.Group>
              <Form.Group controlId="evening">
                <Form.Label>Evening (6:00 PM)</Form.Label>
                <Form.Control
                  type="text"
                  value={newMedication.evening}
                  onChange={(e) => setNewMedication({ ...newMedication, evening: e.target.value })}
                  placeholder="Enter dosage for evening"
                />
              </Form.Group>
              <Form.Group controlId="night">
                <Form.Label>Night (10:00 PM)</Form.Label>
                <Form.Control
                  type="text"
                  value={newMedication.night}
                  onChange={(e) => setNewMedication({ ...newMedication, night: e.target.value })}
                  placeholder="Enter dosage for night"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveNewMedication}>Save Medication</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
          <Modal.Header closeButton>
            <Modal.Title>Update Medication</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="medicationName">
                <Form.Label>Medication Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                  placeholder="Enter medication name"
                />
              </Form.Group>
              <Form.Group controlId="morning">
                <Form.Label>Morning (8:00 AM)</Form.Label>
                <Form.Control
                  type="text"
                  value={newMedication.morning}
                  onChange={(e) => setNewMedication({ ...newMedication, morning: e.target.value })}
                  placeholder="Enter dosage for morning"
                />
              </Form.Group>
              <Form.Group controlId="afternoon">
                <Form.Label>Afternoon (12:00 PM)</Form.Label>
                <Form.Control
                  type="text"
                  value={newMedication.afternoon}
                  onChange={(e) => setNewMedication({ ...newMedication, afternoon: e.target.value })}
                  placeholder="Enter dosage for afternoon"
                />
              </Form.Group>
              <Form.Group controlId="evening">
                <Form.Label>Evening (6:00 PM)</Form.Label>
                <Form.Control
                  type="text"
                  value={newMedication.evening}
                  onChange={(e) => setNewMedication({ ...newMedication, evening: e.target.value })}
                  placeholder="Enter dosage for evening"
                />
              </Form.Group>
              <Form.Group controlId="night">
                <Form.Label>Night (10:00 PM)</Form.Label>
                <Form.Control
                  type="text"
                  value={newMedication.night}
                  onChange={(e) => setNewMedication({ ...newMedication, night: e.target.value })}
                  placeholder="Enter dosage for night"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseUpdateModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveUpdatedMedication}>Update Medication</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default PatientDetail;
