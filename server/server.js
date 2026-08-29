const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const productRoutes =
  require("./routes/productRoutes");

const authRoutes =
  require("./routes/authRoutes");

const adminRoutes =
  require("./routes/adminRoutes");

const orderRoutes =
  require("./routes/orderRoutes");

const {
  router: paymentRoutes,
  webhookHandler,
} = require("./routes/paymentRoutes");

const app = express();

const PORT =
  process.env.PORT || 5000;

const MONGO_URI =
  process.env.MONGO_URI;


// =========================
// CORS
// =========================

app.use(
  cors({
    origin: [
      "https://velnora-store.onrender.com",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);


// =========================
// RAZORPAY WEBHOOK
// MUST BE BEFORE express.json()
// =========================

app.post(
  "/api/payments/webhook",

  express.raw({
    type: "application/json",
  }),

  webhookHandler
);


// =========================
// JSON MIDDLEWARE
// =========================

app.use(
  express.json()
);


// =========================
// ROUTES
// =========================

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);


// =========================
// HOME
// =========================

app.get(
  "/",
  (req, res) => {
    res.json({
      message:
        "NOVA Fashion Store API is running",
    });
  }
);


// =========================
// MONGODB CONNECTION
// =========================

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB connected successfully"
    );

    app.listen(
      PORT,
      () => {
        console.log(
          `Server running on http://localhost:${PORT}`
        );
      }
    );
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:"
    );

    console.error(
      error.message
    );
  });