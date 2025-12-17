const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Patient = require("../models/patient");
const Appointment = require("../models/appointment");

// Doctor Dashboard
router.get("/dashboard", auth, async (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).send("Access denied");
  }

  try {
    const doctorId = req.user.id;

    const totalPatients = await Patient.countDocuments({
      assignedDoctor: doctorId
    });

    const totalAppointments = await Appointment.countDocuments({
      doctor: doctorId
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todayAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      date: { $gte: today, $lt: tomorrow }
    });

    const pendingAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      status: "scheduled"
    });

    const completedAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      status: "completed"
    });

    res.json({
      totalPatients,
      totalAppointments,
      todayAppointments,
      pendingAppointments,
      completedAppointments
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
