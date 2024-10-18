// TestSection.js
import React, { useState } from 'react';
import { Button, Card, Table, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const TestSection = ({ patientId, testsData, setTestsData }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newTest, setNewTest] = useState({ name: '', todoDate: '' });
  const [selectedTestIndex, setSelectedTestIndex] = useState(null);

  const handleAddTest = () => {
    setShowAddModal(true);
  };

  const handleUpdateTest = (index) => {
    setSelectedTestIndex(index);
    setNewTest(testsData[index]);
    setShowUpdateModal(true);
  };

  const handleSaveNewTest = () => {
    const testWithDefaults = { ...newTest, completionDate: 'Pending', report: 'Unavailable' };
    axios.post(`http://localhost:5000/api/tests/${patientId}`, testWithDefaults)
      .then(response => {
        setTestsData([...testsData, response.data]);
        setNewTest({ name: '', todoDate: '' });
        setShowAddModal(false);
      })
      .catch(error => {
        console.error('Error adding test:', error);
        setShowAddModal(false);
      });
  };

  const handleSaveUpdatedTest = () => {
    axios.put(`http://localhost:5000/api/tests/${patientId}/${selectedTestIndex}`, newTest)
      .then(response => {
        const updatedTests = [...testsData];
        updatedTests[selectedTestIndex] = response.data;
        setTestsData(updatedTests);
        setNewTest({ name: '', todoDate: '' });
        setShowUpdateModal(false);
      })
      .catch(error => {
        console.error('Error updating test:', error);
        setShowUpdateModal(false);

      });
  };

  const handleDeleteTest = (index) => {
    axios.delete(`http://localhost:5000/api/tests/${patientId}/${index}`)
      .then(() => {
        const updatedTests = testsData.filter((_, i) => i !== index);
        setTestsData(updatedTests);
      })
      .catch(error => {
        console.error('Error deleting test:', error);
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
        <h4>Test Schedule</h4>
        <Button className="mb-3" variant="primary" onClick={handleAddTest}>Add Test</Button>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Test Name</th>
              <th>To-Do Date</th>
              <th>Completion Date</th>
              <th>Report</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testsData.map((test, index) => (
              <tr key={index}>
                <td>{test.name}</td>
                <td>{test.todoDate}</td>
                <td>{test.completionDate}</td>
                <td>{test.report !== 'Unavailable' ? <a href={test.report} target="_blank" rel="noopener noreferrer">View Report</a> : 'Not available'}</td>
                <td>
                  <Button variant="warning" onClick={() => handleUpdateTest(index)} className="mr-2">Update</Button>
                  <Button variant="danger" onClick={() => handleDeleteTest(index)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>

      {/* Add Test Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTestName">
              <Form.Label>Test Name</Form.Label>
              <Form.Control
                type="text"
                value={newTest.name}
                onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                placeholder="Enter test name"
              />
            </Form.Group>
            <Form.Group controlId="formTodoDate">
              <Form.Label>To-Do Date</Form.Label>
              <Form.Control
                type="date"
                value={newTest.todoDate}
                onChange={(e) => setNewTest({ ...newTest, todoDate: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveNewTest}>Save Test</Button>
        </Modal.Footer>
      </Modal>

      {/* Update Test Modal */}
      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTestName">
              <Form.Label>Test Name</Form.Label>
              <Form.Control
                type="text"
                value={newTest.name}
                onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                placeholder="Enter test name"
              />
            </Form.Group>
            <Form.Group controlId="formTodoDate">
              <Form.Label>To-Do Date</Form.Label>
              <Form.Control
                type="date"
                value={newTest.todoDate}
                onChange={(e) => setNewTest({ ...newTest, todoDate: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formCompletionDate">
              <Form.Label>Completion Date</Form.Label>
              <Form.Control
                type="date"
                value={newTest.completionDate === 'Pending' ? '' : newTest.completionDate}
                onChange={(e) => setNewTest({ ...newTest, completionDate: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formReportLink">
              <Form.Label>Report Link</Form.Label>
              <Form.Control
                type="text"
                value={newTest.report === 'Unavailable' ? '' : newTest.report}
                onChange={(e) => setNewTest({ ...newTest, report: e.target.value })}
                placeholder="Enter report link"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdateModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveUpdatedTest}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default TestSection;
