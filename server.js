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
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

/* =======================
   ROUTES
======================= */
app.use("/auth", require("./routes/auth"));
app.use("/admin", require("./routes/admin"));     // Admin APIs
app.use("/doctor", require("./routes/doctor"));   // Doctor APIs
app.use("/patient", require("./routes/patient")); // ✅ Patient APIs (NEW)

/* =======================
   HEALTH CHECK
======================= */
app.get("/", (req, res) => {
  res.send("Dr. A Physiotherapy Backend Running 🚀");
});

/* =======================
   SERVER
======================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

