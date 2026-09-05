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
      // VELNORA ORDER ID
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
          trim: true,
        },

        phone: {
          type: String,
          required: true,
          trim: true,
        },

        email: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },

        address: {
          type: String,
          required: true,
          trim: true,
        },

        city: {
          type: String,
          required: true,
          trim: true,
        },

        state: {
          type: String,
          required: true,
          trim: true,
        },

        pincode: {
          type: String,
          required: true,
          trim: true,
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
        min: 0,
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
          "Refunded",
        ],

        default: "Pending",
      },


      // =========================
      // RAZORPAY ORDER ID
      // =========================

      razorpayOrderId: {
        type: String,
        default: undefined,
        unique: true,
        sparse: true,
      },


      // =========================
      // RAZORPAY PAYMENT ID
      // =========================

      razorpayPaymentId: {
        type: String,
        default: undefined,
        unique: true,
        sparse: true,
      },


      // =========================
      // REFUND STATUS
      // =========================

      refundStatus: {
        type: String,

        enum: [
          "None",
          "Pending",
          "Processed",
          "Failed",
        ],

        default: "None",
      },


      // =========================
      // RAZORPAY REFUND ID
      // =========================

      razorpayRefundId: {
        type: String,
        default: undefined,
        sparse: true,
      },


      // =========================
      // REFUND AMOUNT
      // =========================

      refundAmount: {
        type: Number,
        default: 0,
        min: 0,
      },


      // =========================
      // REFUNDED DATE
      // =========================

      refundedAt: {
        type: Date,
        default: null,
      },

      stockRestored: {
  type: Boolean,
  default: false,
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