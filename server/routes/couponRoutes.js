const express = require("express");
const Coupon = require("../models/Coupon");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();


function normalizeCode(code) {
  if (
    typeof code !== "string"
  ) {
    return "";
  }

  return code
    .trim()
    .toUpperCase();
}


function parseOptionalNumber(
  value,
  {
    defaultValue = null,
    allowZero = true,
    integer = false,
  } = {}
) {
  if (
    value === "" ||
    value === undefined ||
    value === null
  ) {
    return {
      valid: true,
      value: defaultValue,
    };
  }

  const numericValue =
    Number(value);

  if (
    !Number.isFinite(
      numericValue
    )
  ) {
    return {
      valid: false,
    };
  }

  if (
    allowZero
      ? numericValue < 0
      : numericValue <= 0
  ) {
    return {
      valid: false,
    };
  }

  if (
    integer &&
    !Number.isInteger(
      numericValue
    )
  ) {
    return {
      valid: false,
    };
  }

  return {
    valid: true,
    value: numericValue,
  };
}


function parseExpiryDate(
  value
) {
  if (
    value === "" ||
    value === undefined ||
    value === null
  ) {
    return {
      valid: true,
      value: null,
    };
  }

  if (
    typeof value !== "string"
  ) {
    return {
      valid: false,
    };
  }

  const trimmed =
    value.trim();

  if (!trimmed) {
    return {
      valid: true,
      value: null,
    };
  }

  let date;

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(
      trimmed
    )
  ) {
    date =
      new Date(
        `${trimmed}T23:59:59.999Z`
      );
  } else {
    date =
      new Date(
        trimmed
      );
  }

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return {
      valid: false,
    };
  }

  return {
    valid: true,
    value: date,
  };
}


// =========================
// GET ALL COUPONS
// =========================

router.get(
  "/",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const coupons =
        await Coupon.find()
          .sort({
            createdAt: -1,
          });

      return res.json(
        coupons
      );

    } catch (error) {
      console.error(
        "Failed to fetch coupons:",
        error
      );

      return res
        .status(500)
        .json({
          message:
            "Failed to fetch coupons",
        });
    }
  }
);


// =========================
// CREATE COUPON
// =========================

router.post(
  "/",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const {
        code,
        discountType,
        discountValue,
        minimumOrderAmount,
        maximumDiscountAmount,
        usageLimit,
        expiresAt,
        isActive,
      } = req.body;


      const normalizedCode =
        normalizeCode(
          code
        );


      if (!normalizedCode) {
        return res
          .status(400)
          .json({
            message:
              "Coupon code is required",
          });
      }


      if (
        ![
          "percentage",
          "fixed",
        ].includes(
          discountType
        )
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid discount type",
          });
      }


      const numericDiscountValue =
        Number(
          discountValue
        );


      if (
        !Number.isFinite(
          numericDiscountValue
        ) ||
        numericDiscountValue <=
          0
      ) {
        return res
          .status(400)
          .json({
            message:
              "Discount value must be greater than 0",
          });
      }


      if (
        discountType ===
          "percentage" &&
        numericDiscountValue >
          100
      ) {
        return res
          .status(400)
          .json({
            message:
              "Percentage discount cannot exceed 100",
          });
      }


      const minimumResult =
        parseOptionalNumber(
          minimumOrderAmount,
          {
            defaultValue: 0,
            allowZero: true,
          }
        );


      if (
        !minimumResult.valid
      ) {
        return res
          .status(400)
          .json({
            message:
              "Minimum order amount must be 0 or greater",
          });
      }


      const maximumResult =
        parseOptionalNumber(
          maximumDiscountAmount,
          {
            defaultValue: null,
            allowZero: true,
          }
        );


      if (
        !maximumResult.valid
      ) {
        return res
          .status(400)
          .json({
            message:
              "Maximum discount amount must be 0 or greater",
          });
      }


      const usageResult =
        parseOptionalNumber(
          usageLimit,
          {
            defaultValue: null,
            allowZero: false,
            integer: true,
          }
        );


      if (
        !usageResult.valid
      ) {
        return res
          .status(400)
          .json({
            message:
              "Usage limit must be a positive whole number",
          });
      }


      const expiryResult =
        parseExpiryDate(
          expiresAt
        );


      if (
        !expiryResult.valid
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid expiry date",
          });
      }


      if (
        isActive !== undefined &&
        typeof isActive !==
          "boolean"
      ) {
        return res
          .status(400)
          .json({
            message:
              "isActive must be true or false",
          });
      }


      const existingCoupon =
        await Coupon.findOne({
          code:
            normalizedCode,
        });


      if (
        existingCoupon
      ) {
        return res
          .status(409)
          .json({
            message:
              "Coupon code already exists",
          });
      }


      const coupon =
        await Coupon.create({
          code:
            normalizedCode,

          discountType,

          discountValue:
            numericDiscountValue,

          minimumOrderAmount:
            minimumResult.value,

          maximumDiscountAmount:
            maximumResult.value,

          usageLimit:
            usageResult.value,

          expiresAt:
            expiryResult.value,

          isActive:
            isActive ===
            undefined
              ? true
              : isActive,
        });


      return res
        .status(201)
        .json(
          coupon
        );

    } catch (error) {
      console.error(
        "Failed to create coupon:",
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
              "Coupon code already exists",
          });
      }


      return res
        .status(500)
        .json({
          message:
            "Failed to create coupon",
        });
    }
  }
);


