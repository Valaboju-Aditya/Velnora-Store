const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/cart", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("cart.product");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const cart = user.cart
      .filter((item) => item.product)
      .map((item) => ({
        ...item.product.toObject(),
        quantity: item.quantity,
      }));

    res.json(cart);
  } catch (error) {
    console.error("Get cart error:", error);

    res.status(500).json({
      message: "Failed to load cart",
    });
  }
});

router.put("/cart", authMiddleware, async (req, res) => {
  try {
    const { cart } = req.body;

    if (!Array.isArray(cart)) {
      return res.status(400).json({
        message: "Cart must be an array",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.cart = cart.map((item) => ({
      product: item._id,
      quantity: Math.max(
        1,
        Number(item.quantity || 1)
      ),
    }));

    await user.save();

    const updatedUser = await User.findById(
      req.user.id
    ).populate("cart.product");

    const updatedCart = updatedUser.cart
      .filter((item) => item.product)
      .map((item) => ({
        ...item.product.toObject(),
        quantity: item.quantity,
      }));

    res.json(updatedCart);
  } catch (error) {
    console.error("Update cart error:", error);

    res.status(500).json({
      message: "Failed to update cart",
    });
  }
});

router.get(
  "/wishlist",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(
        req.user.id
      ).populate("wishlist");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json(
        user.wishlist.filter(Boolean)
      );
    } catch (error) {
      console.error(
        "Get wishlist error:",
        error
      );

      res.status(500).json({
        message: "Failed to load wishlist",
      });
    }
  }
);

router.put(
  "/wishlist",
  authMiddleware,
  async (req, res) => {
    try {
      const { wishlist } = req.body;

      if (!Array.isArray(wishlist)) {
        return res.status(400).json({
          message: "Wishlist must be an array",
        });
      }

      const user = await User.findById(
        req.user.id
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.wishlist = wishlist.map(
        (item) => item._id
      );

      await user.save();

      const updatedUser = await User.findById(
        req.user.id
      ).populate("wishlist");

      res.json(
        updatedUser.wishlist.filter(Boolean)
      );
    } catch (error) {
      console.error(
        "Update wishlist error:",
        error
      );

      res.status(500).json({
        message: "Failed to update wishlist",
      });
    }
  }
);

module.exports = router;