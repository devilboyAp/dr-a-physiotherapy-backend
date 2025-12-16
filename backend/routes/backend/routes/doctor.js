const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

/* =========================
   DOCTOR AUTH MIDDLEWARE
========================= */
const doctorAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "doctor") {
      return res.status(403).json({ message: "Doctor access only" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

/* =========================
   DOCTOR DASHBOARD
========================= */
router.get("/dashboard", doctorAuth, async (req, res) => {
  const doctor = await User.findById(req.user.id).select("-password");

  res.json({
    message: "Doctor dashboard access granted",
    doctor,
  });
});

module.exports = router;
