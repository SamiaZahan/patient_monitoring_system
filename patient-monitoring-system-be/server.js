const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const Doctor = require('./models/Doctor');
const Staff = require('./models/Staff');
const Patient = require('./models/Patient');

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//   serverSelectionTimeoutMS: 5000, // Timeout after 5s
// })
//   .then(() => {
//     console.log('Connected to MongoDB Atlas successfully!');
//   })
//   .catch((error) => {
//     console.error('Failed to connect to MongoDB Atlas:', error);
//   });


app.post('/api/auth/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;

    if (role === 'doctor') {
      user = await Doctor.findOne({ email });
    } else if (role === 'staff') {
      user = await Staff.findOne({ email });
    } else if (role === 'patient') {
      user = await Patient.findOne({ email });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
      console.log("pass")
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, role });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Routes
app.get('/api/patients', getPatients);
app.get('/api/patient/:id', getPatientById);
app.get('/api/patients/:patientId', getAPatientById);
app.get('/api/medications/:patientId', getMedicationById );
app.post('/api/medications/:patientId/', postMedication);
app.put('/api/medications/:patientId/:medicationIndex', updateMedicationById);
app.delete('/api/medications/:patientId/:medicationIndex', deleteMedicationById);


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


async function getAPatientById(req, res) {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findOne({ patientId });
    if (patient) {
      res.status(200).json(patient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add a new medication by patientId
async function postMedication (req, res) {
  try {
    const { patientId } = req.params;
    const newMedication = req.body;
    console.log(newMedication)
    const patient = await Patient.findOne({ patientId });
    if (patient) {
      patient.medications.push(newMedication);
      await patient.save();
      res.status(201).json(newMedication);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Bad request' });
  }
};

// Update a medication by patientId and medication index
async function updateMedicationById (req, res) {
  try {
    const { patientId, medicationIndex } = req.params;
    const updatedMedication = req.body;
    const patient = await Patient.findOne({ patientId });
    if (patient && patient.medications[medicationIndex]) {
      patient.medications[medicationIndex] = updatedMedication;
      await patient.save();
      res.status(200).json(updatedMedication);
    } else {
      res.status(404).json({ message: 'Patient or medication not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Bad request' });
  }
};

// Delete a medication by patientId and medication index
async function deleteMedicationById(req, res) {
  try {
    const { patientId, medicationIndex } = req.params;
    const patient = await Patient.findOne({ patientId });
    if (patient && patient.medications[medicationIndex]) {
      patient.medications.splice(medicationIndex, 1);
      await patient.save();
      res.status(200).json({ message: 'Medication deleted successfully' });
    } else {
      res.status(404).json({ message: 'Patient or medication not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

async function getMedicationById(req, res) {
  const { patientId } = req.params;

  // Read medication data from JSON file
  fs.readFile('./medication.json', 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading the JSON file:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    try {
      const medications = JSON.parse(data);

      // Find the medications for the given patientId
      const patientMedications = medications.find((entry) => entry.patientId === patientId);

      if (patientMedications) {
        return res.status(200).json(patientMedications);
      } else {
        return res.status(404).json({ message: 'Medications not found for the specified patient.' });
      }
    } catch (parseError) {
      console.error('Error parsing the JSON file:', parseError);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
}

// Rafi vai work on Medication Post, Uopdate, Delete


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
