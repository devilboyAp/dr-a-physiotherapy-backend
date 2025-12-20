require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* =======================
   MIDDLEWARE
======================= */
app.use(cors());
app.use(express.json());

/* =======================
   DATABASE
======================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

/* =======================
   ROUTES
======================= */

// AUTH
app.use("/auth", require("./routes/auth"));

// ADMIN / DOCTOR
app.use("/admin", require("./routes/admin"));
app.use("/doctor", require("./routes/doctor"));

// CORE MODULES
app.use("/patients", require("./routes/patient"));
app.use("/appointments", require("./routes/appointment"));

// DASHBOARDS (ONLY EXISTING FILES)
app.use("/dashboard/doctor", require("./routes/doctorDashboard"));
app.use("/dashboard/patient", require("./routes/patientDashboard"));

// ❌ REMOVED adminDashboard (file does not exist)

/* =======================
   HEALTH CHECK
======================= */
app.get("/", (req, res) => {
  res.send("🚀 Dr. Apurba Physiotherapy Backend Running");
});

/* =======================
   SERVER
======================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
