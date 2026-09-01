const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Product = require("../models/Product");
const Order = require("../models/Order");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// =========================
// CREATE RAZORPAY ORDER
// =========================

router.post(
  "/create-order",
  protect,
  async (req, res) => {
    try {
      const { items } = req.body;

      if (
        !Array.isArray(items) ||
        items.length === 0
      ) {
        return res.status(400).json({
          message:
            "Cart items are required",
        });
      }

      let total = 0;

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
          return res.status(400).json({
            message:
              "Invalid cart item",
          });
        }

        const product =
          await Product.findById(
            productId
          );

        if (!product) {
          return res.status(404).json({
            message:
              "A product in your cart no longer exists",
          });
        }

        if (
          Number(product.stock) <
          quantity
        ) {
          return res.status(400).json({
            message:
              `Only ${product.stock} item(s) of ${product.name} are available`,
          });
        }

        total +=
          Number(product.price) *
          quantity;
      }

      const shipping =
        total >= 999 ||
        total === 0
          ? 0
          : 99;

      const finalTotal =
        total + shipping;

      const amountInPaise =
        Math.round(
          finalTotal * 100
        );

      const razorpayOrder =
        await razorpay.orders.create({
          amount:
            amountInPaise,

          currency:
            "INR",

          receipt:
            `velnora_${Date.now()}`,

          notes: {
            userId:
              String(req.user.id),
          },
        });

      res.status(201).json({
        message:
          "Razorpay order created",

        key:
          process.env
            .RAZORPAY_KEY_ID,

        order:
          razorpayOrder,

        amount:
          finalTotal,
      });

    } catch (error) {
      console.error(
        "Razorpay order creation error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to create payment order",
      });
    }
  }
);


// =========================
// VERIFY WEBHOOK SIGNATURE
// =========================

function verifyWebhookSignature(
  rawBody,
  receivedSignature
) {
  if (
    !process.env
      .RAZORPAY_WEBHOOK_SECRET ||
    !receivedSignature
  ) {
    return false;
  }

  const expectedSignature =
    crypto
      .createHmac(
        "sha256",
        process.env
          .RAZORPAY_WEBHOOK_SECRET
      )
      .update(rawBody)
      .digest("hex");

  return (
    expectedSignature ===
    receivedSignature
  );
}


// =========================
// WEBHOOK HANDLER
// =========================

async function webhookHandler(
  req,
  res
) {
  try {
    const signature =
      req.headers[
        "x-razorpay-signature"
      ];

    const rawBody =
      req.body.toString(
        "utf8"
      );

    const verified =
      verifyWebhookSignature(
        rawBody,
        signature
      );

    if (!verified) {
      return res.status(400).json({
        message:
          "Invalid webhook signature",
      });
    }

    const payload =
      JSON.parse(rawBody);

    const event =
      payload.event;


    // =========================
    // PAYMENT CAPTURED
    // =========================

    if (
      event ===
      "payment.captured"
    ) {
      const payment =
        payload.payload
          ?.payment
          ?.entity;

      if (payment) {
        const razorpayPaymentId =
          payment.id;

        const razorpayOrderId =
          payment.order_id;

        const order =
          await Order.findOne({
            $or: [
              {
                razorpayOrderId,
              },

              {
                razorpayPaymentId,
              },
            ],
          });

        if (order) {
          if (
            order.paymentStatus !==
            "Paid"
          ) {
            order.paymentStatus =
              "Paid";
          }

          if (
            !order
              .razorpayPaymentId
          ) {
            order.razorpayPaymentId =
              razorpayPaymentId;
          }

          if (
            !order
              .razorpayOrderId
          ) {
            order.razorpayOrderId =
              razorpayOrderId;
          }

          await order.save();
        }
      }
    }


    // =========================
    // PAYMENT FAILED
    // =========================

    if (
      event ===
      "payment.failed"
    ) {
      const payment =
        payload.payload
          ?.payment
          ?.entity;

      if (payment) {
        const razorpayOrderId =
          payment.order_id;

        const order =
          await Order.findOne({
            razorpayOrderId,
          });

        if (
          order &&
          order.paymentStatus !==
            "Paid"
        ) {
          order.paymentStatus =
            "Failed";

          await order.save();
        }
      }
    }


    // =========================
    // ORDER PAID
    // =========================

    if (
      event ===
      "order.paid"
    ) {
      const orderEntity =
        payload.payload
          ?.order
          ?.entity;

      const paymentEntity =
        payload.payload
          ?.payment
          ?.entity;

      if (orderEntity) {
        const razorpayOrderId =
          orderEntity.id;

        const order =
          await Order.findOne({
            razorpayOrderId,
          });

        if (order) {
          order.paymentStatus =
            "Paid";

          if (
            paymentEntity?.id &&
            !order
              .razorpayPaymentId
          ) {
            order.razorpayPaymentId =
              paymentEntity.id;
          }

          await order.save();
        }
      }
    }


    // Razorpay expects a 2xx response
    res.status(200).json({
      received: true,
    });

  } catch (error) {
    console.error(
      "Razorpay webhook error:",
      error
    );

    res.status(500).json({
      message:
        "Webhook processing failed",
    });
  }
}


module.exports = {
  router,
  webhookHandler,
};