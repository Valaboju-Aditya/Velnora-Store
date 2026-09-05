import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";
import {
  ChevronDown,
  ChevronUp,
  Package,
  MapPin,
  CreditCard,
  ArrowRight,
  ShoppingBag,
  XCircle,
} from "lucide-react";

function Orders() {
  const [orders, setOrders] = useState([]);

  const [expandedOrder, setExpandedOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    cancellingOrder,
    setCancellingOrder,
  ] = useState(null);

  const [
    cancelError,
    setCancelError,
  ] = useState("");

  const [
    cancelSuccess,
    setCancelSuccess,
  ] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadOrders = async () => {
      try {
        const token =
          localStorage.getItem(
            "novaToken"
          );

        if (!token) {
          if (!ignore) {
            setError(
              "Please login to view your orders."
            );

            setLoading(false);
          }

          return;
        }

        const response =
          await fetch(
            `${API_URL}/api/orders/my-orders`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load orders"
          );
        }

        if (!ignore) {
          setOrders(data);
        }
      } catch (error) {
        if (!ignore) {
          console.error(
            "Failed to load orders:",
            error
          );

          setError(
            error.message ||
              "Unable to load orders."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      ignore = true;
    };
  }, []);

  const toggleOrder = (
    orderId
  ) => {
    setExpandedOrder(
      (current) =>
        current === orderId
          ? null
          : orderId
    );

    setCancelError("");
    setCancelSuccess("");
  };

  const cancelOrder = async (
    orderId,
    paymentMethod
  ) => {
    const isOnline =
      paymentMethod === "online";

    const confirmed =
      window.confirm(
        isOnline
          ? "Are you sure you want to cancel this order and request a full refund?"
          : "Are you sure you want to cancel this order?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingOrder(
        orderId
      );

      setCancelError("");
      setCancelSuccess("");

      const token =
        localStorage.getItem(
          "novaToken"
        );

      if (!token) {
        throw new Error(
          "Please login again to cancel your order."
        );
      }

      const response =
        await fetch(
          `${API_URL}/api/orders/${encodeURIComponent(
            orderId
          )}/cancel`,
          {
            method: "PATCH",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to cancel order"
        );
      }

      setOrders(
        (currentOrders) =>
          currentOrders.map(
            (order) => {
              const currentOrderId =
                order.orderId ||
                order.id;

              if (
                currentOrderId ===
                orderId
              ) {
                return data.order;
              }

              return order;
            }
          )
      );

      if (
        data.order
          ?.refundStatus ===
        "Pending"
      ) {
        setCancelSuccess(
          "Refund initiated. Your cancellation is being processed."
        );
      } else if (
        data.order
          ?.refundStatus ===
        "Processed"
      ) {
        setCancelSuccess(
          "Order cancelled and refund processed successfully."
        );
      } else {
        setCancelSuccess(
          data.message ||
            "Order cancelled successfully."
        );
      }
    } catch (error) {
      console.error(
        "Cancel order error:",
        error
      );

      setCancelError(
        error.message ||
          "Unable to cancel order."
      );
    } finally {
      setCancellingOrder(
        null
      );
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="empty-orders">
            <p>
              Loading your orders...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="empty-orders">

            <div className="empty-orders-icon">
              <ShoppingBag
                size={38}
              />
            </div>

            <h2>
              Unable to load orders
            </h2>

            <p>
              {error}
            </p>

            <Link
              to="/login"
              className="orders-shop-button"
            >
              Login

              <ArrowRight
                size={17}
              />
            </Link>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">

      <div className="orders-container">

        <div className="orders-header">

          <div>

            <p>
              YOUR ACCOUNT
            </p>

            <h1>
              My Orders
            </h1>

            <span>
              View your previous
              orders and order
              details.
            </span>

          </div>

          <Link
            to="/shop"
            className="orders-continue-shopping"
          >
            Continue Shopping

            <ArrowRight
              size={17}
            />
          </Link>

        </div>

        {orders.length ===
        0 ? (

          <div className="empty-orders">

            <div className="empty-orders-icon">
              <ShoppingBag
                size={38}
              />
            </div>

            <p className="empty-orders-label">
              YOUR ORDER HISTORY
            </p>

            <h2>
              No orders yet
            </h2>

            <p>
              You haven't placed
              any orders yet.
              Start shopping and
              your orders will
              appear here.
            </p>

            <Link
              to="/shop"
              className="orders-shop-button"
            >
              Start Shopping

              <ArrowRight
                size={17}
              />
            </Link>

          </div>

        ) : (

          <div className="orders-list">

            {orders.map(
              (order) => {

                const displayOrderId =
                  order.orderId ||
                  order.id;

                const isExpanded =
                  expandedOrder ===
                  displayOrderId;

                const itemCount =
                  order.items?.reduce(
                    (
                      total,
                      item
                    ) =>
                      total +
                      Number(
                        item.quantity ||
                          0
                      ),
                    0
                  ) || 0;

                const orderDate =
                  order.createdAt
                    ? new Date(
                        order.createdAt
                      ).toLocaleDateString(
                        "en-IN"
                      )
                    : order.date ||
                      "N/A";

                const canCancel =
                  order.status ===
                    "Order Confirmed" &&
                  (
                    order.paymentMethod ===
                      "cod" ||
                    (
                      order.paymentMethod ===
                        "online" &&
                      order.paymentStatus ===
                        "Paid" &&
                      (
                        !order.refundStatus ||
                        order.refundStatus ===
                          "None"
                      )
                    )
                  );

                const isCancelling =
                  cancellingOrder ===
                  displayOrderId;

                return (
                  <div
                    className={`order-card ${
                      isExpanded
                        ? "expanded"
                        : ""
                    }`}
                    key={
                      order._id ||
                      displayOrderId
                    }
                  >

                    <div className="order-card-header">

                      <div className="order-id-block">

                        <span className="order-label">
                          ORDER ID
                        </span>

                        <h3>
                          {
                            displayOrderId
                          }
                        </h3>

                      </div>

                      <div className="order-status">

                        <span className="status-dot">
                        </span>

                        {
                          order.status
                        }

                      </div>

                    </div>

                    <div className="order-info-grid">

                      <div className="order-info-item">

                        <span>
                          DATE
                        </span>

                        <strong>
                          {
                            orderDate
                          }
                        </strong>

                      </div>

                      <div className="order-info-item">

                        <span>
                          ITEMS
                        </span>

                        <strong>
                          {
                            itemCount
                          }
                        </strong>

                      </div>

                      <div className="order-info-item order-total-item">

                        <span>
                          TOTAL
                        </span>

                        <strong>
                          ₹
                          {Number(
                            order.total ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                      <button
                        className="order-details-button"
                        type="button"
                        onClick={() =>
                          toggleOrder(
                            displayOrderId
                          )
                        }
                      >

                        <span>
                          {isExpanded
                            ? "Hide Details"
                            : "View Details"}
                        </span>

                        {isExpanded ? (
                          <ChevronUp
                            size={
                              17
                            }
                          />
                        ) : (
                          <ChevronDown
                            size={
                              17
                            }
                          />
                        )}

                      </button>

                    </div>

                    {isExpanded && (

                      <div className="order-expanded">

                        <div className="order-expanded-section">

                          <div className="order-section-title">

                            <Package
                              size={
                                20
                              }
                            />

                            <h3>
                              Products
                            </h3>

                          </div>

                          <div className="order-products">

                            {order.items?.map(
                              (
                                item,
                                index
                              ) => (

                                <div
                                  className="order-product"
                                  key={`${item.id}-${index}`}
                                >

                                  <img
                                    src={
                                      item.image
                                    }
                                    alt={
                                      item.name
                                    }
                                  />

                                  <div className="order-product-info">

                                    <h4>
                                      {
                                        item.name
                                      }
                                    </h4>

                                    <p>
                                      Quantity:{" "}
                                      {
                                        item.quantity
                                      }
                                    </p>

                                    <strong>
                                      ₹
                                      {Number(
                                        item.price ||
                                          0
                                      ).toLocaleString(
                                        "en-IN"
                                      )}
                                    </strong>

                                  </div>

                                  <div className="order-product-total">

                                    ₹
                                    {(
                                      Number(
                                        item.price ||
                                          0
                                      ) *
                                      Number(
                                        item.quantity ||
                                          0
                                      )
                                    ).toLocaleString(
                                      "en-IN"
                                    )}

                                  </div>

                                </div>

                              )
                            )}

                          </div>

                        </div>

                        <div className="order-expanded-section">

                          <div className="order-section-title">

                            <CreditCard
                              size={
                                20
                              }
                            />

                            <h3>
                              Payment
                            </h3>

                          </div>

                          <div className="order-info-row">

                            <span>
                              Payment
                              Method
                            </span>

                            <strong>
                              {order.paymentMethod ===
                              "online"
                                ? "Online Payment"
                                : "Cash on Delivery"}
                            </strong>

                          </div>

                          <div className="order-info-row">

                            <span>
                              Payment
                              Status
                            </span>

                            <strong>
                              {order.paymentStatus ||
                                "Pending"}
                            </strong>

                          </div>

                          {order.paymentMethod ===
                            "online" &&
                            order.refundStatus &&
                            order.refundStatus !==
                              "None" && (

                              <div className="order-info-row">

                                <span>
                                  Refund
                                  Status
                                </span>

                                <strong>
                                  {
                                    order.refundStatus
                                  }
                                </strong>

                              </div>

                            )}

                          {Number(
                            order.refundAmount ||
                              0
                          ) > 0 && (

                            <div className="order-info-row">

                              <span>
                                Refund
                                Amount
                              </span>

                              <strong>
                                ₹
                                {Number(
                                  order.refundAmount
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </strong>

                            </div>

                          )}

                        </div>

                        {order.customer &&
                          Object.keys(
                            order.customer
                          ).length >
                            0 && (

                            <div className="order-expanded-section">

                              <div className="order-section-title">

                                <MapPin
                                  size={
                                    20
                                  }
                                />

                                <h3>
                                  Delivery
                                  Details
                                </h3>

                              </div>

                              <div className="order-customer">

                                {order.customer
                                  .name && (
                                  <p>
                                    <strong>
                                      Name:
                                    </strong>{" "}
                                    {
                                      order
                                        .customer
                                        .name
                                    }
                                  </p>
                                )}

                                {order.customer
                                  .phone && (
                                  <p>
                                    <strong>
                                      Phone:
                                    </strong>{" "}
                                    {
                                      order
                                        .customer
                                        .phone
                                    }
                                  </p>
                                )}

                                {order.customer
                                  .email && (
                                  <p>
                                    <strong>
                                      Email:
                                    </strong>{" "}
                                    {
                                      order
                                        .customer
                                        .email
                                    }
                                  </p>
                                )}

                                {order.customer
                                  .address && (
                                  <p>
                                    <strong>
                                      Address:
                                    </strong>{" "}
                                    {
                                      order
                                        .customer
                                        .address
                                    }
                                  </p>
                                )}

                                {order.customer
                                  .city && (
                                  <p>
                                    <strong>
                                      City:
                                    </strong>{" "}
                                    {
                                      order
                                        .customer
                                        .city
                                    }
                                  </p>
                                )}

                                {order.customer
                                  .state && (
                                  <p>
                                    <strong>
                                      State:
                                    </strong>{" "}
                                    {
                                      order
                                        .customer
                                        .state
                                    }
                                  </p>
                                )}

                                {order.customer
                                  .pincode && (
                                  <p>
                                    <strong>
                                      PIN
                                      Code:
                                    </strong>{" "}
                                    {
                                      order
                                        .customer
                                        .pincode
                                    }
                                  </p>
                                )}

                              </div>

                            </div>

                          )}

                        <div className="order-final-total">

                          <span>
                            Order Total
                          </span>

                          <strong>
                            ₹
                            {Number(
                              order.total ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                        </div>

                        {order.refundStatus ===
                          "Pending" && (

                          <div
                            style={{
                              marginTop:
                                "20px",

                              padding:
                                "12px 16px",

                              background:
                                "#fff7e6",

                              border:
                                "1px solid #f5d48a",

                              borderRadius:
                                "8px",

                              fontSize:
                                "14px",

                              fontWeight:
                                "600",

                              color:
                                "#8a5a00",
                            }}
                          >
                            Refund is
                            being
                            processed.
                          </div>

                        )}

                        {order.refundStatus ===
                          "Processed" && (

                          <div
                            style={{
                              marginTop:
                                "20px",

                              padding:
                                "12px 16px",

                              background:
                                "#eefbf3",

                              border:
                                "1px solid #a7e0bb",

                              borderRadius:
                                "8px",

                              fontSize:
                                "14px",

                              fontWeight:
                                "600",

                              color:
                                "#067647",
                            }}
                          >
                            Refund
                            processed
                            successfully.
                          </div>

                        )}

                        {order.refundStatus ===
                          "Failed" && (

                          <div
                            style={{
                              marginTop:
                                "20px",

                              padding:
                                "12px 16px",

                              background:
                                "#fff0f0",

                              border:
                                "1px solid #f2b8b5",

                              borderRadius:
                                "8px",

                              fontSize:
                                "14px",

                              fontWeight:
                                "600",

                              color:
                                "#b42318",
                            }}
                          >
                            Refund
                            failed.
                            Please
                            contact
                            VELNORA
                            support.
                          </div>

                        )}

                        {canCancel && (

                          <div
                            style={{
                              marginTop:
                                "20px",
                            }}
                          >

                            {cancelError && (
                              <p
                                style={{
                                  color:
                                    "#b42318",

                                  marginBottom:
                                    "12px",
                                }}
                              >
                                {
                                  cancelError
                                }
                              </p>
                            )}

                            {cancelSuccess && (
                              <p
                                style={{
                                  color:
                                    "#067647",

                                  marginBottom:
                                    "12px",
                                }}
                              >
                                {
                                  cancelSuccess
                                }
                              </p>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                cancelOrder(
                                  displayOrderId,
                                  order.paymentMethod
                                )
                              }
                              disabled={
                                isCancelling
                              }
                              style={{
                                display:
                                  "inline-flex",

                                alignItems:
                                  "center",

                                gap:
                                  "8px",

                                padding:
                                  "12px 18px",

                                border:
                                  "1px solid #b42318",

                                background:
                                  "transparent",

                                color:
                                  "#b42318",

                                fontWeight:
                                  "600",

                                cursor:
                                  isCancelling
                                    ? "not-allowed"
                                    : "pointer",

                                opacity:
                                  isCancelling
                                    ? 0.6
                                    : 1,
                              }}
                            >

                              <XCircle
                                size={
                                  18
                                }
                              />

                              {isCancelling
                                ? order.paymentMethod ===
                                  "online"
                                  ? "Starting Refund..."
                                  : "Cancelling..."
                                : order.paymentMethod ===
                                  "online"
                                ? "Cancel & Refund"
                                : "Cancel Order"}

                            </button>

                          </div>

                        )}

                        {cancelError &&
                          !canCancel && (

                          <p
                            style={{
                              color:
                                "#b42318",

                              marginTop:
                                "14px",
                            }}
                          >
                            {
                              cancelError
                            }
                          </p>

                        )}

                        {cancelSuccess &&
                          !canCancel && (

                          <p
                            style={{
                              color:
                                "#067647",

                              marginTop:
                                "14px",
                            }}
                          >
                            {
                              cancelSuccess
                            }
                          </p>

                        )}

                        {order.status ===
                          "Cancelled" && (

                          <div
                            style={{
                              marginTop:
                                "20px",

                              padding:
                                "12px 16px",

                              border:
                                "1px solid #ddd",

                              borderRadius:
                                "8px",
                            }}
                          >

                            <strong>
                              This order
                              has been
                              cancelled.
                            </strong>

                          </div>

                        )}

                      </div>

                    )}

                  </div>
                );
              }
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Orders;