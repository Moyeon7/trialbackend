const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

app.use(express.json());

const mongoUrl = "mongodb+srv://sakshi:pikachu02@cluster0.068g2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";

mongoose.connect(mongoUrl)
  .then(() => {
    console.log("db connected");
  })
  .catch((e) => {
    console.log(e);
  });

require('./UserDetails.jsx'); // Ensure this file correctly exports your User model
const User = mongoose.model("UserInfo");

app.get("/", (req, res) => {
  res.send({ status: "started" });
});

// Register route
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    return res.status(409).send({ error: "User already exists!!" });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    await User.create({ name, email, password: encryptedPassword });
    res.status(201).send({ status: "ok", data: "User Created" });
  } catch (error) {
    res.status(500).send({ status: "error", data: error.message });
  }
});

// Login route
app.post('/login-user', async (req, res) => {
  console.log('Login request received:', req.body);
  const { email, password } = req.body;
  const oldUser = await User.findOne({ email: email });

  if (!oldUser) {
    return res.status(404).send({ error: "User doesn't exist!!" });
  }
  
  if (await bcrypt.compare(password, oldUser.password)) {
    const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);
    return res.status(200).send({ status: "ok", data: token });
  } else {
    return res.status(401).send({ error: "Invalid credentials" });
  }
});

app.listen(5001, () => {
  console.log("Server started on port 5001");
});

// app.post("/forgot-password", async(req,res)=>{
//   const {email} = req.body;
//   try{
//     const oldUser = await User.findOne({email});
//     if(!oldUser){
//       return res.send("User Doesn't Exists!!");
//     }
//     const secret = JWT_SECRET + oldUser.password;
//     const token = jwt.sign({email: oldUser.email, id: oldUser._id}, secret, {expiresIn:'5m'});
//     const link = `http://192.168.0.106:5001/reset-password/${oldUser._id}/${token}`;
//     console.log(link);
//   }catch(error){

//   }
// });

// app.get('/reset-password', async (req,res)=>{
//   const {id, token} = req.params;
//   console.log(req.params);
// })

