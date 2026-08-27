const mongoose = require("mongoose");


// =========================
// ORDER ITEM SCHEMA
// =========================

const orderItemSchema =
  new mongoose.Schema(
    {
      id: {
        type: String,
        required: true,
      },

      name: {
        type: String,
        required: true,
      },

      price: {
        type: Number,
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
      },

      image: {
        type: String,
        default: "",
      },
    },
    {
      _id: false,
    }
  );


// =========================
// ORDER SCHEMA
// =========================

const orderSchema =
  new mongoose.Schema(
    {
      // =========================
      // NOVA ORDER ID
      // =========================

      orderId: {
        type: String,
        required: true,
        unique: true,
      },


      // =========================
      // USER
      // =========================

      userId: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,
      },


      // =========================
      // CUSTOMER INFORMATION
      // =========================

      customer: {
        name: {
          type: String,
          required: true,
        },

        phone: {
          type: String,
          required: true,
        },

        email: {
          type: String,
          required: true,
        },

        address: {
          type: String,
          required: true,
        },

        city: {
          type: String,
          required: true,
        },

        state: {
          type: String,
          required: true,
        },

        pincode: {
          type: String,
          required: true,
        },
      },


      // =========================
      // ORDER ITEMS
      // =========================

      items: {
        type: [orderItemSchema],
        required: true,
      },


      // =========================
      // TOTAL
      // =========================

      total: {
        type: Number,
        required: true,
      },


      // =========================
      // PAYMENT METHOD
      // =========================

      paymentMethod: {
        type: String,

        enum: [
          "cod",
          "online",
        ],

        default: "cod",
      },


      // =========================
      // PAYMENT STATUS
      // =========================

      paymentStatus: {
        type: String,

        enum: [
          "Pending",
          "Paid",
          "Failed",
        ],

        default: "Pending",
      },


      // =========================
      // RAZORPAY ORDER ID
      // =========================

      razorpayOrderId: {
        type: String,
        default: null,
      },


      // =========================
      // RAZORPAY PAYMENT ID
      // =========================

      razorpayPaymentId: {
        type: String,
        default: null,
      },


      // =========================
      // ORDER STATUS
      // =========================

      status: {
        type: String,

        enum: [
          "Order Confirmed",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
        ],

        default:
          "Order Confirmed",
      },
    },
    {
      timestamps: true,
    }
  );


// =========================
// EXPORT MODEL
// =========================

module.exports =
  mongoose.model(
    "Order",
    orderSchema
  );