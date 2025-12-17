const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Appointment = require("../models/appointment");
const User = require("../models/User");

// GET Doctor Dashboard
router.get("/doctor", auth, async (req, res) => {
  try {
    // Allow only doctor
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const doctorId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalAppointments,
      todayAppointments,
      upcomingAppointments,
      completedAppointments,
      cancelledAppointments,
    ] = await Promise.all([
      Appointment.countDocuments({ doctor: doctorId }),
      Appointment.countDocuments({
        doctor: doctorId,
        date: { $gte: today },
      }),
      Appointment.countDocuments({
        doctor: doctorId,
        date: { $gt: new Date() },
        status: "scheduled",
      }),
      Appointment.countDocuments({
        doctor: doctorId,
        status: "completed",
      }),
      Appointment.countDocuments({
        doctor: doctorId,
        status: "cancelled",
      }),
    ]);

    const doctor = await User.findById(doctorId).select("-password");

    res.json({
      doctor,
      stats: {
        totalAppointments,
        todayAppointments,
        upcomingAppointments,
        completedAppointments,
        cancelledAppointments,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
