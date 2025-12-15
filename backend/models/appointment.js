const mongoose = require("mongoose");

module.exports = mongoose.model("Appointment", new mongoose.Schema({
  patientId: String,
  date: String,
  time: String,
  status: { type: String, default: "Pending" }
}));