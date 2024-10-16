const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const medicationSchema = new mongoose.Schema({
  name: { type: String },
  morning: { type: String },
  afternoon: { type: String },
  evening: { type: String },
  night: { type: String },
});

const patientSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  condition: { type: String, required: true },
  roomNo: { type: Number, required: true },
  oxygenLevel: { type: Number, required: true },
  medications: [medicationSchema],
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

patientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Patient', patientSchema);

