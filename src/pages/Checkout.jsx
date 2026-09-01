import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  API_URL,
} from "../config";

import {
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  MapPin,
  CreditCard,
} from "lucide-react";


function readSavedUser() {
  try {
    return (
      JSON.parse(
        localStorage.getItem(
          "novaUser"
        )
      ) || {}
    );
  } catch {
    return {};
  }
}


function getInitialCheckoutForm() {
  const savedUser =
    readSavedUser();

  return {
    name:
      savedUser.name || "",

    phone:
      savedUser.phone || "",

    email:
      savedUser.email || "",

    address: "",

    city: "",

    state: "",

    pincode: "",
  };
}


function Checkout({
  cart,
  clearCart,
  createOrder,
}) {
  const [
    orderPlaced,
    setOrderPlaced,
  ] = useState(false);

  const [
    orderId,
    setOrderId,
  ] = useState("");

  const [
    processing,
    setProcessing,
  ] = useState(false);

  const [
    loadingAddress,
    setLoadingAddress,
  ] = useState(true);

  const [
    addressMessage,
    setAddressMessage,
  ] = useState("");

  const [
    form,
    setForm,
  ] = useState(
    getInitialCheckoutForm
  );

  const [
    payment,
    setPayment,
  ] = useState("cod");


  // =========================
  // LOAD ACCOUNT + ADDRESS
  // =========================

  useEffect(() => {
    let ignore = false;

    async function loadCheckoutData() {
      const token =
        localStorage.getItem(
          "novaToken"
        );

      if (!token) {
        if (!ignore) {
          setLoadingAddress(false);
          setAddressMessage(
            "Please login to load your saved address."
          );
        }

        return;
      }

      try {
        const [
          accountResponse,
          addressResponse,
        ] =
          await Promise.all([
            fetch(
              `${API_URL}/api/user-data/account`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            ),

            fetch(
              `${API_URL}/api/user-data/addresses`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            ),
          ]);

        const accountData =
          await accountResponse
            .json()
            .catch(() => ({}));

        const addressesData =
          await addressResponse
            .json()
            .catch(() => []);

        if (
          !accountResponse.ok
        ) {
          throw new Error(
            accountData.message ||
              "Failed to load account details"
          );
        }

        if (
          !addressResponse.ok
        ) {
          throw new Error(
            addressesData.message ||
              "Failed to load saved addresses"
          );
        }

        const addresses =
          Array.isArray(
            addressesData
          )
            ? addressesData
            : [];

        const defaultAddress =
          addresses.find(
            (address) =>
              address.isDefault
          ) ||
          addresses[0] ||
          null;

        if (!ignore) {
          setForm(
            (current) => ({
              ...current,

              name:
                defaultAddress
                  ?.fullName ||
                accountData.name ||
                current.name ||
                "",

              phone:
                defaultAddress
                  ?.phone ||
                accountData.phone ||
                current.phone ||
                "",

              email:
                accountData.email ||
                current.email ||
                "",

              address:
                defaultAddress
                  ?.addressLine ||
                "",

              city:
                defaultAddress
                  ?.city ||
                "",

              state:
                defaultAddress
                  ?.state ||
                "",

              pincode:
                defaultAddress
                  ?.pincode ||
                "",
            })
          );

          if (
            defaultAddress
          ) {
            setAddressMessage(
              defaultAddress.isDefault
                ? "Your default saved address has been loaded."
                : "Your saved address has been loaded."
            );
          } else {
            setAddressMessage(
              "No saved address found. Enter your delivery address below."
            );
          }
        }
      } catch (error) {
        console.error(
          "Checkout data load error:",
          error
        );

        if (!ignore) {
          setAddressMessage(
            error.message ||
              "Unable to load saved address."
          );
        }
      } finally {
        if (!ignore) {
          setLoadingAddress(
            false
          );
        }
      }
    }

    loadCheckoutData();

    return () => {
      ignore = true;
    };
  }, []);


  // =========================
  // CALCULATIONS
  // =========================

  const subtotal =
    cart.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.price
        ) *
          Number(
            item.quantity
          ),
      0
    );

  const shipping =
    subtotal >= 999 ||
    subtotal === 0
      ? 0
      : 99;

  const total =
    subtotal +
    shipping;

  const totalItems =
    cart.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.quantity
        ),
      0
    );


  // =========================
  // HANDLE INPUT
  // =========================

  function handleChange(
    event
  ) {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (current) => ({
        ...current,
        [name]: value,
      })
    );
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
        if (
          window.Razorpay
        ) {
          resolve(true);
          return;
        }

        const script =
          document.createElement(
            "script"
          );

        script.src =
          "https://checkout.razorpay.com/v1/checkout.js";

        script.async =
          true;

        script.onload =
          () =>
            resolve(true);

        script.onerror =
          () =>
            resolve(false);

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

    setOrderPlaced(
      true
    );
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

      const loaded =
        await loadRazorpayScript();

      if (!loaded) {
        alert(
          "Unable to load Razorpay. Check your internet connection."
        );

        return;
      }

      const paymentResponse =
        await fetch(
          `${API_URL}/api/payments/create-order`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify({
                items:
                  cart.map(
                    (
                      item
                    ) => ({
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
        await paymentResponse
          .json();

      if (
        !paymentResponse.ok
      ) {
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

      const options = {
        key:
          paymentData.key,

        amount:
          paymentData.order
            .amount,

        currency:
          paymentData.order
            .currency,

        name:
          "velnora",

        description:
          "velnora Store Order",

        order_id:
          paymentData.order
            .id,

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
            "velnora Fashion Store",
        },

        theme: {
          color:
            "#6c3cff",
        },

        handler:
          async function (
            response
          ) {
            try {
              setProcessing(
                true
              );

              const createdOrder =
                await createOrder({
                  customer:
                    getCustomerData(),

                  paymentMethod:
                    "online",

                  razorpayPayment:
                    {
                      razorpay_order_id:
                        paymentData
                          .order
                          .id,

                      razorpay_payment_id:
                        response
                          .razorpay_payment_id,

                      razorpay_signature:
                        response
                          .razorpay_signature,
                    },
                });

              if (
                !createdOrder
              ) {
                alert(
                  "Payment completed, but the velnora order could not be created."
                );

                return;
              }

              completeOrder(
                createdOrder
              );
            } catch (
              error
            ) {
              console.error(
                "Order creation after payment failed:",
                error
              );

              alert(
                error.message ||
                  "Payment completed but order creation failed."
              );
            } finally {
              setProcessing(
                false
              );
            }
          },

        modal: {
          ondismiss:
            function () {
              setProcessing(
                false
              );
            },
        },
      };

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.on(
        "payment.failed",
        function (
          response
        ) {
          console.error(
            "Payment failed:",
            response.error
          );

          alert(
            response.error
              ?.description ||
              "Payment failed. Please try again."
          );

          setProcessing(
            false
          );
        }
      );

      razorpay.open();
    } catch (
      error
    ) {
      console.error(
        "Online payment error:",
        error
      );

      alert(
        error.message ||
          "Unable to start online payment"
      );

      setProcessing(
        false
      );
    }
  }


  // =========================
  // SUBMIT
  // =========================

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    if (
      cart.length === 0 ||
      processing
    ) {
      return;
    }

    setProcessing(
      true
    );

    try {
      if (
        payment ===
        "online"
      ) {
        await placeOnlineOrder();

        return;
      }

      await placeCodOrder();
    } catch (
      error
    ) {
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
        payment ===
        "cod"
      ) {
        setProcessing(
          false
        );
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
            Add some products
            before checking out.
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
            Your velnora order has
            been successfully placed.
          </p>

          {orderId && (
            <div className="order-number">
              Order #{orderId}
            </div>
          )}

          <p className="success-message">
            We have received your
            order and will process it
            shortly.
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
          <ArrowLeft
            size={17}
          />

          Back to Cart
        </Link>

        <div className="checkout-header">
          <div className="checkout-title-icon">
            <ShieldCheck
              size={22}
            />
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
                  <CreditCard
                    size={20}
                  />
                </div>

                <div>
                  <h2>
                    Contact Information
                  </h2>

                  <p>
                    Enter your contact
                    details
                  </p>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-field full">
                  <label
                    htmlFor="name"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={
                      form.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="form-field">
                  <label
                    htmlFor="phone"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={
                      form.phone
                    }
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
                  <label
                    htmlFor="email"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={
                      form.email
                    }
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
                  <MapPin
                    size={20}
                  />
                </div>

                <div>
                  <h2>
                    Delivery Address
                  </h2>

                  <p>
                    Where should we
                    deliver your order?
                  </p>
                </div>
              </div>

              <div className="checkout-saved-address">
                <MapPin
                  size={16}
                />

                <span>
                  {loadingAddress
                    ? "Loading your saved address..."
                    : addressMessage}
                </span>

                <Link to="/account/addresses">
                  Manage Addresses
                </Link>
              </div>

              <div className="form-grid">
                <div className="form-field full">
                  <label
                    htmlFor="address"
                  >
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
                  <label
                    htmlFor="city"
                  >
                    City
                  </label>

                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={
                      form.city
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="City"
                    autoComplete="address-level2"
                    required
                  />
                </div>

                <div className="form-field">
                  <label
                    htmlFor="state"
                  >
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
                  <label
                    htmlFor="pincode"
                  >
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
                  <CreditCard
                    size={20}
                  />
                </div>

                <div>
                  <h2>
                    Payment Method
                  </h2>

                  <p>
                    Choose how you
                    want to pay
                  </p>
                </div>
              </div>

              <div className="payment-options">
                <label
                  className={
                    payment ===
                    "cod"
                      ? "payment-option selected"
                      : "payment-option"
                  }
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={
                      payment ===
                      "cod"
                    }
                    onChange={(
                      event
                    ) =>
                      setPayment(
                        event
                          .target
                          .value
                      )
                    }
                  />

                  <div className="payment-option-content">
                    <strong>
                      Cash on Delivery
                    </strong>

                    <span>
                      Pay when your
                      order arrives
                    </span>
                  </div>
                </label>

                <label
                  className={
                    payment ===
                    "online"
                      ? "payment-option selected"
                      : "payment-option"
                  }
                >
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={
                      payment ===
                      "online"
                    }
                    onChange={(
                      event
                    ) =>
                      setPayment(
                        event
                          .target
                          .value
                      )
                    }
                  />

                  <div className="payment-option-content">
                    <strong>
                      Razorpay Online
                      Payment
                    </strong>

                    <span>
                      UPI, Card or Net
                      Banking
                    </span>
                  </div>
                </label>
              </div>

              {payment ===
                "online" && (
                <p className="payment-note">
                  Razorpay Test Mode
                  is enabled. No real
                  money will be charged
                  during testing.
                </p>
              )}
            </section>


            {/* BUTTON */}

            <button
              type="submit"
              className="place-order-button"
              disabled={
                processing ||
                loadingAddress
              }
            >
              {processing
                ? "Processing..."
                : loadingAddress
                ? "Loading Address..."
                : payment ===
                  "online"
                ? `Pay ₹${total.toLocaleString(
                    "en-IN"
                  )}`
                : `Place Order · ₹${total.toLocaleString(
                    "en-IN"
                  )}`}
            </button>

            <p className="checkout-security">
              <ShieldCheck
                size={16}
              />

              Your information is
              securely handled by
              velnora.
            </p>
          </form>


          {/* ORDER SUMMARY */}

          <aside className="checkout-summary">
            <h2>
              Your Order
            </h2>

            <div className="checkout-products">
              {cart.map(
                (item) => {
                  const productId =
                    item._id ||
                    item.id;

                  return (
                    <div
                      className="checkout-product"
                      key={
                        productId
                      }
                    >
                      <div className="checkout-product-image">
                        <img
                          src={
                            item.image
                          }
                          alt={
                            item.name
                          }
                        />

                        <span>
                          {
                            item.quantity
                          }
                        </span>
                      </div>

                      <div className="checkout-product-info">
                        <h3>
                          {
                            item.name
                          }
                        </h3>

                        <span>
                          Qty:{" "}
                          {
                            item.quantity
                          }
                        </span>
                      </div>

                      <strong>
                        ₹
                        {(
                          Number(
                            item.price
                          ) *
                          Number(
                            item.quantity
                          )
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>
                  );
                }
              )}
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
                    999 -
                    subtotal
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