require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

app.use("/auth", require("./routes/auth"));

app.get("/", (req,res)=>{
  res.send("Dr. A Physiotherapy Backend Running");
});


app.listen(3000, ()=>console.log("Server started"));
