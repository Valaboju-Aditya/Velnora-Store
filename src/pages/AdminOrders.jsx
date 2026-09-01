import { useEffect, useState } from "react";
import { API_URL } from "../config";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadOrders = async () => {
      try {
        const token = localStorage.getItem("novaToken");

        const response = await fetch(
          `${API_URL}/api/admin/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();

        if (!ignore) {
          setOrders(data);
        }
      } catch (error) {
        if (!ignore) {
          console.error(
            "Failed to fetch orders:",
            error
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

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    try {
      const token = localStorage.getItem("novaToken");

      const response = await fetch(
        `${API_URL}/api/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update order status"
        );
      }

      const data = await response.json();

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: data.order.status,
              }
            : order
        )
      );

      alert("Order status updated");
    } catch (error) {
      console.error(
        "Failed to update order:",
        error
      );

      alert("Failed to update order status");
    }
  };

  if (loading) {
    return (
      <div className="admin-orders-page">
        <div className="admin-orders-message">
          Loading orders...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">

      <div className="admin-orders-header">

        <div>
          <p>velnora ADMIN</p>

          <h1>Manage Orders</h1>

          <span>
            View and manage customer orders
          </span>
        </div>

        <div className="admin-orders-count">
          <strong>
            {orders.length}
          </strong>

          <span>
            Total Orders
          </span>
        </div>

      </div>

      {orders.length === 0 ? (

        <div className="admin-orders-empty">
          <h2>No orders yet</h2>

          <p>
            Customer orders will appear here.
          </p>
        </div>

      ) : (

        <div className="admin-orders-list">

          {orders.map((order) => (

            <div
              className="admin-order-card"
              key={order._id}
            >

              <div className="admin-order-top">

                <div>
                  <span className="admin-order-label">
                    ORDER ID
                  </span>

                  <h2>
                    {order.orderId}
                  </h2>
                </div>

                <span
                  className={`admin-order-status ${
                    order.status === "Delivered"
                      ? "delivered"
                      : order.status === "Cancelled"
                      ? "cancelled"
                      : ""
                  }`}
                >
                  {order.status}
                </span>

              </div>

              <div className="admin-order-info-grid">

                <div>
                  <span>
                    Customer
                  </span>

                  <strong>
                    {order.customer?.name}
                  </strong>

                  <p>
                    {order.customer?.email}
                  </p>

                  <p>
                    {order.customer?.phone}
                  </p>
                </div>

                <div>
                  <span>
                    Delivery Address
                  </span>

                  <strong>
                    {order.customer?.city}
                    {order.customer?.state
                      ? `, ${order.customer.state}`
                      : ""}
                  </strong>

                  <p>
                    {order.customer?.address}
                  </p>

                  <p>
                    PIN: {order.customer?.pincode}
                  </p>
                </div>

                <div>
                  <span>
                    Payment
                  </span>

                  <strong>
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </strong>

                  <p>
                    {order.paymentStatus}
                  </p>
                </div>

                <div>
                  <span>
                    Total
                  </span>

                  <strong>
                    ₹
                    {Number(
                      order.total || 0
                    ).toLocaleString("en-IN")}
                  </strong>

                  <p>
                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleDateString(
                          "en-IN"
                        )
                      : ""}
                  </p>
                </div>

              </div>

              <div className="admin-order-products">

                <h3>
                  Products
                </h3>

                {order.items?.map(
                  (item, index) => (

                    <div
                      className="admin-order-product"
                      key={`${item.id}-${index}`}
                    >

                      <img
                        src={item.image}
                        alt={item.name}
                      />

                      <div className="admin-order-product-info">

                        <h4>
                          {item.name}
                        </h4>

                        <p>
                          Quantity: {item.quantity}
                        </p>

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

                  )
                )}

              </div>

              <div className="admin-order-footer">

                <div>
                  <span>
                    Update Order Status
                  </span>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(
                        order._id,
                        e.target.value
                      )
                    }
                  >
                    <option value="Order Confirmed">
                      Order Confirmed
                    </option>

                    <option value="Processing">
                      Processing
                    </option>

                    <option value="Shipped">
                      Shipped
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </select>
                </div>

                <div className="admin-order-total">
                  <span>
                    Order Total
                  </span>

                  <strong>
                    ₹
                    {Number(
                      order.total || 0
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default AdminOrders;