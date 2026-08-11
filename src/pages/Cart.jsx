import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

function Cart({ cart, setCart }) {
  const updateQuantity = (id, change) => {
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
  };

  const removeItem = (id) => {
    setCart((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const shipping =
    subtotal >= 999 || subtotal === 0
      ? 0
      : 99;

  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="cart-page">

        <div className="empty-cart">

          <ShoppingBag size={55} />

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
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="cart-page">

      <div className="cart-container">

        <div className="cart-header">

          <div>
            <p>YOUR BAG</p>
            <h1>Shopping Cart</h1>
          </div>

          <span>
            {cart.reduce(
              (total, item) =>
                total + item.quantity,
              0
            )}{" "}
            items
          </span>

        </div>

        <div className="cart-layout">

          {/* CART PRODUCTS */}

          <div className="cart-products">

            {cart.map((item) => (

              <div
                className="cart-item"
                key={item.id}
              >

                <img
                  src={item.image}
                  alt={item.name}
                />

                <div className="cart-item-info">

                  <Link
                    to={`/product/${item.id}`}
                  >
                    <h3>{item.name}</h3>
                  </Link>

                  <p>
                    {item.category}
                  </p>

                  <strong>
                    ₹
                    {item.price.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                  <div className="cart-item-actions">

                    <div className="quantity-control">

                      <button
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

                    <button
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

            <Link
              to="/shop"
              className="continue-shopping"
            >
              ← Continue Shopping
            </Link>

          </div>

          {/* ORDER SUMMARY */}

          <div className="cart-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">

              <span>Subtotal</span>

              <strong>
                ₹
                {subtotal.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div className="summary-row">

              <span>Shipping</span>

              <strong>
                {shipping === 0
                  ? "FREE"
                  : `₹${shipping}`}
              </strong>

            </div>

            <div className="summary-line" />

            <div className="summary-total">

              <span>Total</span>

              <strong>
                ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <Link
  to="/checkout"
  className="checkout-button"
>
  Proceed to Checkout
</Link>

            <p className="shipping-note">
              🚚 Free shipping on orders
              above ₹999
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Cart;