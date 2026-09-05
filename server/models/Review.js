const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    verifiedPurchase: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
      ],
      default: "Approved",
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index(
  {
    product: 1,
    user: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Review",
  reviewSchema
);