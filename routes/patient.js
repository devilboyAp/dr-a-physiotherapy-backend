const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Patient = require("../models/Patient");

// Create patient (Doctor only)
router.post("/create", auth, async (req, res) => {
  if (req.user.role !== "doctor" && req.user.role !== "admin") {
    return res.status(403).send("Access denied");
  }

  try {
    const patient = await Patient.create({
      ...req.body,
      assignedDoctor: req.user.id,
      createdBy: req.user.id
    });

    res.json({
      message: "Patient created successfully",
      patient
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
