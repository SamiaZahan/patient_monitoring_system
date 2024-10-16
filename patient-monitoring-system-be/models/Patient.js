const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  morning: { type: String, required: true },
  afternoon: { type: String, required: true },
  evening: { type: String, required: true },
  night: { type: String, required: true },
});

const patientSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  condition: { type: String, required: true },
  roomNo: { type: Number, required: true },
  oxygenLevel: { type: Number, required: true },
  medications: [medicationSchema],
});

module.exports = mongoose.model('Patient', patientSchema);
