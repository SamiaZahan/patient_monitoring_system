const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(express.json());
app.use(cors())
const port = 5000;
require('dotenv').config();

const Medication = require("./models/medication");
const mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s
})
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully!');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB Atlas:', error);
  });


// Routes
app.get('/api/patients', getPatients);
app.get('/api/patient/:id', getPatientById);
app.get('/api/medications/:patientId', getMedicationById )



// Functions
async function getPatients(req, res) {
  const patientsPath = path.join(__dirname, 'patients.json');
  fs.readFile(patientsPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading order.json file:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(JSON.parse(data));
  });
}

// Serve medication details from the JSON file
async function getMedicationById(req, res)  {
  // Define the "Get Medication by Patient ID" API endpoint
  try {
    const { patientId } = req.params;
    const medication = await Medication.findOne({ patientId });

    if (medication) {
      res.status(200).json(medication);
    } else {
      res.status(404).json({ message: 'Medications not found for the specified patient.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching medication data.', error });
  }
};


async function getPatientById(req, res) {
  const patientId = req.params.id; // No need to parseInt

  // Read the patients.json file
  fs.readFile('./patients.json', 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading patient data' });
    }
    // Parse the JSON data
    const patients = JSON.parse(data);
    const patient = patients.find(p => p.patientId === patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  });
}

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
