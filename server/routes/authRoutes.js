const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const crypto = require("crypto");

const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many login attempts. Please try again later.",
  },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many registration attempts. Please try again later.",
  },
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many password reset requests. Please try again later.",
  },
});

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many reset attempts. Please try again later.",
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

      if (
        !name ||
        !email ||
        !password
      ) {
        return res
          .status(400)
          .json({
            message:
              "Please fill in all fields",
          });
      }

      if (
        password.length < 6
      ) {
        return res
          .status(400)
          .json({
            message:
              "Password must be at least 6 characters",
          });
      }

      const normalizedEmail =
        email
          .trim()
          .toLowerCase();

      const existingUser =
        await User.findOne({
          email:
            normalizedEmail,
        });

      if (
        existingUser
      ) {
        return res
          .status(400)
          .json({
            message:
              "User already exists",
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
          email:
            normalizedEmail,
          password:
            hashedPassword,
        });

      return res
        .status(201)
        .json({
          message:
            "Registration successful",

          user: {
            id:
              user._id,
            name:
              user.name,
            email:
              user.email,
            role:
              user.role,
          },
        });

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      return res
        .status(500)
        .json({
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

      if (
        !email ||
        !password
      ) {
        return res
          .status(400)
          .json({
            message:
              "Please enter email and password",
          });
      }

      const normalizedEmail =
        email
          .trim()
          .toLowerCase();

      const user =
        await User.findOne({
          email:
            normalizedEmail,
        });

      if (!user) {
        return res
          .status(401)
          .json({
            message:
              "Invalid email or password",
          });
      }

      const passwordMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (
        !passwordMatch
      ) {
        return res
          .status(401)
          .json({
            message:
              "Invalid email or password",
          });
      }

      const token =
        jwt.sign(
          {
            id:
              user._id,
            role:
              user.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn:
              "7d",
          }
        );

      return res.json({
        message:
          "Login successful",

        token,

        user: {
          id:
            user._id,
          name:
            user.name,
          email:
            user.email,
          role:
            user.role,
        },
      });

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      return res
        .status(500)
        .json({
          message:
            "Server error during login",
        });
    }
  }
);


// =========================
// FORGOT PASSWORD
// =========================

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  async (req, res) => {
    try {
      const {
        email,
      } = req.body;

      if (!email) {
        return res
          .status(400)
          .json({
            message:
              "Please enter your email address",
          });
      }

      const normalizedEmail =
        email
          .trim()
          .toLowerCase();

      const genericMessage =
        "If an account exists with this email, a password reset link has been sent.";

      const user =
        await User.findOne({
          email:
            normalizedEmail,
        });

      if (!user) {
        return res.json({
          message:
            genericMessage,
        });
      }

      const resetToken =
        crypto
          .randomBytes(32)
          .toString("hex");

      const hashedResetToken =
        crypto
          .createHash("sha256")
          .update(
            resetToken
          )
          .digest("hex");

      user.passwordResetToken =
        hashedResetToken;

      user.passwordResetExpires =
        new Date(
          Date.now() +
            15 *
              60 *
              1000
        );

      await user.save();

      



      const frontendUrl =
        process.env.FRONTEND_URL ||
        "http://localhost:5173";

      const resetLink =
        `${frontendUrl}/reset-password/${resetToken}`;

      try {
        await sendEmail({
          to:
            user.email,

          subject:
            "Reset your VELNORA password",

          html: `
            <div
              style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                padding: 30px;
              "
            >
              <h2>
                Reset your VELNORA password
              </h2>

              <p>
                Hello ${user.name},
              </p>

              <p>
                We received a request to reset the password for your VELNORA account.
              </p>

              <p>
                Click the button below to create a new password.
              </p>

              <div
                style="
                  margin: 30px 0;
                "
              >
                <a
                  href="${resetLink}"
                  style="
                    display: inline-block;
                    background: #111111;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 14px 24px;
                    border-radius: 6px;
                    font-weight: bold;
                  "
                >
                  Reset Password
                </a>
              </div>

              <p>
                This reset link will expire in 15 minutes.
              </p>

              <p>
                If you did not request a password reset, you can ignore this email.
              </p>

              <p>
                VELNORA
              </p>
            </div>
          `,
        });

      } catch (emailError) {
        console.error(
          "Password reset email error:",
          emailError
        );

        user.passwordResetToken =
          null;

        user.passwordResetExpires =
          null;

        await user.save();

        return res
          .status(500)
          .json({
            message:
              "Unable to send password reset email. Please try again.",
          });
      }

      return res.json({
        message:
          genericMessage,
      });

    } catch (error) {
      console.error(
        "Forgot password error:",
        error
      );

      return res
        .status(500)
        .json({
          message:
            "Unable to process password reset request",
        });
    }
  }
);


// =========================
// RESET PASSWORD
// =========================

router.post(
  "/reset-password/:token",
  resetPasswordLimiter,
  async (req, res) => {
    try {
      const {
        token,
      } = req.params;

      const {
        password,
      } = req.body;

      if (
        !token
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid password reset link",
          });
      }

      if (
        !password
      ) {
        return res
          .status(400)
          .json({
            message:
              "Please enter a new password",
          });
      }

      if (
        typeof password !==
          "string" ||
        password.length < 6
      ) {
        return res
          .status(400)
          .json({
            message:
              "Password must be at least 6 characters",
          });
      }

      const hashedResetToken =
        crypto
          .createHash("sha256")
          .update(
            token
          )
          .digest("hex");

      const user =
        await User.findOne({
          passwordResetToken:
            hashedResetToken,

          passwordResetExpires: {
            $gt:
              new Date(),
          },
        });

      if (!user) {
        return res
          .status(400)
          .json({
            message:
              "Password reset link is invalid or has expired",
          });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      user.password =
        hashedPassword;

      user.passwordResetToken =
        null;

      user.passwordResetExpires =
        null;

      await user.save();

      return res.json({
        message:
          "Password reset successful. You can now login with your new password.",
      });

    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      return res
        .status(500)
        .json({
          message:
            "Unable to reset password. Please try again.",
        });
    }
  }
);


module.exports = router;