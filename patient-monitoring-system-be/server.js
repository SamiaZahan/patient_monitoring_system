const express = require('express');
// const { PythonShell } = require('python-shell');
const { spawn } = require('child_process');

const axios = require('axios');
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
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s
})
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully!');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB Atlas:', error);
  });


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
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, role });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: user._id, role }
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Routes
app.get('/api/patients', getPatients);
app.get('/api/patient/:id', getPatientById);
app.get('/api/patients/:patientId', getAPatientById);

app.get('/api/medications/:patientId', getMedicationById );
app.post('/api/medications/:patientId/', postMedication);
app.put('/api/medications/:patientId/:medicationIndex', updateMedicationById);
app.delete('/api/medications/:patientId/:medicationIndex', deleteMedicationById);

app.post('/api/tests/:patientId', addTest);
app.get('/api/tests/:patientId', getTests);
app.put('/api/tests/:patientId/:testIndex', updateTest);
app.delete('/api/tests/:patientId/:testIndex', deleteTest);

app.get('/api/doctor/profile', verifyToken, getDoctorProfile);
app.post('/api/predictOxygen', predictOxygen)

// async function predictOxygen (req, res) {
//   const { channelId, readApiKey } = req.body;
//   console.log(channelId, readApiKey)
//   if (!channelId || !readApiKey) {
//     return res.status(400).json({ error: 'Missing channelId or readApiKey' });
//   }

//   try {
//     // Fetch the last 50 values from ThingSpeak
//     const response = await axios.get(`https://api.thingspeak.com/channels/${channelId}/feeds.json`, {
//       params: {
//         api_key: readApiKey,
//         results: 50
//       }
//     });

//     const feeds = response.data.feeds;
//     if (feeds.length < 50) {
//       return res.status(400).json({ error: 'Not enough data points available for prediction.' });
//     }

//     // Extract the field containing oxygen levels
//     const recentData = feeds.map(feed => parseFloat(feed.field1));

//     // Run the Python script to make predictions
//     const options = {
//       mode: 'text',
//       pythonPath: 'python3',
//       pythonOptions: ['-u'], // unbuffered output
//       scriptPath: path.join(__dirname, '/prediction_model/'), // Path to your Python script
//       args: recentData
//     };
//     console.log(options)

//     PythonShell.run('predict_oxygen.py', options, (err, results) => {
//       console.log("inside")

//       if (err) {
//         console.error('Error executing Python script:', err);
//         return res.status(500).json({ error: 'Error executing prediction model.' });
//       }

//       // Results are returned as an array of lines; we expect a single line with space-separated values
//       const predictions = results[0].split(" ").map(parseFloat);
//       console.log(predictions)

//       res.json(predictions);
//     });
//   } catch (error) {
//     console.error('Error fetching data from ThingSpeak:', error);
//     res.status(500).json({ error: 'Error fetching data from ThingSpeak.' });
//   }
// };

async function predictOxygen(req, res) {
  const { channelId, readApiKey } = req.body;
  if (!channelId || !readApiKey) {
    return res.status(400).json({ error: 'Missing channelId or readApiKey' });
  }

  try {
    // Fetch the last 50 values from ThingSpeak
    const response = await axios.get(`https://api.thingspeak.com/channels/${channelId}/feeds.json`, {
      params: {
        api_key: readApiKey,
        results: 10,
      },
    });

    const feeds = response.data.feeds;
    if (feeds.length < 10) {
      return res.status(400).json({ error: 'Not enough data points available for prediction.' });
    }

    // Extract the field containing oxygen levels
    const recentData = feeds.map(feed => parseFloat(feed.field1));
    console.log('Recent Data:', recentData);

    // Run the Python script to make predictions
    const scriptPath = path.resolve(__dirname, 'prediction_model/predict_oxygen.py');
    const pythonProcess = spawn('python3', [scriptPath, ...recentData]);

    let outputData = '';

    // Capture data from Python script stdout
    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    // Capture errors from Python script stderr
    pythonProcess.stderr.on('data', (data) => {
      console.error('Error from Python script:', data.toString());
    });

    // Handle the process exit and send response
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code ${code}`);
        return res.status(500).json({ error: 'Error executing Python script.' });
      }

      // Process output
      try {
        // const predictions = outputData.trim().split(/\s+/).map(parseFloat).filter(value => !isNaN(value));
        console.log(outputData)
        let predictions = outputData.trim().split(/\s+/).map(parseFloat).filter(value => !isNaN(value));
        predictions = predictions.slice(-10);

        console.log('Predictions:', predictions);
        if (predictions.length === 10) {
          res.json(predictions);
        } else {
          res.status(500).json({ error: 'Unexpected number of predictions returned.' });
        }
      } catch (parseError) {
        console.error('Error parsing Python script output:', parseError);
        res.status(500).json({ error: 'Error parsing prediction results.' });
      }
    });
  } catch (error) {
    console.error('Error fetching data from ThingSpeak:', error);
    res.status(500).json({ error: 'Error fetching data from ThingSpeak.' });
  }
}


// Profile endpoint for doctors
async function getDoctorProfile (req, res) {
  try {
    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


async function getPatients(req, res) {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients from the database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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


// Function to add a new test to a specific patient by patient ID
async function addTest (req, res) {
  try {
    const { patientId } = req.params;
    const newTest = req.body;

    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    patient.tests.push(newTest);
    console.log("before save")
    await patient.save();
    console.log("After save")


    res.status(201).json(newTest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add test' });
  }
};

// Function to get all tests for a specific patient by patient ID
async function getTests (req, res) {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findOne({ patientId });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.status(200).json(patient.tests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
};

// Function to update a specific test by patient ID and test index
async function updateTest (req, res) {
  try {
    const { patientId, testIndex } = req.params;
    const updatedTest = req.body;

    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    if (testIndex < 0 || testIndex >= patient.tests.length) {
      return res.status(400).json({ error: 'Invalid test index' });
    }

    patient.tests[testIndex] = { ...patient.tests[testIndex], ...updatedTest };
    await patient.save();

    res.status(200).json(patient.tests[testIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update test' });
  }
};

// Function to delete a specific test by patient ID and test index
async function deleteTest (req, res) {
  try {
    const { patientId, testIndex } = req.params;

    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    if (testIndex < 0 || testIndex >= patient.tests.length) {
      return res.status(400).json({ error: 'Invalid test index' });
    }

    patient.tests.splice(testIndex, 1);
    await patient.save();

    res.status(200).json({ message: 'Test deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete test' });
  }
};

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
