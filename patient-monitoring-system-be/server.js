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


// mongoose.connect(process.env.MONGO_URI, {
//   serverSelectionTimeoutMS: 5000, // Timeout after 5s
// })
//   .then(() => {
//     console.log('Connected to MongoDB Atlas successfully!');
    
//   })
//   .catch((error) => {
//     console.error('Failed to connect to MongoDB Atlas:', error);
//   });


// Routes
app.get('/api/patients', getPatients);
app.get('/api/patient/:id', getPatientById);
app.get('/api/medications/:patientId', getMedicationById );
app.post('/api/madication/', postMedication);
app.put('api/medication/:patientId', updateMedicationById);
app.delete('api/medication/:patientId', deleteMedicationById);


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
// async function getMedicationById(req, res)  {
//   try {
//     const { patientId } = req.params;
//     const medication = await Medication.findOne({ patientId });

//     if (medication) {
//       res.status(200).json(medication);
//     } else {
//       res.status(404).json({ message: 'Medications not found for the specified patient.' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'An error occurred while fetching medication data.', error });
//   }
// };

// Get medication by patientId
async function getMedicationById(req, res) {
  try {
    const medication = await Medication.findOne({ patientId: req.params.patientId });
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    res.json(medication);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add medication for a patient
async function postMedication(req, res) {
  const { patientId, medications } = req.body;

  try {
    // Check if a record for the patient already exists
    let medication = await Medication.findOne({ patientId });

    if (medication) {
      return res.status(400).json({ message: 'Medication already exists for this patient' });
    }

    medication = new Medication({
      patientId,
      medications,
    });

    await medication.save();
    res.status(201).json(medication);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update medication by patientId
async function updateMedicationById(req, res) {
  const { medications } = req.body;

  try {
    const medication = await Medication.findOneAndUpdate(
      { patientId: req.params.patientId },
      { $set: { medications } },
      { new: true }
    );

    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    res.json(medication);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete medication by patientId
async function deleteMedicationById(req, res){
  try {
    const medication = await Medication.findOneAndDelete({ patientId: req.params.patientId });

    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    res.json({ message: 'Medication deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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
