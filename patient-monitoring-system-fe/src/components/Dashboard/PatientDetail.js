import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from 'react-bootstrap';

const PatientDetail = () => {
  const { patientId } = useParams();
  const [patientData, setPatientData] = useState({});
  const [oxygenLevel, setOxygenLevel] = useState(null);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      console.log(patientId)

      // Replace with your actual API request for patient details
      const response = await fetch(`http://localhost:5000/api/patient/${patientId}`);
      const data = await response.json();
      console.log("data:",data)

      setPatientData(data);
      console.log(patientData)
    };

    fetchPatientDetails();
  }, [patientId]);

  useEffect(() => {
    // Fetch live oxygen data from ThingSpeak (need to replace with our channel's ID and API Key)
    const fetchOxygenLevel = async () => {
      const response = await fetch(`https://api.thingspeak.com/channels/9/fields/1.json?api_key=ZV8T6GWVG9IVFO6F&results=1`);
      const data = await response.json();
      if (data.feeds && data.feeds.length > 0) {
        let oxygenLevel = data.feeds[0].field1;
        oxygenLevel = (oxygenLevel + (Math.random() * 10 - 5)).toFixed(2);        
        setOxygenLevel(oxygenLevel);
      }
    };

    const interval = setInterval(fetchOxygenLevel, 5000); // Fetch data every 5 seconds
    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  return (
    <div className="container">
      <h2>Patient Details</h2>
      <Card>
        <Card.Body>
          <Card.Title>{patientData.name}</Card.Title>
          <Card.Text>
            Age: {patientData.age} <br />
            Condition: {patientData.condition}
          </Card.Text>
        </Card.Body>
      </Card>

      <div className="oxygen-level">
        <h3>Live Oxygen Level</h3>
        {oxygenLevel ? <p>{oxygenLevel} %</p> : <p>Fetching oxygen level...</p>}
      </div>
    </div>
  );
};

export default PatientDetail;
