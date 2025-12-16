const mongoose = require("mongoose");

module.exports = mongoose.model("Bill", new mongoose.Schema({
  patientId: String,
  amount: Number,
  date: String
}));
