const express = require("express");
const mongoose = require("mongoose");

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Review = require("../models/Review");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.use(protect, adminOnly);


// =========================
// ADMIN DASHBOARD STATS
// =========================

router.get("/stats", async (req, res) => {
  try {
    const totalUsers =
      await User.countDocuments();

    const totalProducts =
      await Product.countDocuments();

    const totalOrders =
      await Order.countDocuments();

    const salesResult =
      await Order.aggregate([
        {
          $match: {
            status: {
              $ne: "Cancelled",
            },
          },
        },
        {
          $group: {
            _id: null,
            totalSales: {
              $sum: "$total",
            },
          },
        },
      ]);

    const totalSales =
      salesResult.length > 0
        ? salesResult[0].totalSales
        : 0;

    res.json({
      users: totalUsers,
      products: totalProducts,
      orders: totalOrders,
      sales: totalSales,
    });
  } catch (error) {
    console.error(
      "Failed to fetch admin stats:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch admin statistics",
    });
  }
});


// =========================
// GET ALL USERS
// =========================

router.get(
  "/users",
  async (req, res) => {
    try {
      const users =
        await User.find()
          .select("-password")
          .sort({
            createdAt: -1,
          });

      res.json(users);
    } catch (error) {
      console.error(
        "Failed to fetch users:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch users",
      });
    }
  }
);


// =========================
// DELETE USER
// =========================

router.delete(
  "/users/:id",
  async (req, res) => {
    try {
      const user =
        await User.findByIdAndDelete(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      res.json({
        message:
          "User deleted successfully",
      });
    } catch (error) {
      console.error(
        "Failed to delete user:",
        error
      );

      res.status(500).json({
        message:
          "Failed to delete user",
      });
    }
  }
);


// =========================
// GET ALL ORDERS
// =========================

router.get(
  "/orders",
  async (req, res) => {
    try {
      const orders =
        await Order.find()
          .populate(
            "userId",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      res.json(orders);
    } catch (error) {
      console.error(
        "Failed to fetch orders:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch orders",
      });
    }
  }
);


// =========================
// UPDATE ORDER STATUS
// WITH STOCK RESTORATION
// =========================

router.put(
  "/orders/:id/status",
  async (req, res) => {
    const session =
      await mongoose.startSession();

    try {
      const { status } =
        req.body;

      const allowedStatuses = [
        "Order Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid order status",
        });
      }

      session.startTransaction();

      const order =
        await Order.findById(
          req.params.id
        ).session(session);

      if (!order) {
        await session.abortTransaction();

        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      const previousStatus =
        order.status;

      if (
        previousStatus === status
      ) {
        await session.commitTransaction();

        return res.json({
          message:
            "Order status is already up to date",
          order,
        });
      }

      if (
        previousStatus ===
          "Cancelled" &&
        status !== "Cancelled"
      ) {
        await session.abortTransaction();

        return res.status(400).json({
          message:
            "Cancelled orders cannot be reopened",
        });
      }

      if (
        previousStatus ===
          "Delivered" &&
        status === "Cancelled"
      ) {
        await session.abortTransaction();

        return res.status(400).json({
          message:
            "Delivered orders cannot be cancelled",
        });
      }

      if (
        status === "Cancelled" &&
        previousStatus !==
          "Cancelled"
      ) {
        for (
          const item of order.items
        ) {
          const quantity =
            Number(
              item.quantity
            );

          if (
            !item.id ||
            !Number.isInteger(
              quantity
            ) ||
            quantity <= 0
          ) {
            throw new Error(
              "Invalid order item data"
            );
          }

          const product =
            await Product.findById(
              item.id
            ).session(session);

          if (!product) {
            console.warn(
              `Product ${item.id} no longer exists. Stock restoration skipped.`
            );

            continue;
          }

          product.stock =
            Number(
              product.stock || 0
            ) + quantity;

          await product.save({
            session,
          });
        }
      }

      order.status =
        status;

      await order.save({
        session,
      });

      await session.commitTransaction();

      const updatedOrder =
        await Order.findById(
          order._id
        ).populate(
          "userId",
          "name email"
        );

      res.json({
        message:
          status === "Cancelled"
            ? "Order cancelled and stock restored successfully"
            : "Order status updated successfully",

        order:
          updatedOrder,
      });
    } catch (error) {
      if (
        session.inTransaction()
      ) {
        await session.abortTransaction();
      }

      console.error(
        "Failed to update order status:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update order status",
      });
    } finally {
      await session.endSession();
    }
  }
);


