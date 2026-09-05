const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

const User = require("../models/User");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many login attempts. Please try again later.",
  },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many registration attempts. Please try again later.",
  },
});


// =========================
// REGISTER
// =========================

router.post(
  "/register",
  registerLimiter,
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: "Please fill in all fields",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          message:
            "Password must be at least 6 characters",
        });
      }

      const existingUser =
        await User.findOne({
          email: email.toLowerCase(),
        });

      if (existingUser) {
        return res.status(400).json({
          message: "User already exists",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const user =
        await User.create({
          name,
          email: email.toLowerCase(),
          password: hashedPassword,
        });

      res.status(201).json({
        message: "Registration successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      res.status(500).json({
        message:
          "Server error during registration",
      });
    }
  }
);


// =========================
// LOGIN
// =========================

router.post(
  "/login",
  loginLimiter,
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message:
            "Please enter email and password",
        });
      }

      const user =
        await User.findOne({
          email: email.toLowerCase(),
        });

      if (!user) {
        return res.status(401).json({
          message:
            "Invalid email or password",
        });
      }

      const passwordMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!passwordMatch) {
        return res.status(401).json({
          message:
            "Invalid email or password",
        });
      }

      const token =
        jwt.sign(
          {
            id: user._id,
            role: user.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

      res.json({
        message: "Login successful",

        token,

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      res.status(500).json({
        message:
          "Server error during login",
      });
    }
  }
);


module.exports = router;