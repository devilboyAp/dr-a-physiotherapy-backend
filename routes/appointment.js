const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Appointment = require("../models/appointment");

// Create appointment (Doctor only)
router.post("/create", auth, async (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).send("Access denied");
  }

  try {
    const appointment = await Appointment.create({
      patient: req.body.patient,
      doctor: req.user.id,
      date: req.body.date,
      reason: req.body.reason
    });

    res.json({
      message: "Appointment created successfully",
      appointment
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get logged-in doctor's appointments
router.get("/my-appointments", auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user.id
    }).populate("patient");

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
