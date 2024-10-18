import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MedicationSection from './MedicationSection';
import TestSection from './TestSection'

const PatientDetail = () => {
  const { patientId } = useParams();
  const [patientDetails, setPatientDetails] = useState({});
  const [medicationData, setMedicationData] = useState([]);
  const [testsData, setTestsData] = useState([]);
  const [latestPrescription, setLatestPrescription] = useState(null);

  useEffect(() => {
    // Fetch all patient details, including medications and tests
    axios.get(`http://localhost:5000/api/patients/${patientId}`)
      .then(response => {
        setPatientDetails(response.data);
        setMedicationData(response.data.medications);
        setLatestPrescription(response.data.medications[response.data.medications.length - 1]); // Assuming the latest is the last one
        setTestsData(response.data.tests);
        console.log('patient details:', testsData);
      })
      .catch(error => {
        console.error('Error fetching patient details:', error);
      });
  }, [patientId]);
  
  return (
    <>
      {/* Patient Details */}
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg mt-4">
            <Card.Body>
              <h4>Patient Details</h4>
              <p><strong>Age:</strong> {patientDetails.age}</p>
              <p><strong>Gender:</strong> {patientDetails.gender}</p>
              <p><strong>Condition:</strong> {patientDetails.condition}</p>
              <p><strong>Room No:</strong> {patientDetails.roomNo}</p>
              <p><strong>Oxygen Level:</strong> {patientDetails.oxygenLevel}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Latest Prescription */}
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg mt-4">
            <Card.Body>
              <h4>Latest Prescription</h4>
              {latestPrescription ? (
                <p>{`Medication: ${latestPrescription.name} - Morning: ${latestPrescription.morning}, Afternoon: ${latestPrescription.afternoon}, Evening: ${latestPrescription.evening}, Night: ${latestPrescription.night}`}</p>
              ) : (
                <p>No latest prescription available</p>
              )}
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