// =========================
// UPDATE COUPON
// =========================

router.put(
  "/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const coupon =
        await Coupon.findById(
          req.params.id
        );


      if (!coupon) {
        return res
          .status(404)
          .json({
            message:
              "Coupon not found",
          });
      }


      const {
        code,
        discountType,
        discountValue,
        minimumOrderAmount,
        maximumDiscountAmount,
        usageLimit,
        expiresAt,
        isActive,
      } = req.body;


      let finalCode =
        coupon.code;

      let finalDiscountType =
        coupon.discountType;

      let finalDiscountValue =
        Number(
          coupon.discountValue
        );

      let finalMinimumOrderAmount =
        Number(
          coupon.minimumOrderAmount ||
            0
        );

      let finalMaximumDiscountAmount =
        coupon.maximumDiscountAmount ===
        null
          ? null
          : Number(
              coupon.maximumDiscountAmount
            );

      let finalUsageLimit =
        coupon.usageLimit ===
        null
          ? null
          : Number(
              coupon.usageLimit
            );

      let finalExpiresAt =
        coupon.expiresAt;

      let finalIsActive =
        coupon.isActive;


      if (
        code !== undefined
      ) {
        finalCode =
          normalizeCode(
            code
          );


        if (!finalCode) {
          return res
            .status(400)
            .json({
              message:
                "Coupon code cannot be empty",
            });
        }


        const duplicate =
          await Coupon.findOne({
            code:
              finalCode,

            _id: {
              $ne:
                coupon._id,
            },
          });


        if (duplicate) {
          return res
            .status(409)
            .json({
              message:
                "Coupon code already exists",
            });
        }
      }


      if (
        discountType !==
        undefined
      ) {
        if (
          ![
            "percentage",
            "fixed",
          ].includes(
            discountType
          )
        ) {
          return res
            .status(400)
            .json({
              message:
                "Invalid discount type",
            });
        }


        finalDiscountType =
          discountType;
      }


      if (
        discountValue !==
        undefined
      ) {
        const value =
          Number(
            discountValue
          );


        if (
          !Number.isFinite(
            value
          ) ||
          value <= 0
        ) {
          return res
            .status(400)
            .json({
              message:
                "Discount value must be greater than 0",
            });
        }


        finalDiscountValue =
          value;
      }


      if (
        finalDiscountType ===
          "percentage" &&
        finalDiscountValue >
          100
      ) {
        return res
          .status(400)
          .json({
            message:
              "Percentage discount cannot exceed 100",
          });
      }


      if (
        minimumOrderAmount !==
        undefined
      ) {
        const result =
          parseOptionalNumber(
            minimumOrderAmount,
            {
              defaultValue: 0,
              allowZero: true,
            }
          );


        if (!result.valid) {
          return res
            .status(400)
            .json({
              message:
                "Minimum order amount must be 0 or greater",
            });
        }


        finalMinimumOrderAmount =
          result.value;
      }


      if (
        maximumDiscountAmount !==
        undefined
      ) {
        const result =
          parseOptionalNumber(
            maximumDiscountAmount,
            {
              defaultValue: null,
              allowZero: true,
            }
          );


        if (!result.valid) {
          return res
            .status(400)
            .json({
              message:
                "Maximum discount amount must be 0 or greater",
            });
        }


        finalMaximumDiscountAmount =
          result.value;
      }


      if (
        usageLimit !==
        undefined
      ) {
        const result =
          parseOptionalNumber(
            usageLimit,
            {
              defaultValue: null,
              allowZero: false,
              integer: true,
            }
          );


        if (!result.valid) {
          return res
            .status(400)
            .json({
              message:
                "Usage limit must be a positive whole number",
            });
        }


        finalUsageLimit =
          result.value;
      }


      if (
        expiresAt !==
        undefined
      ) {
        const result =
          parseExpiryDate(
            expiresAt
          );


        if (!result.valid) {
          return res
            .status(400)
            .json({
              message:
                "Invalid expiry date",
            });
        }


        finalExpiresAt =
          result.value;
      }


      if (
        isActive !==
        undefined
      ) {
        if (
          typeof isActive !==
          "boolean"
        ) {
          return res
            .status(400)
            .json({
              message:
                "isActive must be true or false",
            });
        }


        finalIsActive =
          isActive;
      }


      if (
        finalUsageLimit !==
          null &&
        finalUsageLimit <
          Number(
            coupon.usedCount ||
              0
          )
      ) {
        return res
          .status(400)
          .json({
            message:
              `Usage limit cannot be lower than the current used count (${coupon.usedCount})`,
          });
      }


      coupon.code =
        finalCode;

      coupon.discountType =
        finalDiscountType;

      coupon.discountValue =
        finalDiscountValue;

      coupon.minimumOrderAmount =
        finalMinimumOrderAmount;

      coupon.maximumDiscountAmount =
        finalMaximumDiscountAmount;

      coupon.usageLimit =
        finalUsageLimit;

      coupon.expiresAt =
        finalExpiresAt;

      coupon.isActive =
        finalIsActive;


      const updatedCoupon =
        await coupon.save();


      return res.json(
        updatedCoupon
      );

    } catch (error) {
      console.error(
        "Failed to update coupon:",
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
              "Coupon code already exists",
          });
      }


      return res
        .status(500)
        .json({
          message:
            "Failed to update coupon",
        });
    }
  }
);


