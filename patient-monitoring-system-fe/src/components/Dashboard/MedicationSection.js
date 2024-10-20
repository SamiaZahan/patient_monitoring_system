// MedicationSection.js
import React, { useState } from 'react';
import { Button, Card, Table } from 'react-bootstrap';
import MedicationModal from './MedicationModal';
import axios from 'axios';

const MedicationSection = ({ patientId, medicationData, setMedicationData }) => {
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

  const handleSaveNewMedication = () => {
    axios.post(`http://localhost:5000/api/medications/${patientId}`, newMedication)
      .then(response => {
        setMedicationData([...medicationData, response.data]);
        setNewMedication({ name: '', morning: '', afternoon: '', evening: '', night: '' });
        setShowAddModal(false);
      })
      .catch(error => {
        console.error('Error adding medication:', error);
      });
  };

  const handleSaveUpdatedMedication = () => {
    axios.put(`http://localhost:5000/api/medications/${patientId}/${selectedMedicationIndex}`, newMedication)
      .then(response => {
        const updatedMedications = [...medicationData];
        updatedMedications[selectedMedicationIndex] = response.data;
        setMedicationData(updatedMedications);
        setNewMedication({ name: '', morning: '', afternoon: '', evening: '', night: '' });
        setShowUpdateModal(false);
      })
      .catch(error => {
        console.error('Error updating medication:', error);
      });
  };

  const handleDeleteMedication = (index) => {
    axios.delete(`http://localhost:5000/api/medications/${patientId}/${index}`)
      .then(() => {
        const updatedMedications = medicationData.filter((_, i) => i !== index);
        setMedicationData(updatedMedications);
      })
      .catch(error => {
        console.error('Error deleting medication:', error);
      });
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  return (
    <Card className="shadow-lg mt-4">
      <Card.Body>
        <h4>Medication Schedule</h4>
        <Button className="mb-3" variant="primary" onClick={handleAddMedication}>Add Medication</Button>
        <Table striped bordered hover className="mt-3">
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
                  <Button variant="warning" onClick={() => handleUpdateMedication(index)} className="mr-2">Update</Button>
                  <Button variant="danger" onClick={() => handleDeleteMedication(index)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>

      {/* Add Medication Modal */}
      <MedicationModal
        show={showAddModal}
        handleClose={handleCloseAddModal}
        medication={newMedication}
        setMedication={setNewMedication}
        handleSave={handleSaveNewMedication}
        title="Add Medication"
      />

      {/* Update Medication Modal */}
      <MedicationModal
        show={showUpdateModal}
        handleClose={handleCloseUpdateModal}
        medication={newMedication}
        setMedication={setNewMedication}
        handleSave={handleSaveUpdatedMedication}
        title="Update Medication"
      />
    </Card>
  );
};

export default MedicationSection;
