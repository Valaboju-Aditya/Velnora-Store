const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================================================
   CART
========================================================= */

router.get(
  "/cart",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(
        req.user.id
      ).populate("cart.product");

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
      console.error(
        "Get cart error:",
        error
      );

      res.status(500).json({
        message: "Failed to load cart",
      });
    }
  }
);

router.put(
  "/cart",
  authMiddleware,
  async (req, res) => {
    try {
      const { cart } = req.body;

      if (!Array.isArray(cart)) {
        return res.status(400).json({
          message:
            "Cart must be an array",
        });
      }

      const user =
        await User.findById(
          req.user.id
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.cart = cart.map(
        (item) => ({
          product:
            item._id || item.id,

          quantity:
            Math.max(
              1,
              Number(
                item.quantity || 1
              )
            ),
        })
      );

      await user.save();

      const updatedUser =
        await User.findById(
          req.user.id
        ).populate("cart.product");

      const updatedCart =
        updatedUser.cart
          .filter(
            (item) =>
              item.product
          )
          .map((item) => ({
            ...item.product.toObject(),
            quantity:
              item.quantity,
          }));

      res.json(updatedCart);
    } catch (error) {
      console.error(
        "Update cart error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update cart",
      });
    }
  }
);


/* =========================================================
   WISHLIST
========================================================= */

router.get(
  "/wishlist",
  authMiddleware,
  async (req, res) => {
    try {
      const user =
        await User.findById(
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
        message:
          "Failed to load wishlist",
      });
    }
  }
);

router.put(
  "/wishlist",
  authMiddleware,
  async (req, res) => {
    try {
      const { wishlist } =
        req.body;

      if (
        !Array.isArray(
          wishlist
        )
      ) {
        return res
          .status(400)
          .json({
            message:
              "Wishlist must be an array",
          });
      }

      const user =
        await User.findById(
          req.user.id
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.wishlist =
        wishlist.map(
          (item) =>
            item._id ||
            item.id
        );

      await user.save();

      const updatedUser =
        await User.findById(
          req.user.id
        ).populate("wishlist");

      res.json(
        updatedUser.wishlist.filter(
          Boolean
        )
      );
    } catch (error) {
      console.error(
        "Update wishlist error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update wishlist",
      });
    }
  }
);


/* =========================================================
   ACCOUNT DETAILS
========================================================= */

router.get(
  "/account",
  authMiddleware,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user.id
        ).select(
          "-password"
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone:
          user.phone || "",
        role: user.role,
      });
    } catch (error) {
      console.error(
        "Get account error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to load account",
      });
    }
  }
);

router.put(
  "/account",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
      } = req.body;

      const user =
        await User.findById(
          req.user.id
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      if (
        typeof name === "string" &&
        name.trim()
      ) {
        user.name =
          name.trim();
      }

      if (
        typeof email === "string" &&
        email.trim()
      ) {
        const normalizedEmail =
          email
            .toLowerCase()
            .trim();

        const existingUser =
          await User.findOne({
            email:
              normalizedEmail,

            _id: {
              $ne:
                req.user.id,
            },
          });

        if (existingUser) {
          return res
            .status(409)
            .json({
              message:
                "Email is already in use",
            });
        }

        user.email =
          normalizedEmail;
      }

      if (
        typeof phone ===
        "string"
      ) {
        user.phone =
          phone.trim();
      }

      await user.save();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone:
          user.phone || "",
        role: user.role,
      });
    } catch (error) {
      console.error(
        "Update account error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update account",
      });
    }
  }
);


/* =========================================================
   SAVED ADDRESSES
========================================================= */

router.get(
  "/addresses",
  authMiddleware,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user.id
        ).select(
          "addresses"
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json(
        user.addresses || []
      );
    } catch (error) {
      console.error(
        "Get addresses error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to load addresses",
      });
    }
  }
);


/* =========================================================
   ADD ADDRESS
========================================================= */

