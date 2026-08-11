import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";

function Checkout({ cart }) {

  const [orderPlaced, setOrderPlaced] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [payment, setPayment] = useState("cod");

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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setOrderPlaced(true);
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <h1>Your Cart Is Empty</h1>

          <p>
            Add some products before
            checking out.
          </p>

          <Link to="/shop">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="checkout-page">

        <div className="order-success">

          <CheckCircle size={70} />

          <p className="success-label">
            ORDER CONFIRMED
          </p>

          <h1>
            Thank You!
          </h1>

          <p>
            Your NOVA order has been
            successfully placed.
          </p>

          <div className="order-number">
  Order #NOVA2026
</div>

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
    <div className="checkout-page">

      <div className="checkout-container">

        <Link
          to="/cart"
          className="back-cart"
        >
          <ArrowLeft size={17} />
          Back to Cart
        </Link>

        <div className="checkout-header">

          <p>SECURE CHECKOUT</p>

          <h1>
            Complete Your Order
          </h1>

        </div>

        <div className="checkout-layout">

          {/* CUSTOMER DETAILS */}

          <form
            className="checkout-form"
            onSubmit={handleSubmit}
          >

            <section className="checkout-section">

              <h2>
                Contact Information
              </h2>

              <div className="form-grid">

                <div className="form-field full">
                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                </div>

              </div>

            </section>

            {/* ADDRESS */}

            <section className="checkout-section">

              <h2>
                Delivery Address
              </h2>

              <div className="form-grid">

                <div className="form-field full">
                  <label>
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House number, street, area"
                    rows="4"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>
                    PIN Code
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="PIN code"
                    required
                  />
                </div>

              </div>

            </section>

            {/* PAYMENT */}

            <section className="checkout-section">

              <h2>
                Payment Method
              </h2>

              <div className="payment-options">

                <label
                  className={
                    payment === "cod"
                      ? "payment-option selected"
                      : "payment-option"
                  }
                >

                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={payment === "cod"}
                    onChange={(e) =>
                      setPayment(e.target.value)
                    }
                  />

                  <div>
                    <strong>
                      Cash on Delivery
                    </strong>

                    <span>
                      Pay when your order arrives
                    </span>
                  </div>

                </label>

                <label
                  className={
                    payment === "online"
                      ? "payment-option selected"
                      : "payment-option"
                  }
                >

                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={payment === "online"}
                    onChange={(e) =>
                      setPayment(e.target.value)
                    }
                  />

                  <div>
                    <strong>
                      Online Payment
                    </strong>

                    <span>
                      Card, UPI or Net Banking
                    </span>
                  </div>

                </label>

              </div>

            </section>

            <button
              type="submit"
              className="place-order-button"
            >
              Place Order · ₹
              {total.toLocaleString("en-IN")}
            </button>

          </form>

          {/* ORDER SUMMARY */}

          <aside className="checkout-summary">

            <h2>
              Your Order
            </h2>

            <div className="checkout-products">

              {cart.map((item) => (

                <div
                  className="checkout-product"
                  key={item.id}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div>

                    <h3>
                      {item.name}
                    </h3>

                    <span>
                      Qty: {item.quantity}
                    </span>

                  </div>

                  <strong>
                    ₹
                    {(
                      item.price *
                      item.quantity
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

              ))}

            </div>

            <div className="checkout-summary-line" />

            <div className="checkout-total-row">

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

            <div className="checkout-total-row">

              <span>
                Shipping
              </span>

              <strong>
                {shipping === 0
                  ? "FREE"
                  : `₹${shipping}`}
              </strong>

            </div>

            <div className="checkout-summary-line" />

            <div className="checkout-final-total">

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

          </aside>

        </div>

      </div>

    </div>
  );
}

export default Checkout;