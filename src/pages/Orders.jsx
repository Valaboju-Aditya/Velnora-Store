
import { useState } from "react";
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

function Orders({ orders }) {
  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleOrder = (orderId) => {
    setExpandedOrder((current) =>
      current === orderId ? null : orderId
    );
  };

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

          <Link to="/shop" className="orders-continue-shopping">
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

          /* ORDERS */

          <div className="orders-list">

            {orders.map((order) => {

              const isExpanded =
                expandedOrder === order.id;

              const itemCount = order.items.reduce(
                (total, item) =>
                  total + item.quantity,
                0
              );

              return (
                <div
                  className={`order-card ${
                    isExpanded ? "expanded" : ""
                  }`}
                  key={order.id}
                >

                  {/* =================================================
                     PREMIUM ORDER HEADER
                  ================================================= */}

                  <div className="order-card-header">

                    {/* ORDER ID */}

                    <div className="order-id-block">

                      <span className="order-label">
                        ORDER ID
                      </span>

                      <h3>
                        {order.id}
                      </h3>

                    </div>


                    {/* STATUS */}

                    <div className="order-status">
                      <span className="status-dot"></span>
                      {order.status}
                    </div>

                  </div>


                  {/* =================================================
                     HORIZONTAL ORDER INFORMATION
                  ================================================= */}

                  <div className="order-info-grid">

                    {/* DATE */}

                    <div className="order-info-item">

                      <span>
                        DATE
                      </span>

                      <strong>
                        {order.date}
                      </strong>

                    </div>


                    {/* ITEMS */}

                    <div className="order-info-item">

                      <span>
                        ITEMS
                      </span>

                      <strong>
                        {itemCount}
                      </strong>

                    </div>


                    {/* TOTAL */}

                    <div className="order-info-item order-total-item">

                      <span>
                        TOTAL
                      </span>

                      <strong>
                        ₹
                        {order.total.toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>


                    {/* VIEW DETAILS */}

                    <button
                      className="order-details-button"
                      type="button"
                      onClick={() =>
                        toggleOrder(order.id)
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


                  {/* =================================================
                     EXPANDED DETAILS
                  ================================================= */}

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

                          {order.items.map(
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
                                    {item.price.toLocaleString(
                                      "en-IN"
                                    )}
                                  </strong>

                                </div>


                                <div className="order-product-total">

                                  ₹
                                  {(
                                    item.price *
                                    item.quantity
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
                          {order.total.toLocaleString(
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
