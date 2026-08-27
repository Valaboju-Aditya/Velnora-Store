const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");

const Order = require("../models/Order");
const Product = require("../models/Product");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// =========================
// VERIFY RAZORPAY SIGNATURE
// =========================

function verifyRazorpayPayment({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) {
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    return false;
  }

  const body =
    `${razorpay_order_id}|${razorpay_payment_id}`;

  const expectedSignature =
    crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body)
      .digest("hex");

  return (
    expectedSignature ===
    razorpay_signature
  );
}


// =========================
// CREATE ORDER
// =========================

router.post(
  "/",
  protect,
  async (req, res) => {
    const session =
      await mongoose.startSession();

    try {
      const {
        orderId,
        customer,
        items,
        paymentMethod,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;


      // =========================
      // BASIC VALIDATION
      // =========================

      if (
        !orderId ||
        !customer ||
        !Array.isArray(items) ||
        items.length === 0
      ) {
        return res.status(400).json({
          message:
            "Missing required order information",
        });
      }


      // =========================
      // PAYMENT METHOD
      // =========================

      const selectedPaymentMethod =
        paymentMethod || "cod";


      // =========================
      // VERIFY ONLINE PAYMENT
      // =========================

      if (
        selectedPaymentMethod ===
        "online"
      ) {
        const paymentVerified =
          verifyRazorpayPayment({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
          });

        if (!paymentVerified) {
          return res.status(400).json({
            message:
              "Payment verification failed",
          });
        }
      }


      // =========================
      // START DATABASE TRANSACTION
      // =========================

      session.startTransaction();

      const orderItems = [];

      let calculatedTotal = 0;


      // =========================
      // CHECK PRODUCTS
      // =========================

      for (const item of items) {
        const productId =
          item.id || item._id;

        const quantity =
          Number(item.quantity);

        if (
          !productId ||
          !Number.isInteger(quantity) ||
          quantity <= 0
        ) {
          await session.abortTransaction();

          return res.status(400).json({
            message:
              "Invalid product quantity",
          });
        }


        // =========================
        // FIND PRODUCT
        // =========================

        const product =
          await Product.findById(
            productId
          ).session(session);

        if (!product) {
          await session.abortTransaction();

          return res.status(404).json({
            message:
              `${item.name || "Product"} no longer exists`,
          });
        }


        // =========================
        // CHECK STOCK
        // =========================

        const availableStock =
          Number(
            product.stock || 0
          );

        if (
          availableStock <
          quantity
        ) {
          await session.abortTransaction();

          return res.status(400).json({
            message:
              `Only ${availableStock} item(s) of ${product.name} are available`,
          });
        }


        // =========================
        // DATABASE PRICE
        // =========================

        const price =
          Number(
            product.price
          );

        calculatedTotal +=
          price * quantity;


        // =========================
        // REDUCE STOCK
        // =========================

        product.stock =
          availableStock -
          quantity;

        await product.save({
          session,
        });


        // =========================
        // SAFE ORDER ITEM
        // =========================

        orderItems.push({
          id:
            product._id.toString(),

          name:
            product.name,

          price,

          quantity,

          image:
            product.image || "",
        });
      }


      // =========================
      // SHIPPING
      // =========================

      const shipping =
        calculatedTotal >= 999 ||
        calculatedTotal === 0
          ? 0
          : 99;

      const finalTotal =
        calculatedTotal +
        shipping;


      // =========================
      // CREATE ORDER
      // =========================

      const createdOrders =
        await Order.create(
          [
            {
              orderId,

              userId:
                req.user.id,

              customer,

              items:
                orderItems,

              total:
                finalTotal,

              paymentMethod:
                selectedPaymentMethod,

              paymentStatus:
                selectedPaymentMethod ===
                "online"
                  ? "Paid"
                  : "Pending",

              status:
                "Order Confirmed",

              razorpayOrderId:
                selectedPaymentMethod ===
                "online"
                  ? razorpay_order_id
                  : null,

              razorpayPaymentId:
                selectedPaymentMethod ===
                "online"
                  ? razorpay_payment_id
                  : null,
            },
          ],
          {
            session,
          }
        );

      const order =
        createdOrders[0];


      // =========================
      // COMMIT
      // =========================

      await session.commitTransaction();


      res.status(201).json({
        message:
          "Order created successfully",

        order,
      });

    } catch (error) {
      if (
        session.inTransaction()
      ) {
        await session.abortTransaction();
      }

      console.error(
        "Create order error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to create order",
      });

    } finally {
      await session.endSession();
    }
  }
);


// =========================
// GET CURRENT USER ORDERS
// =========================

router.get(
  "/my-orders",
  protect,
  async (req, res) => {
    try {
      const orders =
        await Order.find({
          userId:
            req.user.id,
        }).sort({
          createdAt: -1,
        });

      res.json(orders);

    } catch (error) {
      console.error(
        "Failed to fetch user orders:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch orders",
      });
    }
  }
);


module.exports = router;