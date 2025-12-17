const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");

// Doctor dashboard
router.get("/doctor", auth, async (req, res) => {
  try {
    if (req.user.role !== "doctor" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const doctorId = req.user.id;

    const totalPatients = await Patient.countDocuments({
      assignedDoctor: doctorId
    });

    const totalAppointments = await Appointment.countDocuments({
      doctor: doctorId
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayAppointments = await Appointment.find({
      doctor: doctorId,
      date: { $gte: todayStart, $lte: todayEnd }
    }).populate("patient");

    res.json({
      totalPatients,
      totalAppointments,
      todayAppointments
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
