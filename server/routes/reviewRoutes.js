const express = require("express");
const mongoose = require("mongoose");

const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const updateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
        status: "Approved",
      },
    },
    {
      $group: {
        _id: "$product",
        average: {
          $avg: "$rating",
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  const ratingAverage =
    stats.length > 0
      ? Number(stats[0].average.toFixed(1))
      : 0;

  const ratingCount =
    stats.length > 0
      ? stats[0].count
      : 0;

  await Product.findByIdAndUpdate(
    productId,
    {
      ratingAverage,
      ratingCount,
    }
  );
};

router.get(
  "/product/:productId",
  async (req, res) => {
    try {
      const { productId } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          productId
        )
      ) {
        return res.status(400).json({
          message: "Invalid product ID",
        });
      }

      const reviews = await Review.find({
        product: productId,
        status: "Approved",
      })
        .sort({
          createdAt: -1,
        })
        .select(
          "userName rating comment verifiedPurchase createdAt"
        );

      res.json(reviews);
    } catch (error) {
      console.error(
        "Get product reviews error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to load reviews",
      });
    }
  }
);

router.post(
  "/product/:productId",
  protect,
  async (req, res) => {
    try {
      const { productId } = req.params;

      const {
        rating,
        comment,
      } = req.body;

      if (
        !mongoose.Types.ObjectId.isValid(
          productId
        )
      ) {
        return res.status(400).json({
          message: "Invalid product ID",
        });
      }

      const product =
        await Product.findById(
          productId
        );

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      const numericRating =
        Number(rating);

      if (
        !Number.isInteger(
          numericRating
        ) ||
        numericRating < 1 ||
        numericRating > 5
      ) {
        return res.status(400).json({
          message:
            "Rating must be between 1 and 5",
        });
      }

      const cleanComment =
        String(comment || "").trim();

      if (!cleanComment) {
        return res.status(400).json({
          message:
            "Review comment is required",
        });
      }

      if (
        cleanComment.length > 1000
      ) {
        return res.status(400).json({
          message:
            "Review comment is too long",
        });
      }

      const existingReview =
        await Review.findOne({
          product: productId,
          user: req.user.id,
        });

      if (existingReview) {
        return res.status(409).json({
          message:
            "You have already reviewed this product",
        });
      }

      const purchasedOrder =
  await Order.findOne({
    userId: req.user.id,
    status: "Delivered",
    items: {
      $elemMatch: {
        id: productId,
      },
    },
  });

      if (!purchasedOrder) {
        return res.status(403).json({
          message:
            "You can review only products you have purchased and received",
        });
      }

      const review =
        await Review.create({
          product: productId,
          user: req.user.id,
          userName:
            req.user.name ||
            "VELNORA Customer",
          rating:
            numericRating,
          comment:
            cleanComment,
          verifiedPurchase: true,
          status: "Approved",
        });

      await updateProductRating(
        productId
      );

      res.status(201).json({
        message:
          "Review submitted successfully",
        review,
      });
    } catch (error) {
      console.error(
        "Create review error:",
        error
      );

      if (
        error.code === 11000
      ) {
        return res.status(409).json({
          message:
            "You have already reviewed this product",
        });
      }

      res.status(500).json({
        message:
          "Unable to submit review",
      });
    }
  }
);

router.delete(
  "/:reviewId",
  protect,
  async (req, res) => {
    try {
      const { reviewId } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          reviewId
        )
      ) {
        return res.status(400).json({
          message: "Invalid review ID",
        });
      }

      const review =
        await Review.findById(
          reviewId
        );

      if (!review) {
        return res.status(404).json({
          message: "Review not found",
        });
      }

      const isOwner =
        String(review.user) ===
        String(req.user.id);

      const isAdmin =
        req.user.role ===
        "admin";

      if (
        !isOwner &&
        !isAdmin
      ) {
        return res.status(403).json({
          message:
            "You cannot delete this review",
        });
      }

      const productId =
        review.product;

      await review.deleteOne();

      await updateProductRating(
        productId
      );

      res.json({
        message:
          "Review deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete review error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to delete review",
      });
    }
  }
);

module.exports = router;