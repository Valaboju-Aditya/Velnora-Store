import { Link } from "react-router-dom";

import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

function Cart({ cart, setCart }) {

  // =========================
  // UPDATE QUANTITY
  // =========================

  function updateQuantity(
    productId,
    change
  ) {
    setCart((current) =>
      current.map((item) => {
        const itemId =
          item._id || item.id;

        if (itemId !== productId) {
          return item;
        }

        const stock =
          Number(item.stock ?? 0);

        let newQuantity =
          item.quantity + change;

        newQuantity =
          Math.max(
            1,
            newQuantity
          );

        if (
          stock > 0 &&
          newQuantity > stock
        ) {
          newQuantity = stock;
        }

        return {
          ...item,
          quantity: newQuantity,
        };
      })
    );
  }


  // =========================
  // REMOVE PRODUCT
  // =========================

  function removeItem(productId) {
    setCart((current) =>
      current.filter((item) => {
        const itemId =
          item._id || item.id;

        return itemId !== productId;
      })
    );
  }


  // =========================
  // CALCULATIONS
  // =========================

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        Number(item.quantity),
    0
  );

  const shipping =
    subtotal >= 999 ||
    subtotal === 0
      ? 0
      : 99;

  const total =
    subtotal + shipping;

  const totalItems =
    cart.reduce(
      (total, item) =>
        total +
        Number(item.quantity),
      0
    );


  // =========================
  // EMPTY CART
  // =========================

  if (cart.length === 0) {
    return (
      <div className="cart-page">

        <div className="empty-cart">

          <ShoppingBag size={60} />

          <h1>
            Your Cart Is Empty
          </h1>

          <p>
            Looks like you haven't added
            anything to your cart yet.
          </p>

          <Link
            to="/shop"
            className="continue-shopping"
          >
            Continue Shopping

            <ArrowRight size={18} />
          </Link>

        </div>

      </div>
    );
  }


  // =========================
  // CART PAGE
  // =========================

  return (
    <div className="cart-page">

      <div className="cart-container">

        {/* HEADER */}

        <div className="cart-header">

          <div>
            <p>
              YOUR BAG
            </p>

            <h1>
              Shopping Cart
            </h1>
          </div>

          <span>
            {totalItems}{" "}
            {totalItems === 1
              ? "item"
              : "items"}
          </span>

        </div>


        {/* MAIN CART */}

        <div className="cart-layout">


          {/* PRODUCTS */}

          <div className="cart-products">

            {cart.map((item) => {
              const productId =
                item._id || item.id;

              const stock =
                Number(item.stock ?? 0);

              const outOfStock =
                stock <= 0;

              const maxReached =
                stock > 0 &&
                item.quantity >= stock;

              return (

                <div
                  className="cart-item"
                  key={productId}
                >

                  {/* PRODUCT IMAGE */}

                  <Link
                    to={`/product/${productId}`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  </Link>


                  {/* PRODUCT INFORMATION */}

                  <div className="cart-item-info">

                    <Link
                      to={`/product/${productId}`}
                    >
                      <h3>
                        {item.name}
                      </h3>
                    </Link>


                    {item.category && (
                      <p>
                        {item.category}
                      </p>
                    )}


                    <strong>
                      ₹
                      {Number(
                        item.price || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>


                    {/* STOCK */}

                    <p className="cart-stock">

                      {outOfStock
                        ? "Out of Stock"
                        : `${stock} in stock`}

                    </p>


                    {/* ACTIONS */}

                    <div className="cart-item-actions">


                      {/* QUANTITY */}

                      <div className="quantity-control">

                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            updateQuantity(
                              productId,
                              -1
                            )
                          }
                          disabled={
                            item.quantity <= 1
                          }
                        >
                          <Minus size={15} />
                        </button>


                        <span>
                          {item.quantity}
                        </span>


                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() =>
                            updateQuantity(
                              productId,
                              1
                            )
                          }
                          disabled={
                            outOfStock ||
                            maxReached
                          }
                        >
                          <Plus size={15} />
                        </button>

                      </div>


                      {/* STOCK LIMIT MESSAGE */}

                      {maxReached && (
                        <span className="cart-stock-limit">
                          Maximum stock reached
                        </span>
                      )}


                      {/* REMOVE */}

                      <button
                        type="button"
                        className="remove-item"
                        onClick={() =>
                          removeItem(
                            productId
                          )
                        }
                      >
                        <Trash2 size={16} />

                        Remove
                      </button>

                    </div>

                  </div>


                  {/* ITEM TOTAL */}

                  <div className="cart-item-total">

                    ₹
                    {(
                      Number(
                        item.price || 0
                      ) *
                      Number(
                        item.quantity || 0
                      )
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </div>

                </div>

              );
            })}


            {/* CONTINUE SHOPPING */}

            <Link
              to="/shop"
              className="continue-shopping"
            >
              ← Continue Shopping
            </Link>

          </div>


          {/* ORDER SUMMARY */}

          <div className="cart-summary">

            <h2>
              Order Summary
            </h2>


            {/* SUBTOTAL */}

            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                ₹
                {subtotal.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>


            {/* SHIPPING */}

            <div className="summary-row">

              <span>
                Shipping
              </span>

              <strong>
                {shipping === 0
                  ? "FREE"
                  : `₹${shipping}`}
              </strong>

            </div>


            <div className="summary-line" />


            {/* TOTAL */}

            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>


            {/* CHECKOUT */}

            <Link
              to="/checkout"
              className="checkout-button"
            >
              Proceed to Checkout

              <ArrowRight size={18} />
            </Link>


            {/* SHIPPING MESSAGE */}

            <p className="shipping-note">

              🚚{" "}

              {subtotal >= 999
                ? "You unlocked FREE shipping!"
                : `Add ₹${(
                    999 - subtotal
                  ).toLocaleString(
                    "en-IN"
                  )} more for FREE shipping`}

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Cart;