// =========================
// GET ALL REVIEWS
// =========================

router.get(
  "/reviews",
  async (req, res) => {
    try {
      const reviews =
        await Review.find()
          .populate(
            "product",
            "name image"
          )
          .populate(
            "user",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      res.json(reviews);
    } catch (error) {
      console.error(
        "Failed to fetch reviews:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch reviews",
      });
    }
  }
);


// =========================
// UPDATE REVIEW STATUS
// =========================

router.put(
  "/reviews/:id/status",
  async (req, res) => {
    try {
      const { status } =
        req.body;

      const allowedStatuses = [
        "Pending",
        "Approved",
        "Rejected",
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid review status",
        });
      }

      const review =
        await Review.findById(
          req.params.id
        );

      if (!review) {
        return res.status(404).json({
          message:
            "Review not found",
        });
      }

      review.status =
        status;

      await review.save();

      const ratingStats =
        await Review.aggregate([
          {
            $match: {
              product:
                review.product,
              status:
                "Approved",
            },
          },
          {
            $group: {
              _id:
                "$product",

              ratingAverage: {
                $avg:
                  "$rating",
              },

              ratingCount: {
                $sum: 1,
              },
            },
          },
        ]);

      if (
        ratingStats.length > 0
      ) {
        await Product.findByIdAndUpdate(
          review.product,
          {
            ratingAverage:
              Number(
                ratingStats[0]
                  .ratingAverage
                  .toFixed(1)
              ),

            ratingCount:
              ratingStats[0]
                .ratingCount,
          }
        );
      } else {
        await Product.findByIdAndUpdate(
          review.product,
          {
            ratingAverage: 0,
            ratingCount: 0,
          }
        );
      }

      const updatedReview =
        await Review.findById(
          review._id
        )
          .populate(
            "product",
            "name image"
          )
          .populate(
            "user",
            "name email"
          );

      res.json({
        message:
          "Review status updated successfully",

        review:
          updatedReview,
      });
    } catch (error) {
      console.error(
        "Failed to update review status:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update review status",
      });
    }
  }
);


// =========================
// DELETE REVIEW
// =========================

router.delete(
  "/reviews/:id",
  async (req, res) => {
    try {
      const review =
        await Review.findById(
          req.params.id
        );

      if (!review) {
        return res.status(404).json({
          message:
            "Review not found",
        });
      }

      const productId =
        review.product;

      await review.deleteOne();

      const ratingStats =
        await Review.aggregate([
          {
            $match: {
              product:
                productId,
              status:
                "Approved",
            },
          },
          {
            $group: {
              _id:
                "$product",

              ratingAverage: {
                $avg:
                  "$rating",
              },

              ratingCount: {
                $sum: 1,
              },
            },
          },
        ]);

      if (
        ratingStats.length > 0
      ) {
        await Product.findByIdAndUpdate(
          productId,
          {
            ratingAverage:
              Number(
                ratingStats[0]
                  .ratingAverage
                  .toFixed(1)
              ),

            ratingCount:
              ratingStats[0]
                .ratingCount,
          }
        );
      } else {
        await Product.findByIdAndUpdate(
          productId,
          {
            ratingAverage: 0,
            ratingCount: 0,
          }
        );
      }

      res.json({
        message:
          "Review deleted successfully",
      });
    } catch (error) {
      console.error(
        "Failed to delete review:",
        error
      );

      res.status(500).json({
        message:
          "Failed to delete review",
      });
    }
  }
);


module.exports = router;