import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  MapPin,
  CreditCard,
} from "lucide-react";

function Checkout({
  cart,
  clearCart,
  createOrder,
}) {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

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

  /* =====================================================
     CALCULATIONS
  ===================================================== */

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

  const totalItems = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );


  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }


  /* =====================================================
     SUBMIT ORDER
  ===================================================== */

  function handleSubmit(e) {
    e.preventDefault();

    if (cart.length === 0) {
      return;
    }

    /*
      Send customer details and payment method
      to App.jsx
    */

    const createdOrder = createOrder({
      customer: {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },

      paymentMethod: payment,
    });


    /*
      Only clear the cart and show success
      if the order was actually created.
    */

    if (!createdOrder) {
      return;
    }


    setOrderId(createdOrder.id);

    clearCart();

    setOrderPlaced(true);
  }


  /* =====================================================
     EMPTY CART
  ===================================================== */

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-page">

        <div className="checkout-empty">

          <ShoppingBagIcon />

          <h1>
            Your Cart Is Empty
          </h1>

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


  /* =====================================================
     ORDER SUCCESS
  ===================================================== */

  if (orderPlaced) {
    return (
      <div className="checkout-page">

        <div className="order-success">

          <CheckCircle
            size={72}
            className="success-icon"
          />

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

          {orderId && (
            <div className="order-number">
              Order #{orderId}
            </div>
          )}

          <p className="success-message">
            We have received your order
            and will process it shortly.
          </p>

          <div className="success-actions">

            <Link
              to="/orders"
              className="view-orders-button"
            >
              View My Orders
            </Link>

            <Link
              to="/shop"
              className="continue-shopping"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>
    );
  }


  /* =====================================================
     CHECKOUT PAGE
  ===================================================== */

  return (
    <div className="checkout-page">

      <div className="checkout-container">

        {/* BACK TO CART */}

        <Link
          to="/cart"
          className="back-cart"
        >
          <ArrowLeft size={17} />
          Back to Cart
        </Link>


        {/* HEADER */}

        <div className="checkout-header">

          <div className="checkout-title-icon">
            <ShieldCheck size={22} />
          </div>

          <p>
            SECURE CHECKOUT
          </p>

          <h1>
            Complete Your Order
          </h1>

          <span>
            {totalItems}{" "}
            {totalItems === 1
              ? "item"
              : "items"}{" "}
            in your order
          </span>

        </div>


        <div className="checkout-layout">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <form
            className="checkout-form"
            onSubmit={handleSubmit}
          >

            {/* CONTACT INFORMATION */}

            <section className="checkout-section">

              <div className="checkout-section-title">

                <div className="checkout-icon">
                  <CreditCard size={20} />
                </div>

                <div>

                  <h2>
                    Contact Information
                  </h2>

                  <p>
                    Enter your contact details
                  </p>

                </div>

              </div>


              <div className="form-grid">

                {/* NAME */}

                <div className="form-field full">

                  <label htmlFor="name">
                    Full Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />

                </div>


                {/* PHONE */}

                <div className="form-field">

                  <label htmlFor="phone">
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    autoComplete="tel"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    required
                  />

                </div>


                {/* EMAIL */}

                <div className="form-field">

                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    autoComplete="email"
                    required
                  />

                </div>

              </div>

            </section>


            {/* =================================================
                DELIVERY ADDRESS
            ================================================= */}

            <section className="checkout-section">

              <div className="checkout-section-title">

                <div className="checkout-icon">
                  <MapPin size={20} />
                </div>

                <div>

                  <h2>
                    Delivery Address
                  </h2>

                  <p>
                    Where should we deliver your order?
                  </p>

                </div>

              </div>


              <div className="form-grid">

                {/* ADDRESS */}

                <div className="form-field full">

                  <label htmlFor="address">
                    Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House number, street, area"
                    rows="4"
                    autoComplete="street-address"
                    required
                  />

                </div>


                {/* CITY */}

                <div className="form-field">

                  <label htmlFor="city">
                    City
                  </label>

                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    autoComplete="address-level2"
                    required
                  />

                </div>


                {/* STATE */}

                <div className="form-field">

                  <label htmlFor="state">
                    State
                  </label>

                  <input
                    id="state"
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                    autoComplete="address-level1"
                    required
                  />

                </div>


                {/* PINCODE */}

                <div className="form-field">

                  <label htmlFor="pincode">
                    PIN Code
                  </label>

                  <input
                    id="pincode"
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="6-digit PIN"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength="6"
                    autoComplete="postal-code"
                    required
                  />

                </div>

              </div>

            </section>


            {/* =================================================
                PAYMENT
            ================================================= */}

            <section className="checkout-section">

              <div className="checkout-section-title">

                <div className="checkout-icon">
                  <CreditCard size={20} />
                </div>

                <div>

                  <h2>
                    Payment Method
                  </h2>

                  <p>
                    Choose how you want to pay
                  </p>

                </div>

              </div>


              <div className="payment-options">

                {/* CASH ON DELIVERY */}

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
                    checked={
                      payment === "cod"
                    }
                    onChange={(e) =>
                      setPayment(
                        e.target.value
                      )
                    }
                  />

                  <div className="payment-option-content">

                    <strong>
                      Cash on Delivery
                    </strong>

                    <span>
                      Pay when your order arrives
                    </span>

                  </div>

                </label>


                {/* ONLINE PAYMENT */}

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
                    checked={
                      payment === "online"
                    }
                    onChange={(e) =>
                      setPayment(
                        e.target.value
                      )
                    }
                  />

                  <div className="payment-option-content">

                    <strong>
                      Online Payment
                    </strong>

                    <span>
                      Card, UPI or Net Banking
                    </span>

                  </div>

                </label>

              </div>


              {payment === "online" && (
                <p className="payment-note">
                  Online payment is currently
                  simulated for this demo store.
                </p>
              )}

            </section>


            {/* =================================================
                PLACE ORDER
            ================================================= */}

            <button
              type="submit"
              className="place-order-button"
            >
              Place Order · ₹
              {total.toLocaleString(
                "en-IN"
              )}
            </button>


            <p className="checkout-security">

              <ShieldCheck size={16} />

              Your information is securely
              handled by NOVA.

            </p>

          </form>


          {/* =================================================
              RIGHT SIDE — ORDER SUMMARY
          ================================================= */}

          <aside className="checkout-summary">

            <h2>
              Your Order
            </h2>


            {/* PRODUCTS */}

            <div className="checkout-products">

              {cart.map((item) => (

                <div
                  className="checkout-product"
                  key={item.id}
                >

                  <div className="checkout-product-image">

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <span>
                      {item.quantity}
                    </span>

                  </div>


                  <div className="checkout-product-info">

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


            {/* SUBTOTAL */}

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


            {/* SHIPPING */}

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


            {/* FINAL TOTAL */}

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


            {/* FREE SHIPPING MESSAGE */}

            <p className="checkout-shipping-note">

              🚚{" "}

              {shipping === 0
                ? "Free shipping unlocked!"
                : `Add ₹${(
                    999 - subtotal
                  ).toLocaleString(
                    "en-IN"
                  )} more for free shipping`}

            </p>

          </aside>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   EMPTY CART ICON
========================================================= */

function ShoppingBagIcon() {
  return (
    <div className="checkout-empty-icon">
      🛍️
    </div>
  );
}


export default Checkout;