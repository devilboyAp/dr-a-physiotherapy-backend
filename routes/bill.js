const express = require("express");
const Bill = require("../models/Bill");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

/**
 * CREATE BILL (ADMIN ONLY)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only access" });
    }

    const bill = new Bill({
      patient: req.body.patient,
      amount: req.body.amount,
      description: req.body.description,
      paymentStatus: req.body.paymentStatus || "unpaid",
      paidAmount: req.body.paidAmount || 0,
      createdBy: req.user.id
    });

    await bill.save();
    res.status(201).json({ message: "Bill created", bill });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET ALL BILLS (ADMIN)
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only access" });
    }

    const bills = await Bill.find()
      .populate("patient", "name phone")
      .sort({ createdAt: -1 });

    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
