const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const Order = require("../models/Order");
const Product = require("../models/Product");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function createRazorpayRefund({
  paymentId,
  amount,
  orderId,
  userId,
}) {
  const idempotencyKey =
    `velnora_refund_${orderId}`;

  const credentials =
    Buffer.from(
      `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
    ).toString("base64");

  const response =
    await fetch(
      `https://api.razorpay.com/v1/payments/${encodeURIComponent(
        paymentId
      )}/refund`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Basic ${credentials}`,

          "Content-Type":
            "application/json",

          "X-Refund-Idempotency":
            idempotencyKey,
        },

        body: JSON.stringify({
          amount,

          speed: "normal",

          notes: {
            orderId:
              String(orderId),

            userId:
              String(userId),
          },
        }),
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    const error =
      new Error(
        data?.error?.description ||
          "Razorpay refund request failed"
      );

    error.status =
      response.status;

    error.razorpayData =
      data;

    throw error;
  }

  return data;
}

async function finalizeRefundedOrder(
  mongoOrderId,
  refund
) {
  const session =
    await mongoose.startSession();

  try {
    await session.withTransaction(
      async () => {
        const order =
          await Order.findById(
            mongoOrderId
          ).session(session);

        if (!order) {
          throw new Error(
            "Order not found while finalizing refund"
          );
        }

        if (!order.stockRestored) {
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
              ).session(session);

            if (!product) {
              throw new Error(
                `Product not found: ${item.name}`
              );
            }

            product.stock =
              Number(
                product.stock || 0
              ) +
              Number(
                item.quantity || 0
              );

            await product.save({
              session,
            });
          }

          order.stockRestored =
            true;
        }

        order.refundStatus =
          "Processed";

        order.paymentStatus =
          "Refunded";

        order.status =
          "Cancelled";

        order.razorpayRefundId =
          refund.id;

        order.refundAmount =
          Number(
            refund.amount || 0
          ) / 100;

        order.refundedAt =
          new Date();

        await order.save({
          session,
        });
      }
    );
  } finally {
    await session.endSession();
  }
}

