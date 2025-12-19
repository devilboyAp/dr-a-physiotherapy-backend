const express = require("express");
const Patient = require("../models/patient");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

/**
 * ADD PATIENT
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, age, gender, phone, condition } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone required" });
    }

    const patient = new Patient({
      name,
      age,
      gender,
      phone,
      condition,
      createdBy: req.user.id
    });

    await patient.save();

    res.json({
      message: "Patient added successfully",
      patient
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET ALL PATIENTS
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