// =========================
// DELETE COUPON
// =========================

router.delete(
  "/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const coupon =
        await Coupon.findById(
          req.params.id
        );


      if (!coupon) {
        return res
          .status(404)
          .json({
            message:
              "Coupon not found",
          });
      }


      await coupon.deleteOne();


      return res.json({
        message:
          "Coupon deleted successfully",
      });

    } catch (error) {
      console.error(
        "Failed to delete coupon:",
        error
      );


      return res
        .status(500)
        .json({
          message:
            "Failed to delete coupon",
        });
    }
  }
);


// =========================
// VALIDATE COUPON
// UI PREVIEW ONLY
// =========================

router.post(
  "/validate",
  async (req, res) => {
    try {
      const {
        code,
        orderAmount,
      } = req.body;


      const normalizedCode =
        normalizeCode(
          code
        );


      if (!normalizedCode) {
        return res
          .status(400)
          .json({
            message:
              "Coupon code is required",
          });
      }


      const amount =
        Number(
          orderAmount
        );


      if (
        !Number.isFinite(
          amount
        ) ||
        amount < 0
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid order amount",
          });
      }


      const coupon =
        await Coupon.findOne({
          code:
            normalizedCode,
        });


      if (!coupon) {
        return res
          .status(404)
          .json({
            message:
              "Invalid coupon code",
          });
      }


      if (
        !coupon.isActive
      ) {
        return res
          .status(400)
          .json({
            message:
              "This coupon is inactive",
          });
      }


      if (
        coupon.expiresAt &&
        new Date() >
          new Date(
            coupon.expiresAt
          )
      ) {
        return res
          .status(400)
          .json({
            message:
              "This coupon has expired",
          });
      }


      if (
        coupon.usageLimit !==
          null &&
        Number(
          coupon.usedCount ||
            0
        ) >=
          Number(
            coupon.usageLimit
          )
      ) {
        return res
          .status(400)
          .json({
            message:
              "This coupon has reached its usage limit",
          });
      }


      const minimumOrderAmount =
        Number(
          coupon.minimumOrderAmount ||
            0
        );


      if (
        amount <
        minimumOrderAmount
      ) {
        return res
          .status(400)
          .json({
            message:
              `Minimum order amount is ₹${minimumOrderAmount}`,
          });
      }


      const discountValue =
        Number(
          coupon.discountValue
        );


      if (
        !Number.isFinite(
          discountValue
        ) ||
        discountValue <= 0
      ) {
        return res
          .status(400)
          .json({
            message:
              "Coupon configuration is invalid",
          });
      }


      let discountAmount =
        0;


      if (
        coupon.discountType ===
        "percentage"
      ) {
        if (
          discountValue >
          100
        ) {
          return res
            .status(400)
            .json({
              message:
                "Coupon configuration is invalid",
            });
        }


        discountAmount =
          (
            amount *
            discountValue
          ) / 100;


        if (
          coupon.maximumDiscountAmount !==
          null
        ) {
          const maximumDiscount =
            Number(
              coupon.maximumDiscountAmount
            );


          if (
            !Number.isFinite(
              maximumDiscount
            ) ||
            maximumDiscount <
              0
          ) {
            return res
              .status(400)
              .json({
                message:
                  "Coupon configuration is invalid",
              });
          }


          discountAmount =
            Math.min(
              discountAmount,
              maximumDiscount
            );
        }

      } else if (
        coupon.discountType ===
        "fixed"
      ) {
        discountAmount =
          discountValue;

      } else {
        return res
          .status(400)
          .json({
            message:
              "Coupon configuration is invalid",
          });
      }


      discountAmount =
        Math.min(
          discountAmount,
          amount
        );


      discountAmount =
        Math.round(
          discountAmount *
            100
        ) / 100;


      const finalAmount =
        Math.max(
          0,
          Math.round(
            (
              amount -
              discountAmount
            ) *
              100
          ) / 100
        );


      return res.json({
        valid: true,

        coupon: {
          id:
            coupon._id,

          code:
            coupon.code,

          discountType:
            coupon.discountType,

          discountValue:
            coupon.discountValue,
        },

        discountAmount,

        finalAmount,
      });

    } catch (error) {
      console.error(
        "Failed to validate coupon:",
        error
      );


      return res
        .status(500)
        .json({
          message:
            "Failed to validate coupon",
        });
    }
  }
);


module.exports = router;