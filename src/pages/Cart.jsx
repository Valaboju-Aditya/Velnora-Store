import { Link } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

function Cart({ cart, setCart }) {
  // Increase / decrease quantity
  function updateQuantity(id, change) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.max(
                  1,
                  item.quantity + change
                ),
              }
            : item
        )
    );
  }

  // Remove product
  function removeItem(id) {
    setCart((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  // Calculate subtotal
  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  // Free shipping above ₹999
  const shipping =
    subtotal >= 999 || subtotal === 0
      ? 0
      : 99;

  // Final total
  const total = subtotal + shipping;

  // Total number of products
  const totalItems = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="cart-page">

        <div className="empty-cart">

          <ShoppingBag size={60} />

          <h1>Your Cart Is Empty</h1>

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

  return (
    <div className="cart-page">

      <div className="cart-container">

        {/* HEADER */}

        <div className="cart-header">

          <div>
            <p>YOUR BAG</p>

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

            {cart.map((item) => (

              <div
                className="cart-item"
                key={item.id}
              >

                {/* PRODUCT IMAGE */}

                <Link
                  to={`/product/${item.id}`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                </Link>


                {/* PRODUCT INFORMATION */}

                <div className="cart-item-info">

                  <Link
                    to={`/product/${item.id}`}
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
                    {item.price.toLocaleString(
                      "en-IN"
                    )}
                  </strong>


                  {/* ACTIONS */}

                  <div className="cart-item-actions">

                    {/* QUANTITY */}

                    <div className="quantity-control">

                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            -1
                          )
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
                            item.id,
                            1
                          )
                        }
                      >
                        <Plus size={15} />
                      </button>

                    </div>


                    {/* REMOVE */}

                    <button
                      type="button"
                      className="remove-item"
                      onClick={() =>
                        removeItem(item.id)
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
                    item.price *
                    item.quantity
                  ).toLocaleString(
                    "en-IN"
                  )}

                </div>

              </div>

            ))}


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