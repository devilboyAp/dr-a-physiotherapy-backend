const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Appointment = require("../models/appointment");
const User = require("../models/User");

// GET Patient Dashboard
router.get("/patient", auth, async (req, res) => {
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Access denied" });
    }

    const patientId = req.user.id;
    const now = new Date();

    const [
      totalAppointments,
      upcomingAppointments,
      pastAppointments,
    ] = await Promise.all([
      Appointment.countDocuments({ patient: patientId }),
      Appointment.countDocuments({
        patient: patientId,
        date: { $gte: now },
      }),
      Appointment.countDocuments({
        patient: patientId,
        date: { $lt: now },
      }),
    ]);

    const patient = await User.findById(patientId);

    res.json({
      patient,
      stats: {
        totalAppointments,
        upcomingAppointments,
        pastAppointments,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
