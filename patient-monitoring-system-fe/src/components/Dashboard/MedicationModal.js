import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const MedicationModal = ({ show, handleClose, medication, setMedication, handleSave, title }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="medicationName">
            <Form.Label>Medication Name</Form.Label>
            <Form.Control
              type="text"
              value={medication.name}
              onChange={(e) => setMedication({ ...medication, name: e.target.value })}
              placeholder="Enter medication name"
            />
          </Form.Group>
          <Form.Group controlId="morning">
            <Form.Label>Morning (8:00 AM)</Form.Label>
            <Form.Control
              type="text"
              value={medication.morning}
              onChange={(e) => setMedication({ ...medication, morning: e.target.value })}
              placeholder="Enter dosage for morning"
            />
          </Form.Group>
          <Form.Group controlId="afternoon">
            <Form.Label>Afternoon (12:00 PM)</Form.Label>
            <Form.Control
              type="text"
              value={medication.afternoon}
              onChange={(e) => setMedication({ ...medication, afternoon: e.target.value })}
              placeholder="Enter dosage for afternoon"
            />
          </Form.Group>
          <Form.Group controlId="evening">
            <Form.Label>Evening (6:00 PM)</Form.Label>
            <Form.Control
              type="text"
              value={medication.evening}
              onChange={(e) => setMedication({ ...medication, evening: e.target.value })}
              placeholder="Enter dosage for evening"
            />
          </Form.Group>
          <Form.Group controlId="night">
            <Form.Label>Night (10:00 PM)</Form.Label>
            <Form.Control
              type="text"
              value={medication.night}
              onChange={(e) => setMedication({ ...medication, night: e.target.value })}
              placeholder="Enter dosage for night"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={handleSave}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MedicationModal;