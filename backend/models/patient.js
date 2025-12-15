const mongoose = require("mongoose");

module.exports = mongoose.model("Patient", new mongoose.Schema({
  patientId: String,
  name: String,
  age: Number,
  gender: String,
  phone: String,
  diagnosis: String,
  createdAt: { type: Date, default: Date.now }
}));