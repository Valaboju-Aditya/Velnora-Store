const express = require("express");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Product = require("../models/Product");
const Order = require("../models/Order");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

const razorpay = new Razorpay({
  key_id:
    process.env.RAZORPAY_KEY_ID,

  key_secret:
    process.env.RAZORPAY_KEY_SECRET,
});


// =========================
// CREATE RAZORPAY ORDER
// =========================

router.post(
  "/create-order",
  protect,
  async (req, res) => {
    try {
      const { items } =
        req.body;

      if (
        !Array.isArray(items) ||
        items.length === 0
      ) {
        return res
          .status(400)
          .json({
            message:
              "Cart items are required",
          });
      }

      let total = 0;

      for (
        const item of
        items
      ) {
        const productId =
          item.id ||
          item._id;

        const quantity =
          Number(
            item.quantity
          );

        if (
          !productId ||
          !mongoose.Types.ObjectId.isValid(
            productId
          ) ||
          !Number.isInteger(
            quantity
          ) ||
          quantity <= 0 ||
          quantity > 100
        ) {
          return res
            .status(400)
            .json({
              message:
                "Invalid cart item",
            });
        }

        const product =
          await Product.findById(
            productId
          );

        if (!product) {
          return res
            .status(404)
            .json({
              message:
                "A product in your cart no longer exists",
            });
        }

        if (
          Number(
            product.stock
          ) <
          quantity
        ) {
          return res
            .status(400)
            .json({
              message:
                `Only ${product.stock} item(s) of ${product.name} are available`,
            });
        }

        total +=
          Number(
            product.price
          ) *
          quantity;
      }

      const shipping =
        total >= 999 ||
        total === 0
          ? 0
          : 99;

      const finalTotal =
        total +
        shipping;

      const amountInPaise =
        Math.round(
          finalTotal *
            100
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
              String(
                req.user.id
              ),
          },
        });

      return res
        .status(201)
        .json({
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

      return res
        .status(500)
        .json({
          message:
            "Failed to create payment order",
        });
    }
  }
);


// =========================
// WEBHOOK SIGNATURE
// =========================

