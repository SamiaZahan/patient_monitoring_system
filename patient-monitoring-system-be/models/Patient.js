const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Medication schema remains unchanged
const medicationSchema = new mongoose.Schema({
  name: { type: String },
  morning: { type: String },
  afternoon: { type: String },
  evening: { type: String },
  night: { type: String },
});

// Tests schema to store information about tests for patients
const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
  todoDate: { type: String, required: true },
  completionDate: { type: String },
  report: { type: String },
});

const patientSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  priority: {type: Number, required: true},
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  condition: { type: String, required: true },
  roomNo: { type: Number, required: true },
  oxygenLevel: { type: Number, required: true },
  medications: [medicationSchema],
  tests: [testSchema], // Adding the tests array for storing information about tests
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  readAPI: { type: String, required: true},
  channelId: {type: Number, required: true}
});

// Middleware to hash password before saving to DB
patientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Patient', patientSchema);
