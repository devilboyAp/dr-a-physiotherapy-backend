const express = require("express");
const Patient = require("../models/patient");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

/**
 * =========================
 * ADD PATIENT
 * POST /patients/pre
 * =========================
 */
router.post("/pre", authMiddleware, async (req, res) => {
  try {
    const { name, age, gender, phone, condition } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    const patient = new Patient({
      name,
      age,
      gender,
      phone,
      condition,
      createdBy: req.user.id   // 🔐 doctor-wise ownership
    });

    await patient.save();

    res.status(201).json({
      message: "Patient added successfully",
      patient
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * GET PATIENTS (DOCTOR-WISE)
 * GET /patients/pre
 * =========================
 */
router.get("/pre", authMiddleware, async (req, res) => {
  try {
    const patients = await Patient.find({
      createdBy: req.user.id   // ✅ IMPORTANT FIX
    }).sort({ createdAt: -1 });

    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * UPDATE PATIENT
 * PUT /patients/:id
 * =========================
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedPatient = await Patient.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id }, // 🔐 security check
      req.body,
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({
      message: "Patient updated successfully",
      patient: updatedPatient
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * DELETE PATIENT
 * DELETE /patients/:id
 * =========================
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id   // 🔐 security check
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