function verifyRazorpayPayment({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) {
  if (
    typeof razorpay_order_id !==
      "string" ||
    typeof razorpay_payment_id !==
      "string" ||
    typeof razorpay_signature !==
      "string"
  ) {
    return false;
  }

  const body =
    `${razorpay_order_id}|${razorpay_payment_id}`;

  const expectedSignature =
    crypto
      .createHmac(
        "sha256",
        process.env
          .RAZORPAY_KEY_SECRET
      )
      .update(body)
      .digest("hex");

  const expectedBuffer =
    Buffer.from(
      expectedSignature
    );

  const receivedBuffer =
    Buffer.from(
      razorpay_signature
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

function validateCustomer(
  customer
) {
  if (
    !customer ||
    typeof customer !==
      "object" ||
    Array.isArray(customer)
  ) {
    return {
      valid: false,
      message:
        "Customer information is required",
    };
  }

  const name =
    typeof customer.name ===
    "string"
      ? customer.name.trim()
      : "";

  const phone =
    typeof customer.phone ===
    "string"
      ? customer.phone.trim()
      : "";

  const email =
    typeof customer.email ===
    "string"
      ? customer.email
          .trim()
          .toLowerCase()
      : "";

  const address =
    typeof customer.address ===
    "string"
      ? customer.address.trim()
      : "";

  const city =
    typeof customer.city ===
    "string"
      ? customer.city.trim()
      : "";

  const state =
    typeof customer.state ===
    "string"
      ? customer.state.trim()
      : "";

  const pincode =
    typeof customer.pincode ===
    "string"
      ? customer.pincode.trim()
      : "";

  if (
    name.length < 2 ||
    name.length > 100
  ) {
    return {
      valid: false,
      message:
        "Please enter a valid customer name",
    };
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    email.length > 254 ||
    !emailRegex.test(email)
  ) {
    return {
      valid: false,
      message:
        "Please enter a valid email address",
    };
  }

  const phoneDigits =
    phone.replace(/\D/g, "");

  if (
    phoneDigits.length < 7 ||
    phoneDigits.length > 15
  ) {
    return {
      valid: false,
      message:
        "Please enter a valid phone number",
    };
  }

  if (
    address.length < 5 ||
    address.length > 300
  ) {
    return {
      valid: false,
      message:
        "Please enter a valid address",
    };
  }

  if (
    city.length < 2 ||
    city.length > 100
  ) {
    return {
      valid: false,
      message:
        "Please enter a valid city",
    };
  }

  if (
    state.length < 2 ||
    state.length > 100
  ) {
    return {
      valid: false,
      message:
        "Please enter a valid state",
    };
  }

  if (
    pincode.length < 4 ||
    pincode.length > 10
  ) {
    return {
      valid: false,
      message:
        "Please enter a valid pincode",
    };
  }

  return {
    valid: true,

    customer: {
      name,
      phone,
      email,
      address,
      city,
      state,
      pincode,
    },
  };
}

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

      if (
        typeof orderId !==
          "string" ||
        !/^[A-Za-z0-9_-]{3,80}$/.test(
          orderId.trim()
        )
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid order ID",
          });
      }

      const safeOrderId =
        orderId.trim();

      const duplicateOrder =
        await Order.exists({
          orderId:
            safeOrderId,
        });

      if (duplicateOrder) {
        return res
          .status(409)
          .json({
            message:
              "This order already exists",
          });
      }

      const customerValidation =
        validateCustomer(
          customer
        );

      if (
        !customerValidation.valid
      ) {
        return res
          .status(400)
          .json({
            message:
              customerValidation.message,
          });
      }

      const safeCustomer =
        customerValidation.customer;

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

      if (
        items.length > 50
      ) {
        return res
          .status(400)
          .json({
            message:
              "Too many products in one order",
          });
      }

      const selectedPaymentMethod =
        paymentMethod || "cod";

      if (
        ![
          "cod",
          "online",
        ].includes(
          selectedPaymentMethod
        )
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid payment method",
          });
      }

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

        if (
          !paymentVerified
        ) {
          return res
            .status(400)
            .json({
              message:
                "Payment verification failed",
            });
        }

        const existingPayment =
          await Order.findOne({
            $or: [
              {
                razorpayOrderId:
                  razorpay_order_id,
              },
              {
                razorpayPaymentId:
                  razorpay_payment_id,
              },
            ],
          });

        if (
          existingPayment
        ) {
          return res
            .status(409)
            .json({
              message:
                "This payment has already been used",
            });
        }
      }

      session.startTransaction();

      const orderItems = [];

      const seenProducts =
        new Set();

      let calculatedTotal = 0;

      for (
        const item of
        items
      ) {
        if (
          !item ||
          typeof item !==
            "object"
        ) {
          await session.abortTransaction();

          return res
            .status(400)
            .json({
              message:
                "Invalid cart item",
            });
        }

        const productId =
          item.id ||
          item._id;

        if (
          !mongoose.Types
            .ObjectId
            .isValid(
              productId
            )
        ) {
          await session.abortTransaction();

          return res
            .status(400)
            .json({
              message:
                "Invalid product ID",
            });
        }

        const productIdString =
          String(productId);

        if (
          seenProducts.has(
            productIdString
          )
        ) {
          await session.abortTransaction();

          return res
            .status(400)
            .json({
              message:
                "Duplicate products are not allowed in an order",
            });
        }

        seenProducts.add(
          productIdString
        );

        const quantity =
          Number(
            item.quantity
          );

        if (
          !Number.isInteger(
            quantity
          ) ||
          quantity <= 0 ||
          quantity > 100
        ) {
          await session.abortTransaction();

          return res
            .status(400)
            .json({
              message:
                "Invalid product quantity",
            });
        }

        const product =
          await Product.findById(
            productId
          ).session(
            session
          );

        if (!product) {
          await session.abortTransaction();

          return res
            .status(404)
            .json({
              message:
                "A product in your cart no longer exists",
            });
        }

        const price =
          Number(
            product.price
          );

        if (
          !Number.isFinite(
            price
          ) ||
          price < 0
        ) {
          throw new Error(
            "Invalid product price in database"
          );
        }

        const availableStock =
          Number(
            product.stock ||
              0
          );

        if (
          !Number.isFinite(
            availableStock
          ) ||
          availableStock <
            quantity
        ) {
          await session.abortTransaction();

          return res
            .status(400)
            .json({
              message:
                `Only ${Math.max(
                  0,
                  availableStock
                )} item(s) of ${product.name} are available`,
            });
        }

        calculatedTotal +=
          price *
          quantity;

        orderItems.push({
          id:
            product._id.toString(),

          name:
            product.name,

          price,

          quantity,

          image:
            product.image ||
            "",
        });
      }

      const shipping =
        calculatedTotal >=
          999 ||
        calculatedTotal ===
          0
          ? 0
          : 99;

      const finalTotal =
        calculatedTotal +
        shipping;

      const expectedAmountInPaise =
        Math.round(
          finalTotal * 100
        );

      if (
        selectedPaymentMethod ===
        "online"
      ) {
        let razorpayOrder;
        let razorpayPayment;

        try {
          razorpayOrder =
            await razorpay.orders.fetch(
              razorpay_order_id
            );

          razorpayPayment =
            await razorpay.payments.fetch(
              razorpay_payment_id
            );
        } catch {
          await session.abortTransaction();

          return res
            .status(400)
            .json({
              message:
                "Unable to verify payment with Razorpay",
            });
        }

        if (
          razorpayOrder.id !==
            razorpay_order_id ||
          Number(
            razorpayOrder.amount
          ) !==
            expectedAmountInPaise ||
          razorpayOrder.currency !==
            "INR"
        ) {
          await session.abortTransaction();

          return res
            .status(400)
            .json({
              message:
                "Payment amount verification failed",
            });
        }

        if (
          String(
            razorpayOrder
              .notes
              ?.userId ||
              ""
          ) !==
          String(
            req.user.id
          )
        ) {
          await session.abortTransaction();

          return res
            .status(403)
            .json({
              message:
                "Payment does not belong to this user",
            });
        }

        if (
          razorpayPayment.id !==
            razorpay_payment_id ||
          razorpayPayment.order_id !==
            razorpay_order_id ||
          Number(
            razorpayPayment.amount
          ) !==
            expectedAmountInPaise ||
          razorpayPayment.currency !==
            "INR"
        ) {
          await session.abortTransaction();

          return res
            .status(400)
            .json({
              message:
                "Payment details do not match the order",
            });
        }

        if (
          razorpayPayment.status !==
          "captured"
        ) {
          await session.abortTransaction();

          return res
            .status(400)
            .json({
              message:
                "Payment has not been captured",
            });
        }
      }

      for (
        const orderItem of
        orderItems
      ) {
        const product =
          await Product.findById(
            orderItem.id
          ).session(
            session
          );

        if (!product) {
          throw new Error(
            "Product disappeared during order creation"
          );
        }

        const availableStock =
          Number(
            product.stock ||
              0
          );

        if (
          availableStock <
          orderItem.quantity
        ) {
          await session.abortTransaction();

          return res
            .status(400)
            .json({
              message:
                `Only ${availableStock} item(s) of ${product.name} are available`,
            });
        }

        product.stock =
          availableStock -
          orderItem.quantity;

        await product.save({
          session,
        });
      }

      const createdOrders =
        await Order.create(
          [
            {
              orderId:
                safeOrderId,

              userId:
                req.user.id,

              customer:
                safeCustomer,

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

              refundStatus:
                "None",

              refundAmount:
                0,

              stockRestored:
                false,
            },
          ],
          {
            session,
          }
        );

      const order =
        createdOrders[0];

      await session.commitTransaction();

      return res
        .status(201)
        .json({
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

      if (
        error?.code ===
        11000
      ) {
        return res
          .status(409)
          .json({
            message:
              "Duplicate order detected",
          });
      }

      return res
        .status(500)
        .json({
          message:
            "Failed to create order",
        });

    } finally {
      await session.endSession();
    }
  }
);

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

      return res.json(
        orders
      );

    } catch (error) {
      console.error(
        "Failed to fetch user orders:",
        error
      );

      return res
        .status(500)
        .json({
          message:
            "Failed to fetch orders",
        });
    }
  }
);