function verifyWebhookSignature(
  rawBody,
  receivedSignature
) {
  if (
    !process.env
      .RAZORPAY_WEBHOOK_SECRET ||
    typeof receivedSignature !==
      "string"
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

  const expectedBuffer =
    Buffer.from(
      expectedSignature
    );

  const receivedBuffer =
    Buffer.from(
      receivedSignature
    );

  if (
    expectedBuffer.length !==
    receivedBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    expectedBuffer,
    receivedBuffer
  );
}


// =========================
// RESTORE STOCK
// =========================

async function restoreOrderStock(
  order,
  session
) {
  if (
    order.stockRestored
  ) {
    return;
  }

  for (
    const item of
    order.items
  ) {
    if (
      !mongoose.Types.ObjectId.isValid(
        item.id
      )
    ) {
      throw new Error(
        "Invalid product ID in refunded order"
      );
    }

    const product =
      await Product.findById(
        item.id
      ).session(
        session
      );

    if (!product) {
      throw new Error(
        `Product not found: ${item.name}`
      );
    }

    product.stock =
      Number(
        product.stock ||
          0
      ) +
      Number(
        item.quantity ||
          0
      );

    await product.save({
      session,
    });
  }

  order.stockRestored =
    true;
}


// =========================
// FINALIZE REFUND
// =========================

async function finalizeRefund(
  orderId,
  refund
) {
  const session =
    await mongoose.startSession();

  try {
    await session.withTransaction(
      async () => {
        const order =
          await Order.findById(
            orderId
          ).session(
            session
          );

        if (!order) {
          throw new Error(
            "Order not found while processing refund"
          );
        }

        if (
          order.paymentMethod !==
          "online"
        ) {
          throw new Error(
            "Refund belongs to a non-online order"
          );
        }

        if (
          refund.payment_id !==
          order.razorpayPaymentId
        ) {
          throw new Error(
            "Refund payment ID does not match order"
          );
        }

        const expectedAmount =
          Math.round(
            Number(
              order.total
            ) *
              100
          );

        if (
          Number(
            refund.amount
          ) !==
          expectedAmount
        ) {
          throw new Error(
            "Refund amount does not match order total"
          );
        }

        await restoreOrderStock(
          order,
          session
        );

        order.razorpayRefundId =
          refund.id;

        order.refundAmount =
          Number(
            refund.amount
          ) /
          100;

        order.refundStatus =
          "Processed";

        order.paymentStatus =
          "Refunded";

        order.status =
          "Cancelled";

        if (
          !order.refundedAt
        ) {
          order.refundedAt =
            new Date();
        }

        await order.save({
          session,
        });
      }
    );

  } finally {
    await session.endSession();
  }
}


// =========================
// FIND REFUND ORDER
// =========================

async function findRefundOrder(
  refund
) {
  if (!refund) {
    return null;
  }

  const conditions = [];

  if (refund.id) {
    conditions.push({
      razorpayRefundId:
        refund.id,
    });
  }

  if (
    refund.payment_id
  ) {
    conditions.push({
      razorpayPaymentId:
        refund.payment_id,
    });
  }

  const noteOrderId =
    typeof refund.notes
      ?.orderId ===
    "string"
      ? refund.notes.orderId
      : "";

  if (noteOrderId) {
    conditions.push({
      orderId:
        noteOrderId,
    });
  }

  if (
    conditions.length === 0
  ) {
    return null;
  }

  return Order.findOne({
    $or:
      conditions,
  });
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
      Buffer.isBuffer(
        req.body
      )
        ? req.body
        : Buffer.from(
            req.body || ""
          );

    const verified =
      verifyWebhookSignature(
        rawBody,
        signature
      );

    if (!verified) {
      return res
        .status(400)
        .json({
          message:
            "Invalid webhook signature",
        });
    }

    let payload;

    try {
      payload =
        JSON.parse(
          rawBody.toString(
            "utf8"
          )
        );
    } catch {
      return res
        .status(400)
        .json({
          message:
            "Invalid webhook payload",
        });
    }

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
              "Refunded" &&
            order.refundStatus !==
              "Processed"
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
            "Paid" &&
          order.paymentStatus !==
            "Refunded"
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
          if (
            order.paymentStatus !==
              "Refunded" &&
            order.refundStatus !==
              "Processed"
          ) {
            order.paymentStatus =
              "Paid";
          }

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


    // =========================
    // REFUND CREATED
    // =========================

    if (
      event ===
      "refund.created"
    ) {
      const refund =
        payload.payload
          ?.refund
          ?.entity;

      if (refund) {
        const order =
          await findRefundOrder(
            refund
          );

        if (order) {
          const expectedAmount =
            Math.round(
              Number(
                order.total
              ) *
                100
            );

          if (
            order.paymentMethod ===
              "online" &&
            refund.payment_id ===
              order
                .razorpayPaymentId &&
            Number(
              refund.amount
            ) ===
              expectedAmount
          ) {
            order.razorpayRefundId =
              refund.id;

            order.refundAmount =
              Number(
                refund.amount
              ) /
              100;

            if (
              order.refundStatus !==
              "Processed"
            ) {
              order.refundStatus =
                "Pending";
            }

            await order.save();
          }
        }
      }
    }


    // =========================
    // REFUND PROCESSED
    // =========================

    if (
      event ===
      "refund.processed"
    ) {
      const refund =
        payload.payload
          ?.refund
          ?.entity;

      if (refund) {
        const order =
          await findRefundOrder(
            refund
          );

        if (order) {
          await finalizeRefund(
            order._id,
            refund
          );
        }
      }
    }


    // =========================
    // REFUND FAILED
    // =========================

    if (
      event ===
      "refund.failed"
    ) {
      const refund =
        payload.payload
          ?.refund
          ?.entity;

      if (refund) {
        const order =
          await findRefundOrder(
            refund
          );

        if (order) {
          const expectedAmount =
            Math.round(
              Number(
                order.total
              ) *
                100
            );

          if (
            order.paymentMethod ===
              "online" &&
            refund.payment_id ===
              order
                .razorpayPaymentId &&
            Number(
              refund.amount
            ) ===
              expectedAmount &&
            order.refundStatus !==
              "Processed"
          ) {
            order.razorpayRefundId =
              refund.id;

            order.refundAmount =
              Number(
                refund.amount
              ) /
              100;

            order.refundStatus =
              "Failed";

            await order.save();
          }
        }
      }
    }


    return res
      .status(200)
      .json({
        received: true,
      });

  } catch (error) {
    console.error(
      "Razorpay webhook error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Webhook processing failed",
      });
  }
}


module.exports = {
  router,
  webhookHandler,
};