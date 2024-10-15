const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
  },
  medications: [
    {
      name: String,
      morning: String,
      afternoon: String,
      evening: String,
      night: String,
    },
  ],
});

module.exports = mongoose.model('Medication', MedicationSchema);