router.patch(
  "/:orderId/cancel",
  protect,
  async (req, res) => {
    try {
      const order =
        await Order.findOne({
          orderId:
            req.params.orderId,

          userId:
            req.user.id,
        });

      if (!order) {
        return res
          .status(404)
          .json({
            message:
              "Order not found",
          });
      }

      if (
        order.status ===
        "Cancelled"
      ) {
        return res.json({
          message:
            "Order is already cancelled",

          order,
        });
      }

      if (
        order.status !==
        "Order Confirmed"
      ) {
        return res
          .status(400)
          .json({
            message:
              "This order can no longer be cancelled",
          });
      }

      if (
        order.paymentMethod ===
        "cod"
      ) {
        const session =
          await mongoose.startSession();

        try {
          await session.withTransaction(
            async () => {
              const currentOrder =
                await Order.findById(
                  order._id
                ).session(
                  session
                );

              if (
                !currentOrder
              ) {
                throw new Error(
                  "Order not found"
                );
              }

              if (
                currentOrder.status ===
                "Cancelled"
              ) {
                return;
              }

              if (
                currentOrder.status !==
                "Order Confirmed"
              ) {
                throw new Error(
                  "This order can no longer be cancelled"
                );
              }

              if (
                !currentOrder.stockRestored
              ) {
                for (
                  const item of
                  currentOrder.items
                ) {
                  if (
                    !mongoose.Types.ObjectId.isValid(
                      item.id
                    )
                  ) {
                    throw new Error(
                      "Invalid product ID in order"
                    );
                  }

                  const product =
                    await Product.findById(
                      item.id
                    ).session(
                      session
                    );

                  if (
                    !product
                  ) {
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

                currentOrder.stockRestored =
                  true;
              }

              currentOrder.status =
                "Cancelled";

              await currentOrder.save({
                session,
              });
            }
          );

        } finally {
          await session.endSession();
        }

        const cancelledOrder =
          await Order.findById(
            order._id
          );

        return res.json({
          message:
            "Order cancelled successfully",

          order:
            cancelledOrder,
        });
      }

      if (
        order.paymentMethod !==
        "online"
      ) {
        return res
          .status(400)
          .json({
            message:
              "Unsupported payment method",
          });
      }

      if (
        order.paymentStatus !==
          "Paid" &&
        order.paymentStatus !==
          "Refunded"
      ) {
        return res
          .status(400)
          .json({
            message:
              "This payment cannot be refunded",
          });
      }

      if (
        !order
          .razorpayPaymentId
      ) {
        return res
          .status(400)
          .json({
            message:
              "Razorpay payment ID is missing",
          });
      }

      if (
        order.refundStatus ===
          "Processed" &&
        order.paymentStatus ===
          "Refunded"
      ) {
        return res.json({
          message:
            "Refund already processed",

          order,
        });
      }

      if (
        order.refundStatus ===
        "Failed"
      ) {
        return res
          .status(409)
          .json({
            message:
              "Previous refund attempt failed. Please contact support.",
          });
      }

      let payment;

      try {
        payment =
          await razorpay.payments.fetch(
            order
              .razorpayPaymentId
          );

      } catch (error) {
        console.error(
          "Razorpay payment fetch error:",
          error
        );

        return res
          .status(502)
          .json({
            message:
              "Unable to verify payment with Razorpay",
          });
      }

      const refundAmountPaise =
        Math.round(
          Number(
            order.total
          ) * 100
        );

      if (
        payment.id !==
          order
            .razorpayPaymentId ||
        Number(
          payment.amount
        ) !==
          refundAmountPaise ||
        payment.currency !==
          "INR"
      ) {
        return res
          .status(400)
          .json({
            message:
              "Payment details do not match this order",
          });
      }

      if (
        payment.status !==
        "captured"
      ) {
        return res
          .status(400)
          .json({
            message:
              "Only captured payments can be refunded",
          });
      }

      if (
        order.refundStatus ===
        "None"
      ) {
        order.refundStatus =
          "Pending";

        order.refundAmount =
          Number(
            order.total
          );

        await order.save();
      }

      let refund;

      try {
        refund =
          await createRazorpayRefund({
            paymentId:
              order
                .razorpayPaymentId,

            amount:
              refundAmountPaise,

            orderId:
              order.orderId,

            userId:
              req.user.id,
          });

      } catch (error) {
        console.error(
          "Razorpay refund error:",
          error
            .razorpayData ||
            error
        );

        if (
          error.status !==
          409
        ) {
          order.refundStatus =
            "Failed";

          await order.save();
        }

        if (
          error.status ===
          409
        ) {
          return res
            .status(409)
            .json({
              message:
                "Refund is already being processed. Please try again shortly.",
            });
        }

        return res
          .status(502)
          .json({
            message:
              "Unable to process refund",
          });
      }

      if (
        !refund?.id ||
        refund.payment_id !==
          order
            .razorpayPaymentId ||
        Number(
          refund.amount
        ) !==
          refundAmountPaise
      ) {
        return res
          .status(502)
          .json({
            message:
              "Invalid refund response from Razorpay",
          });
      }

      order.razorpayRefundId =
        refund.id;

      order.refundAmount =
        Number(
          refund.amount
        ) / 100;

      if (
        refund.status ===
        "processed"
      ) {
        await finalizeRefundedOrder(
          order._id,
          refund
        );

        const refundedOrder =
          await Order.findById(
            order._id
          );

        return res.json({
          message:
            "Order cancelled and refund processed successfully",

          order:
            refundedOrder,
        });
      }

      if (
        refund.status ===
        "failed"
      ) {
        order.refundStatus =
          "Failed";

        await order.save();

        return res
          .status(502)
          .json({
            message:
              "Refund failed. Please contact support.",
          });
      }

      order.refundStatus =
        "Pending";

      await order.save();

      return res
        .status(202)
        .json({
          message:
            "Refund initiated. Your cancellation is being processed.",

          order,
        });

    } catch (error) {
      console.error(
        "Cancel order error:",
        error
      );

      return res
        .status(500)
        .json({
          message:
            "Failed to cancel order",
        });
    }
  }
);

module.exports = router;