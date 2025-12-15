const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

router.post("/send-otp", async (req,res)=>{
  const otp = Math.floor(100000+Math.random()*900000);
  await User.findOneAndUpdate(
    {email:req.body.email},
    {email:req.body.email, otp, otpExpiry: Date.now()+300000},
    {upsert:true}
  );
  res.send("OTP Sent");
});

router.post("/verify-otp", async (req,res)=>{
  const user = await User.findOne({email:req.body.email});
  if(!user || user.otp!=req.body.otp) return res.send("Invalid OTP");
  const token = jwt.sign({email:user.email}, process.env.JWT_SECRET);
  res.json({token});
});

module.exports = router;