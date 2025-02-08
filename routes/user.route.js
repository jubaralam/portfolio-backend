const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();
const UserModel = require("../models/user.model")
// POST /register - Jobseeker Registration Route
userRouter.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,

      password,
    } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res
        .status(400)
        .send({ message: "All required fields are mandatory." });
    }

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new jobseeker
    const newUser = new UserModel({
      name,
      email,

      password: hashedPassword,
    });

    // Save the jobseeker to the database
    await newUser.save();

    res
      .status(201)
      .json({ message: "Registration successful!", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

//user login route
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ message: "Invalid credentials" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(401).send({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.secretKey, {
      expiresIn: "24h",
    });

    res.status(200).send({ message: "you have loggedIn", token: token, user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = userRouter;
