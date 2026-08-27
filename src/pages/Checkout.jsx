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
  const [orderPlaced, setOrderPlaced] =
    useState(false);

  const [orderId, setOrderId] =
    useState("");

  const [processing, setProcessing] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [payment, setPayment] =
    useState("cod");


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
  // HANDLE INPUT
  // =========================

  function handleChange(e) {
    const {
      name,
      value,
    } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }


  // =========================
  // CUSTOMER DATA
  // =========================

  function getCustomerData() {
    return {
      name:
        form.name.trim(),

      phone:
        form.phone.trim(),

      email:
        form.email.trim(),

      address:
        form.address.trim(),

      city:
        form.city.trim(),

      state:
        form.state.trim(),

      pincode:
        form.pincode.trim(),
    };
  }


  // =========================
  // LOAD RAZORPAY
  // =========================

  function loadRazorpayScript() {
    return new Promise(
      (resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }

        const script =
          document.createElement(
            "script"
          );

        script.src =
          "https://checkout.razorpay.com/v1/checkout.js";

        script.async = true;

        script.onload =
          () => resolve(true);

        script.onerror =
          () => resolve(false);

        document.body.appendChild(
          script
        );
      }
    );
  }


  // =========================
  // COMPLETE ORDER
  // =========================

  function completeOrder(
    createdOrder
  ) {
    if (!createdOrder) {
      return;
    }

    setOrderId(
      createdOrder.id ||
        createdOrder.orderId ||
        ""
    );

    clearCart();

    setOrderPlaced(true);
  }


  // =========================
  // COD
  // =========================

  async function placeCodOrder() {
    const createdOrder =
      await createOrder({
        customer:
          getCustomerData(),

        paymentMethod:
          "cod",
      });

    if (!createdOrder) {
      return false;
    }

    completeOrder(
      createdOrder
    );

    return true;
  }


  // =========================
  // ONLINE PAYMENT
  // =========================

  async function placeOnlineOrder() {
    try {
      const token =
        localStorage.getItem(
          "novaToken"
        );

      if (!token) {
        alert(
          "Please login again before making payment."
        );

        return;
      }


      // LOAD RAZORPAY SCRIPT

      const loaded =
        await loadRazorpayScript();

      if (!loaded) {
        alert(
          "Unable to load Razorpay. Check your internet connection."
        );

        return;
      }


      // CREATE RAZORPAY ORDER

      const paymentResponse =
        await fetch(
          "http://localhost:5000/api/payments/create-order",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              items:
                cart.map(
                  (item) => ({
                    id:
                      item._id ||
                      item.id,

                    quantity:
                      Number(
                        item.quantity
                      ),
                  })
                ),
            }),
          }
        );

      const paymentData =
        await paymentResponse.json();


      if (!paymentResponse.ok) {
        throw new Error(
          paymentData.message ||
            "Failed to start payment"
        );
      }


      if (
        !paymentData.order ||
        !paymentData.order.id
      ) {
        throw new Error(
          "Invalid Razorpay order response"
        );
      }


      // =========================
      // RAZORPAY OPTIONS
      // =========================

      const options = {
        key:
          paymentData.key,

        amount:
          paymentData.order.amount,

        currency:
          paymentData.order.currency,

        name:
          "NOVA",

        description:
          "NOVA Fashion Store Order",

        order_id:
          paymentData.order.id,

        prefill: {
          name:
            form.name,

          email:
            form.email,

          contact:
            form.phone,
        },

        notes: {
          store:
            "NOVA Fashion Store",
        },

        theme: {
          color:
            "#6c3cff",
        },


        // =========================
        // PAYMENT SUCCESS
        // =========================

        handler:
          async function (
            response
          ) {
            try {
              setProcessing(true);


              // IMPORTANT:
              // Use the backend-created
              // Razorpay order ID.

              const createdOrder =
                await createOrder({
                  customer:
                    getCustomerData(),

                  paymentMethod:
                    "online",

                  razorpayPayment: {
                    razorpay_order_id:
                      paymentData.order.id,

                    razorpay_payment_id:
                      response.razorpay_payment_id,

                    razorpay_signature:
                      response.razorpay_signature,
                  },
                });


              if (!createdOrder) {
                alert(
                  "Payment completed, but the NOVA order could not be created."
                );

                return;
              }


              completeOrder(
                createdOrder
              );

            } catch (error) {
              console.error(
                "Order creation after payment failed:",
                error
              );

              alert(
                error.message ||
                  "Payment completed but order creation failed."
              );

            } finally {
              setProcessing(false);
            }
          },


        // =========================
        // CHECKOUT CLOSED
        // =========================

        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },
      };


      // =========================
      // OPEN RAZORPAY
      // =========================

      const razorpay =
        new window.Razorpay(
          options
        );


      // =========================
      // PAYMENT FAILED
      // =========================

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Payment failed:",
            response.error
          );

          alert(
            response.error
              ?.description ||
              "Payment failed. Please try again."
          );

          setProcessing(false);
        }
      );


      razorpay.open();

    } catch (error) {
      console.error(
        "Online payment error:",
        error
      );

      alert(
        error.message ||
          "Unable to start online payment"
      );

      setProcessing(false);
    }
  }


  // =========================
  // SUBMIT
  // =========================

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      cart.length === 0 ||
      processing
    ) {
      return;
    }

    setProcessing(true);

    try {
      if (
        payment === "online"
      ) {
        await placeOnlineOrder();

        return;
      }

      await placeCodOrder();

    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      alert(
        error.message ||
          "Unable to place order"
      );

    } finally {
      if (
        payment === "cod"
      ) {
        setProcessing(false);
      }
    }
  }


  // =========================
  // EMPTY CART
  // =========================

  if (
    cart.length === 0 &&
    !orderPlaced
  ) {
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


  // =========================
  // SUCCESS
  // =========================

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


  // =========================
  // CHECKOUT PAGE
  // =========================

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


          <form
            className="checkout-form"
            onSubmit={
              handleSubmit
            }
          >


            {/* CONTACT */}

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

                <div className="form-field full">

                  <label htmlFor="name">
                    Full Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />

                </div>


                <div className="form-field">

                  <label htmlFor="phone">
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={
                      handleChange
                    }
                    placeholder="Enter phone number"
                    autoComplete="tel"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    required
                  />

                </div>


                <div className="form-field">

                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={
                      handleChange
                    }
                    placeholder="Enter email"
                    autoComplete="email"
                    required
                  />

                </div>

              </div>

            </section>


            {/* ADDRESS */}

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

                <div className="form-field full">

                  <label htmlFor="address">
                    Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    value={
                      form.address
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="House number, street, area"
                    rows="4"
                    autoComplete="street-address"
                    required
                  />

                </div>


                <div className="form-field">

                  <label htmlFor="city">
                    City
                  </label>

                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={
                      handleChange
                    }
                    placeholder="City"
                    autoComplete="address-level2"
                    required
                  />

                </div>


                <div className="form-field">

                  <label htmlFor="state">
                    State
                  </label>

                  <input
                    id="state"
                    type="text"
                    name="state"
                    value={
                      form.state
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="State"
                    autoComplete="address-level1"
                    required
                  />

                </div>


                <div className="form-field">

                  <label htmlFor="pincode">
                    PIN Code
                  </label>

                  <input
                    id="pincode"
                    type="text"
                    name="pincode"
                    value={
                      form.pincode
                    }
                    onChange={
                      handleChange
                    }
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


            {/* PAYMENT */}

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
                      Razorpay Online Payment
                    </strong>

                    <span>
                      UPI, Card or Net Banking
                    </span>

                  </div>

                </label>

              </div>


              {payment === "online" && (
                <p className="payment-note">
                  Razorpay Test Mode is enabled.
                  No real money will be charged
                  during testing.
                </p>
              )}

            </section>


            {/* BUTTON */}

            <button
              type="submit"
              className="place-order-button"
              disabled={processing}
            >

              {processing
                ? "Processing..."
                : payment === "online"
                ? `Pay ₹${total.toLocaleString(
                    "en-IN"
                  )}`
                : `Place Order · ₹${total.toLocaleString(
                    "en-IN"
                  )}`}

            </button>


            <p className="checkout-security">

              <ShieldCheck size={16} />

              Your information is securely
              handled by NOVA.

            </p>

          </form>


          {/* ORDER SUMMARY */}

          <aside className="checkout-summary">

            <h2>
              Your Order
            </h2>


            <div className="checkout-products">

              {cart.map((item) => {

                const productId =
                  item._id ||
                  item.id;

                return (
                  <div
                    className="checkout-product"
                    key={productId}
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
                        Number(item.price) *
                        Number(item.quantity)
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>
                );
              })}

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


function ShoppingBagIcon() {
  return (
    <div className="checkout-empty-icon">
      🛍️
    </div>
  );
}


export default Checkout;