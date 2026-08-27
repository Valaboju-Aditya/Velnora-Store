const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");


// =========================
// GET ALL PRODUCTS
// PUBLIC
// =========================

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.json(products);
  } catch {
    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
});


// =========================
// GET ONE PRODUCT
// PUBLIC
// =========================

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch {
    res.status(500).json({
      message: "Failed to fetch product",
    });
  }
});


// =========================
// CREATE PRODUCT
// ADMIN ONLY
// =========================

router.post(
  "/",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const product = await Product.create(
        req.body
      );

      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({
        message: "Failed to create product",
        error: error.message,
      });
    }
  }
);


// =========================
// UPDATE PRODUCT
// ADMIN ONLY
// =========================

router.put(
  "/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const updatedProduct =
        await Product.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );

      if (!updatedProduct) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json(updatedProduct);
    } catch (error) {
      console.error(
        "Update product error:",
        error
      );

      res.status(500).json({
        message: "Failed to update product",
        error: error.message,
      });
    }
  }
);


// =========================
// DELETE PRODUCT
// ADMIN ONLY
// =========================

router.delete(
  "/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const product =
        await Product.findByIdAndDelete(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json({
        message:
          "Product deleted successfully",
      });
    } catch {
      res.status(500).json({
        message: "Failed to delete product",
      });
    }
  }
);


module.exports = router;