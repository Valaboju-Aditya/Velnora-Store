import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Package,
  MapPin,
  CreditCard,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadOrders = async () => {
      try {
        const token = localStorage.getItem("novaToken");

        if (!token) {
          if (!ignore) {
            setError("Please login to view your orders.");
            setLoading(false);
          }

          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load orders"
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
            error.message || "Unable to load orders."
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

  const toggleOrder = (orderId) => {
    setExpandedOrder((current) =>
      current === orderId ? null : orderId
    );
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="empty-orders">
            <p>Loading your orders...</p>
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
              <ShoppingBag size={38} />
            </div>

            <h2>Unable to load orders</h2>

            <p>{error}</p>

            <Link
              to="/login"
              className="orders-shop-button"
            >
              Login
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">

        {/* HEADER */}

        <div className="orders-header">
          <div>
            <p>YOUR ACCOUNT</p>

            <h1>My Orders</h1>

            <span>
              View your previous orders and order details.
            </span>
          </div>

          <Link
            to="/shop"
            className="orders-continue-shopping"
          >
            Continue Shopping
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* EMPTY ORDERS */}

        {orders.length === 0 ? (
          <div className="empty-orders">

            <div className="empty-orders-icon">
              <ShoppingBag size={38} />
            </div>

            <p className="empty-orders-label">
              YOUR ORDER HISTORY
            </p>

            <h2>No orders yet</h2>

            <p>
              You haven't placed any orders yet.
              Start shopping and your orders will
              appear here.
            </p>

            <Link
              to="/shop"
              className="orders-shop-button"
            >
              Start Shopping
              <ArrowRight size={17} />
            </Link>

          </div>
        ) : (

          <div className="orders-list">

            {orders.map((order) => {
              const displayOrderId =
                order.orderId || order.id;

              const isExpanded =
                expandedOrder === displayOrderId;

              const itemCount =
                order.items?.reduce(
                  (total, item) =>
                    total + item.quantity,
                  0
                ) || 0;

              const orderDate = order.createdAt
                ? new Date(
                    order.createdAt
                  ).toLocaleDateString(
                    "en-IN"
                  )
                : order.date || "N/A";

              return (
                <div
                  className={`order-card ${
                    isExpanded ? "expanded" : ""
                  }`}
                  key={order._id || displayOrderId}
                >

                  {/* ORDER HEADER */}

                  <div className="order-card-header">

                    <div className="order-id-block">

                      <span className="order-label">
                        ORDER ID
                      </span>

                      <h3>
                        {displayOrderId}
                      </h3>

                    </div>

                    <div className="order-status">
                      <span className="status-dot"></span>
                      {order.status}
                    </div>

                  </div>

                  {/* ORDER INFORMATION */}

                  <div className="order-info-grid">

                    <div className="order-info-item">

                      <span>
                        DATE
                      </span>

                      <strong>
                        {orderDate}
                      </strong>

                    </div>

                    <div className="order-info-item">

                      <span>
                        ITEMS
                      </span>

                      <strong>
                        {itemCount}
                      </strong>

                    </div>

                    <div className="order-info-item order-total-item">

                      <span>
                        TOTAL
                      </span>

                      <strong>
                        ₹
                        {Number(
                          order.total || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>

                    <button
                      className="order-details-button"
                      type="button"
                      onClick={() =>
                        toggleOrder(displayOrderId)
                      }
                    >

                      <span>
                        {isExpanded
                          ? "Hide Details"
                          : "View Details"}
                      </span>

                      {isExpanded ? (
                        <ChevronUp size={17} />
                      ) : (
                        <ChevronDown size={17} />
                      )}

                    </button>

                  </div>

                  {/* EXPANDED DETAILS */}

                  {isExpanded && (

                    <div className="order-expanded">

                      {/* PRODUCTS */}

                      <div className="order-expanded-section">

                        <div className="order-section-title">

                          <Package size={20} />

                          <h3>
                            Products
                          </h3>

                        </div>

                        <div className="order-products">

                          {order.items?.map(
                            (item, index) => (

                              <div
                                className="order-product"
                                key={`${item.id}-${index}`}
                              >

                                <img
                                  src={item.image}
                                  alt={item.name}
                                />

                                <div className="order-product-info">

                                  <h4>
                                    {item.name}
                                  </h4>

                                  <p>
                                    Quantity:{" "}
                                    {item.quantity}
                                  </p>

                                  <strong>
                                    ₹
                                    {Number(
                                      item.price || 0
                                    ).toLocaleString(
                                      "en-IN"
                                    )}
                                  </strong>

                                </div>

                                <div className="order-product-total">

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

                            )
                          )}

                        </div>

                      </div>

                      {/* PAYMENT */}

                      <div className="order-expanded-section">

                        <div className="order-section-title">

                          <CreditCard size={20} />

                          <h3>
                            Payment
                          </h3>

                        </div>

                        <div className="order-info-row">

                          <span>
                            Payment Method
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
                            Payment Status
                          </span>

                          <strong>
                            {order.paymentStatus ||
                              "Pending"}
                          </strong>

                        </div>

                      </div>

                      {/* DELIVERY DETAILS */}

                      {order.customer &&
                        Object.keys(
                          order.customer
                        ).length > 0 && (

                          <div className="order-expanded-section">

                            <div className="order-section-title">

                              <MapPin size={20} />

                              <h3>
                                Delivery Details
                              </h3>

                            </div>

                            <div className="order-customer">

                              {order.customer.name && (
                                <p>
                                  <strong>
                                    Name:
                                  </strong>{" "}
                                  {order.customer.name}
                                </p>
                              )}

                              {order.customer.phone && (
                                <p>
                                  <strong>
                                    Phone:
                                  </strong>{" "}
                                  {order.customer.phone}
                                </p>
                              )}

                              {order.customer.email && (
                                <p>
                                  <strong>
                                    Email:
                                  </strong>{" "}
                                  {order.customer.email}
                                </p>
                              )}

                              {order.customer.address && (
                                <p>
                                  <strong>
                                    Address:
                                  </strong>{" "}
                                  {order.customer.address}
                                </p>
                              )}

                              {order.customer.city && (
                                <p>
                                  <strong>
                                    City:
                                  </strong>{" "}
                                  {order.customer.city}
                                </p>
                              )}

                              {order.customer.state && (
                                <p>
                                  <strong>
                                    State:
                                  </strong>{" "}
                                  {order.customer.state}
                                </p>
                              )}

                              {order.customer.pincode && (
                                <p>
                                  <strong>
                                    PIN Code:
                                  </strong>{" "}
                                  {order.customer.pincode}
                                </p>
                              )}

                            </div>

                          </div>

                        )}

                      {/* FINAL TOTAL */}

                      <div className="order-final-total">

                        <span>
                          Order Total
                        </span>

                        <strong>
                          ₹
                          {Number(
                            order.total || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                    </div>

                  )}

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}

export default Orders;