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


// =========================
// VERIFY RAZORPAY SIGNATURE
// =========================

function verifyRazorpayPayment({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) {
  if (
    typeof razorpay_order_id !== "string" ||
    typeof razorpay_payment_id !== "string" ||
    typeof razorpay_signature !== "string"
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

  const expectedBuffer =
    Buffer.from(expectedSignature);

  const receivedBuffer =
    Buffer.from(razorpay_signature);

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
// CUSTOMER VALIDATION
// =========================

function validateCustomer(customer) {
  if (
    !customer ||
    typeof customer !== "object" ||
    Array.isArray(customer)
  ) {
    return {
      valid: false,
      message:
        "Customer information is required",
    };
  }

  const name =
    typeof customer.name === "string"
      ? customer.name.trim()
      : "";

  const phone =
    typeof customer.phone === "string"
      ? customer.phone.trim()
      : "";

  const email =
    typeof customer.email === "string"
      ? customer.email
          .trim()
          .toLowerCase()
      : "";

  const address =
    typeof customer.address === "string"
      ? customer.address.trim()
      : "";

  const city =
    typeof customer.city === "string"
      ? customer.city.trim()
      : "";

  const state =
    typeof customer.state === "string"
      ? customer.state.trim()
      : "";

  const pincode =
    typeof customer.pincode === "string"
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
      // ORDER ID VALIDATION
      // =========================

      if (
        typeof orderId !== "string" ||
        !/^[A-Za-z0-9_-]{3,80}$/.test(
          orderId.trim()
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid order ID",
        });
      }

      const safeOrderId =
        orderId.trim();

      const duplicateOrder =
        await Order.exists({
          orderId: safeOrderId,
        });

      if (duplicateOrder) {
        return res.status(409).json({
          message:
            "This order already exists",
        });
      }


      // =========================
      // CUSTOMER VALIDATION
      // =========================

      const customerValidation =
        validateCustomer(customer);

      if (
        !customerValidation.valid
      ) {
        return res.status(400).json({
          message:
            customerValidation.message,
        });
      }

      const safeCustomer =
        customerValidation.customer;


      // =========================
      // ITEMS VALIDATION
      // =========================

      if (
        !Array.isArray(items) ||
        items.length === 0
      ) {
        return res.status(400).json({
          message:
            "Cart items are required",
        });
      }

      if (items.length > 50) {
        return res.status(400).json({
          message:
            "Too many products in one order",
        });
      }


      // =========================
      // PAYMENT METHOD
      // =========================

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
        return res.status(400).json({
          message:
            "Invalid payment method",
        });
      }


      // =========================
      // BASIC RAZORPAY CHECK
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

        if (existingPayment) {
          return res.status(409).json({
            message:
              "This payment has already been used",
          });
        }
      }


      // =========================
      // START TRANSACTION
      // =========================

      session.startTransaction();

      const orderItems = [];

      const seenProducts =
        new Set();

      let calculatedTotal = 0;


      // =========================
      // CHECK PRODUCTS
      // =========================

      for (const item of items) {
        if (
          !item ||
          typeof item !== "object"
        ) {
          await session.abortTransaction();

          return res.status(400).json({
            message:
              "Invalid cart item",
          });
        }

        const productId =
          item.id || item._id;

        if (
          !mongoose.Types
            .ObjectId
            .isValid(productId)
        ) {
          await session.abortTransaction();

          return res.status(400).json({
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

          return res.status(400).json({
            message:
              "Duplicate products are not allowed in an order",
          });
        }

        seenProducts.add(
          productIdString
        );

        const quantity =
          Number(item.quantity);

        if (
          !Number.isInteger(quantity) ||
          quantity <= 0 ||
          quantity > 100
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
              "A product in your cart no longer exists",
          });
        }


        // =========================
        // VALIDATE PRICE
        // =========================

        const price =
          Number(product.price);

        if (
          !Number.isFinite(price) ||
          price < 0
        ) {
          throw new Error(
            "Invalid product price in database"
          );
        }


        // =========================
        // CHECK STOCK
        // =========================

        const availableStock =
          Number(product.stock || 0);

        if (
          !Number.isFinite(
            availableStock
          ) ||
          availableStock <
            quantity
        ) {
          await session.abortTransaction();

          return res.status(400).json({
            message:
              `Only ${Math.max(
                0,
                availableStock
              )} item(s) of ${product.name} are available`,
          });
        }


        // =========================
        // CALCULATE DATABASE TOTAL
        // =========================

        calculatedTotal +=
          price * quantity;


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

      const expectedAmountInPaise =
        Math.round(
          finalTotal * 100
        );


      // =========================
      // VERIFY RAZORPAY DATA
      // =========================

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

          return res.status(400).json({
            message:
              "Unable to verify payment with Razorpay",
          });
        }


        // =========================
        // RAZORPAY ORDER CHECK
        // =========================

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

          return res.status(400).json({
            message:
              "Payment amount verification failed",
          });
        }


        // =========================
        // VERIFY PAYMENT USER
        // =========================

        if (
          String(
            razorpayOrder.notes
              ?.userId || ""
          ) !==
          String(req.user.id)
        ) {
          await session.abortTransaction();

          return res.status(403).json({
            message:
              "Payment does not belong to this user",
          });
        }


        // =========================
        // RAZORPAY PAYMENT CHECK
        // =========================

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

          return res.status(400).json({
            message:
              "Payment details do not match the order",
          });
        }


        // =========================
        // PAYMENT MUST BE CAPTURED
        // =========================

        if (
          razorpayPayment.status !==
          "captured"
        ) {
          await session.abortTransaction();

          return res.status(400).json({
            message:
              "Payment has not been captured",
          });
        }
      }


      // =========================
      // REDUCE STOCK
      // =========================

      for (
        const orderItem of
        orderItems
      ) {
        const product =
          await Product.findById(
            orderItem.id
          ).session(session);

        if (!product) {
          throw new Error(
            "Product disappeared during order creation"
          );
        }

        const availableStock =
          Number(product.stock || 0);

        if (
          availableStock <
          orderItem.quantity
        ) {
          await session.abortTransaction();

          return res.status(400).json({
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


      // =========================
      // CREATE ORDER
      // =========================

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
            },
          ],
          {
            session,
          }
        );

      const order =
        createdOrders[0];


      // =========================
      // COMMIT TRANSACTION
      // =========================

      await session.commitTransaction();


      // =========================
      // RESPONSE
      // =========================

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

      if (
        error?.code === 11000
      ) {
        return res.status(409).json({
          message:
            "Duplicate order detected",
        });
      }

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