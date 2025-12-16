const mongoose = require("mongoose");

module.exports = mongoose.model("Record", new mongoose.Schema({
  patientId: String,
  subjective: String,
  objective: String,
  assessment: String,
  plan: String,
  date: String
}));