router.post(
  "/addresses",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        fullName,
        phone,
        addressLine,
        city,
        state,
        pincode,
        isDefault,
      } = req.body;

      if (
        !fullName ||
        !phone ||
        !addressLine ||
        !city ||
        !state ||
        !pincode
      ) {
        return res.status(400).json({
          message:
            "All address fields are required",
        });
      }

      const user =
        await User.findById(
          req.user.id
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const shouldBeDefault =
        Boolean(isDefault) ||
        user.addresses.length === 0;

      if (shouldBeDefault) {
        user.addresses.forEach(
          (address) => {
            address.isDefault =
              false;
          }
        );
      }

      user.addresses.push({
        fullName:
          fullName.trim(),

        phone:
          phone.trim(),

        addressLine:
          addressLine.trim(),

        city:
          city.trim(),

        state:
          state.trim(),

        pincode:
          pincode.trim(),

        isDefault:
          shouldBeDefault,
      });

      await user.save();

      res.status(201).json(
        user.addresses
      );
    } catch (error) {
      console.error(
        "Add address error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to add address",
      });
    }
  }
);


/* =========================================================
   UPDATE ADDRESS
========================================================= */

router.put(
  "/addresses/:addressId",
  authMiddleware,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user.id
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const address =
        user.addresses.id(
          req.params.addressId
        );

      if (!address) {
        return res.status(404).json({
          message:
            "Address not found",
        });
      }

      const {
        fullName,
        phone,
        addressLine,
        city,
        state,
        pincode,
        isDefault,
      } = req.body;

      if (
        typeof fullName ===
          "string" &&
        fullName.trim()
      ) {
        address.fullName =
          fullName.trim();
      }

      if (
        typeof phone ===
          "string" &&
        phone.trim()
      ) {
        address.phone =
          phone.trim();
      }

      if (
        typeof addressLine ===
          "string" &&
        addressLine.trim()
      ) {
        address.addressLine =
          addressLine.trim();
      }

      if (
        typeof city ===
          "string" &&
        city.trim()
      ) {
        address.city =
          city.trim();
      }

      if (
        typeof state ===
          "string" &&
        state.trim()
      ) {
        address.state =
          state.trim();
      }

      if (
        typeof pincode ===
          "string" &&
        pincode.trim()
      ) {
        address.pincode =
          pincode.trim();
      }

      if (
        isDefault === true
      ) {
        user.addresses.forEach(
          (item) => {
            item.isDefault =
              false;
          }
        );

        address.isDefault =
          true;
      }

      await user.save();

      res.json(
        user.addresses
      );
    } catch (error) {
      console.error(
        "Update address error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update address",
      });
    }
  }
);


/* =========================================================
   SET DEFAULT ADDRESS
========================================================= */

router.put(
  "/addresses/:addressId/default",
  authMiddleware,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user.id
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const address =
        user.addresses.id(
          req.params.addressId
        );

      if (!address) {
        return res.status(404).json({
          message:
            "Address not found",
        });
      }

      user.addresses.forEach(
        (item) => {
          item.isDefault =
            String(item._id) ===
            String(address._id);
        }
      );

      await user.save();

      res.json(
        user.addresses
      );
    } catch (error) {
      console.error(
        "Set default address error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to set default address",
      });
    }
  }
);


/* =========================================================
   DELETE ADDRESS
========================================================= */

router.delete(
  "/addresses/:addressId",
  authMiddleware,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user.id
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const address =
        user.addresses.id(
          req.params.addressId
        );

      if (!address) {
        return res.status(404).json({
          message:
            "Address not found",
        });
      }

      const wasDefault =
        address.isDefault;

      user.addresses.pull(
        req.params.addressId
      );

      if (
        wasDefault &&
        user.addresses.length > 0
      ) {
        user.addresses[0].isDefault =
          true;
      }

      await user.save();

      res.json(
        user.addresses
      );
    } catch (error) {
      console.error(
        "Delete address error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to delete address",
      });
    }
  }
);


module.exports = router;