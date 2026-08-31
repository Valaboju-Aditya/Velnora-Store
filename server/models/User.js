const mongoose = require("mongoose");

const cartItemSchema =
  new mongoose.Schema(
    {
      product: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },

      quantity: {
        type: Number,
        default: 1,
        min: 1,
      },
    },
    {
      _id: false,
    }
  );

const addressSchema =
  new mongoose.Schema(
    {
      fullName: {
        type: String,
        trim: true,
        required: true,
      },

      phone: {
        type: String,
        trim: true,
        required: true,
      },

      addressLine: {
        type: String,
        trim: true,
        required: true,
      },

      city: {
        type: String,
        trim: true,
        required: true,
      },

      state: {
        type: String,
        trim: true,
        required: true,
      },

      pincode: {
        type: String,
        trim: true,
        required: true,
      },

      isDefault: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

const userSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },

      phone: {
        type: String,
        trim: true,
        default: "",
      },

      password: {
        type: String,
        required: true,
        minlength: 6,
      },

      role: {
        type: String,
        enum: [
          "customer",
          "admin",
        ],
        default: "customer",
      },

      cart: {
        type: [cartItemSchema],
        default: [],
      },

      wishlist: [
        {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      ],

      addresses: {
        type: [addressSchema],
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "User",
    userSchema
  );