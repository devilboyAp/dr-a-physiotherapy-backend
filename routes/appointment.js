const express = require("express");
const Appointment = require("../models/appointment");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

/**
 * CREATE APPOINTMENT
 * POST /appointments
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { patient, date, time, reason } = req.body;

    if (!patient || !date || !time) {
      return res.status(400).json({ message: "Patient, date and time required" });
    }

    const appointment = new Appointment({
      patient,
      date,
      time,
      reason,
      createdBy: req.user.id
    });

    await appointment.save();

    res.status(201).json({
      message: "Appointment created",
      appointment
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET ALL APPOINTMENTS
 * GET /appointments
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name phone")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
