import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Package,
  MapPin,
  CreditCard,
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
          <p>YOUR ACCOUNT</p>

          <h1>My Orders</h1>

          <span>
            View your previous orders and order details.
          </span>
        </div>


        {/* EMPTY ORDERS */}

        {orders.length === 0 ? (
          <div className="empty-orders">

            <div className="empty-orders-icon">
              📦
            </div>

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
            </Link>

          </div>
        ) : (

          /* ORDERS */

          <div className="orders-list">

            {orders.map((order) => {

              const isExpanded =
                expandedOrder === order.id;

              return (
                <div
                  className="order-card"
                  key={order.id}
                >

                  {/* ORDER HEADER */}

                  <div className="order-top">

                    <div>

                      <span>
                        ORDER ID
                      </span>

                      <h3>
                        {order.id}
                      </h3>

                    </div>

                    <div className="order-status">
                      {order.status}
                    </div>

                  </div>


                  {/* ORDER SUMMARY */}

                  <div className="order-details">

                    <div>

                      <span>
                        DATE
                      </span>

                      <p>
                        {order.date}
                      </p>

                    </div>


                    <div>

                      <span>
                        ITEMS
                      </span>

                      <p>
                        {order.items.reduce(
                          (total, item) =>
                            total + item.quantity,
                          0
                        )}
                      </p>

                    </div>


                    <div>

                      <span>
                        TOTAL
                      </span>

                      <p>
                        ₹
                        {order.total.toLocaleString(
                          "en-IN"
                        )}
                      </p>

                    </div>

                  </div>


                  {/* VIEW DETAILS BUTTON */}

                  <button
                    className="order-details-button"
                    type="button"
                    onClick={() =>
                      toggleOrder(order.id)
                    }
                  >

                    {isExpanded ? (
                      <>
                        Hide Details
                        <ChevronUp size={18} />
                      </>
                    ) : (
                      <>
                        View Details
                        <ChevronDown size={18} />
                      </>
                    )}

                  </button>


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


                                <div>

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


                      {/* CUSTOMER DETAILS */}

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


                      {/* TOTAL */}

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