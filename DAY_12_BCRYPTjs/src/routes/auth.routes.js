const express = require("express");
const authrouter = express.Router();

const usermodel = require("../models/user.model"); /*NEW*/

const jwt = require("jsonwebtoken"); /*NEW*/
const crypto = require("crypto"); /*NEW*/

authrouter.post("/register", async (req, res) => {
  /*NEW*/
  const isuseralreadyhere = await usermodel.findOne({ email: req.body.email });
  if (isuseralreadyhere) {
    return res.status(400).json({ msg: "User already exists" });
  }

  const { name, password, email } = req.body;

  const hash = crypto.createHash("md5").update(password).digest("hex"); /*NEW*/

  const user = await usermodel.create({ name, password: hash, email });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("jwt_token", token);
  /*NEW*/
  res.status(200).json({ msg: "User registered successfully", user, token });
});

authrouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

// User finding proccess
  const user = await usermodel.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: "User not found" });
  }
  const ispasswordcorrect =
    user.password ===
    crypto.createHash("md5").update(password).digest("hex"); /*NEW*/
  if (!ispasswordcorrect) {
    return res.status(400).json({ msg: "Invalid credentials! Password Wrong" });
  }
// User find process end

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
  );
  // token goes to client in cookie
  res.cookie("jwt_token", token);
  res.status(200).json({ msg: "User logged in successfully", user, token });
});


authrouter.get("/register", async (req, res) => {
  const users = await usermodel.find();
  res.status(200).json({ msg: "Register route", users });
});

module.exports = authrouter;
