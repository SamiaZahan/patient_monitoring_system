import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar, Nav, Container, Card, Row, Col, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FaHome, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const PatientDetail = () => {
  const { patientId } = useParams();
  const [patientData, setPatientData] = useState({});
  const [medicationData, setMedicationData] = useState([]);
  const [showModal, setShowModal] = useState({ add: false, update: false });
  const [newMedication, setNewMedication] = useState({ name: '', morning: '', afternoon: '', evening: '', night: '' });
  const [selectedMedicationIndex, setSelectedMedicationIndex] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  const fetchPatientDetails = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/patient/${patientId}`);
      if (!response.ok) throw new Error('Failed to fetch patient details');
      const data = await response.json();
      setPatientData(data);
    } catch (error) {
      showAlert('Error fetching patient details: ' + error.message, 'danger');
    }
  }, [patientId]);

  const fetchMedicationDetails = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/medications/${patientId}`);
      if (!response.ok) throw new Error('Failed to fetch medication details');
      const data = await response.json();
      setMedicationData(data.medications);
    } catch (error) {
      showAlert('Error fetching medication details: ' + error.message, 'danger');
    }
  }, [patientId]);

  useEffect(() => {
    fetchPatientDetails();
    fetchMedicationDetails();
  }, [fetchPatientDetails, fetchMedicationDetails]);

  const handleAddMedication = () => {
    setShowModal({ add: true, update: false });
    setNewMedication({ name: '', morning: '', afternoon: '', evening: '', night: '' });
  };

  const handleUpdateMedication = (index) => {
    setSelectedMedicationIndex(index);
    setNewMedication(medicationData[index]);
    setShowModal({ add: false, update: true });
  };

  const handleSaveMedication = async (isUpdate) => {
    const url = isUpdate
      ? `http://localhost:5000/api/medications/${patientId}/${medicationData[selectedMedicationIndex]._id}`
      : `http://localhost:5000/api/medications/${patientId}`;
    const method = isUpdate ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMedication),
      });
      if (!response.ok) throw new Error('Failed to save medication');

      const savedMedication = await response.json();
      if (isUpdate) {
        const updatedMedications = [...medicationData];
        updatedMedications[selectedMedicationIndex] = savedMedication;
        setMedicationData(updatedMedications);
      } else {
        setMedicationData([...medicationData, savedMedication]);
      }
      closeModal();
      showAlert(isUpdate ? 'Medication updated successfully' : 'Medication added successfully', 'success');
    } catch (error) {
      showAlert('Error saving medication: ' + error.message, 'danger');
    }
  };

  const handleDeleteMedication = async (index) => {
    try {
      const response = await fetch(`http://localhost:5000/api/medications/${patientId}/${medicationData[index]._id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete medication');

      setMedicationData(medicationData.filter((_, i) => i !== index));
      showAlert('Medication deleted successfully', 'success');
    } catch (error) {
      showAlert('Error deleting medication: ' + error.message, 'danger');
    }
  };

  const closeModal = () => {
    setShowModal({ add: false, update: false });
    setSelectedMedicationIndex(null);
  };

  const handleInputChange = (field, value) => {
    setNewMedication({ ...newMedication, [field]: value });
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
  };

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
        {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-lg">
              <Card.Header className="text-center bg-primary text-white">
                <FaUserCircle size={50} className="mb-3" />
                <h3>{patientData.name}</h3>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
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
                  <Col md={6}>
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

        <Row className="justify-content-center mt-4">
          <Col md={8}>
            <Card className="shadow-lg">
              <Card.Body>
                <h4>Medication Schedule</h4>
                <Button variant="primary" onClick={handleAddMedication} className="mb-3">Add Medication</Button>
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Morning</th>
                      <th>Afternoon</th>
                      <th>Evening</th>
                      <th>Night</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicationData.map((med, index) => (
                      <tr key={med._id}>
                        <td>{med.name}</td>
                        <td>{med.morning}</td>
                        <td>{med.afternoon}</td>
                        <td>{med.evening}</td>
                        <td>{med.night}</td>
                        <td>
                          <Button variant="warning" onClick={() => handleUpdateMedication(index)} className="mr-2">Update</Button>
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

        <Modal show={showModal.add || showModal.update} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>{showModal.add ? 'Add Medication' : 'Update Medication'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {['name', 'morning', 'afternoon', 'evening', 'night'].map((field) => (
                <Form.Group key={field} controlId={field}>
                  <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                  <Form.Control
                    type="text"
                    value={newMedication[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={`Enter ${field}`}
                  />
                </Form.Group>
              ))}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={() => handleSaveMedication(showModal.update)}>
              {showModal.add ? 'Add' : 'Update'} Medication
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default PatientDetail;
