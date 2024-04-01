// routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { dataSource } from "../db/db.js";
import User from "../entities/user.js";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userRepository = dataSource.getRepository(User);
    const existingUser = await userRepository.findOne({
      where: {
        username: username,
        email: email,
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    } else {
      //create user

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = userRepository.create({
        username: username,
        email: email,
        password: hashedPassword,
      });

      await userRepository.save(newUser);

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );
      res
        .status(201)
        .json({
          message: "User created successfully",
          user: newUser,
          token: token,
        });
    }
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(password);

    // Find user by email
    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
