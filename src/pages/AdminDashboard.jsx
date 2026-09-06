import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { API_URL } from "../config";

function AdminDashboard() {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      productsSold: 0,
      averageOrderValue: 0,
    },
    recentOrders: [],
    topProducts: [],
    salesTrend: [],
    orderStatus: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("novaToken");

        const response = await fetch(
          `${API_URL}/api/admin/analytics`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch admin analytics"
          );
        }

        setAnalytics({
          overview: {
            totalRevenue:
              data.overview?.totalRevenue || 0,
            totalOrders:
              data.overview?.totalOrders || 0,
            totalCustomers:
              data.overview?.totalCustomers || 0,
            productsSold:
              data.overview?.productsSold || 0,
            averageOrderValue:
              data.overview?.averageOrderValue || 0,
          },
          recentOrders:
            data.recentOrders || [],
          topProducts:
            data.topProducts || [],
          salesTrend:
            data.salesTrend || [],
          orderStatus:
            data.orderStatus || [],
        });
      } catch (error) {
        console.error(
          "Failed to load analytics:",
          error
        );

        setError(
          error.message ||
            "Unable to load analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    );
  };

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <p>VELNORA ADMIN</p>
          <h1>Dashboard</h1>
          <span>
            Store analytics and management overview
          </span>
        </div>
      </div>

      {error && (
        <div
          style={{
            marginBottom: "20px",
            padding: "14px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading analytics...</p>
      ) : (
        <>
          <div className="admin-stats">
            <div className="admin-stat-card">
              <span>💰</span>

              <div>
                <p>Total Revenue</p>

                <h2>
                  {formatCurrency(
                    analytics.overview.totalRevenue
                  )}
                </h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <span>🛒</span>

              <div>
                <p>Total Orders</p>

                <h2>
                  {analytics.overview.totalOrders}
                </h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <span>👥</span>

              <div>
                <p>Total Customers</p>

                <h2>
                  {analytics.overview.totalCustomers}
                </h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <span>📦</span>

              <div>
                <p>Products Sold</p>

                <h2>
                  {analytics.overview.productsSold}
                </h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <span>📈</span>

              <div>
                <p>Average Order</p>

                <h2>
                  {formatCurrency(
                    analytics.overview.averageOrderValue
                  )}
                </h2>
              </div>
            </div>
          </div>

          <div
            className="admin-dashboard-sections"
            style={{
              marginTop: "30px",
            }}
          >
            <div className="admin-dashboard-card">
              <h2>Top Selling Products</h2>

              {analytics.topProducts.length === 0 ? (
                <p>
                  No sales data available yet.
                </p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: "14px",
                  }}
                >
                  {analytics.topProducts.map(
                    (product, index) => (
                      <div
                        key={
                          product._id || index
                        }
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "center",
                          gap: "12px",
                          paddingBottom: "12px",
                          borderBottom:
                            "1px solid #eee",
                        }}
                      >
                        <div>
                          <strong>
                            {index + 1}.{" "}
                            {product.name ||
                              "Product"}
                          </strong>

                          <p
                            style={{
                              margin:
                                "4px 0 0",
                            }}
                          >
                            {product.quantitySold} sold
                          </p>
                        </div>

                        <strong>
                          {formatCurrency(
                            product.revenue
                          )}
                        </strong>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            <div className="admin-dashboard-card">
              <h2>Order Status</h2>

              {analytics.orderStatus.length === 0 ? (
                <p>
                  No orders available yet.
                </p>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "320px",
                  }}
                >
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={analytics.orderStatus}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {analytics.orderStatus.map(
                          (entry, index) => (
                            <Cell
                              key={`${entry.status}-${index}`}
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip />

                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          <div
            className="admin-dashboard-card"
            style={{
              marginTop: "30px",
            }}
          >
            <h2>Recent Orders</h2>

            {analytics.recentOrders.length === 0 ? (
              <p>No recent orders.</p>
            ) : (
              <div
                style={{
                  overflowX: "auto",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse:
                      "collapse",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "12px",
                        }}
                      >
                        Order
                      </th>

                      <th
                        style={{
                          textAlign: "left",
                          padding: "12px",
                        }}
                      >
                        Customer
                      </th>

                      <th
                        style={{
                          textAlign: "left",
                          padding: "12px",
                        }}
                      >
                        Total
                      </th>

                      <th
                        style={{
                          textAlign: "left",
                          padding: "12px",
                        }}
                      >
                        Status
                      </th>

                      <th
                        style={{
                          textAlign: "left",
                          padding: "12px",
                        }}
                      >
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {analytics.recentOrders.map(
                      (order) => (
                        <tr key={order._id}>
                          <td
                            style={{
                              padding: "12px",
                              borderTop:
                                "1px solid #eee",
                            }}
                          >
                            {order.orderId ||
                              order._id
                                ?.slice(-8)
                                .toUpperCase()}
                          </td>

                          <td
                            style={{
                              padding: "12px",
                              borderTop:
                                "1px solid #eee",
                            }}
                          >
                            {order.userId?.name ||
                              order
                                .shippingAddress
                                ?.fullName ||
                              "Customer"}
                          </td>

                          <td
                            style={{
                              padding: "12px",
                              borderTop:
                                "1px solid #eee",
                            }}
                          >
                            {formatCurrency(
                              order.total
                            )}
                          </td>

                          <td
                            style={{
                              padding: "12px",
                              borderTop:
                                "1px solid #eee",
                            }}
                          >
                            {order.status}
                          </td>

                          <td
                            style={{
                              padding: "12px",
                              borderTop:
                                "1px solid #eee",
                            }}
                          >
                            {formatDate(
                              order.createdAt
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div
            className="admin-dashboard-card"
            style={{
              marginTop: "30px",
            }}
          >
            <h2>Last 30 Days Sales</h2>

            {analytics.salesTrend.length === 0 ? (
              <p>
                No sales during the last 30 days.
              </p>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "340px",
                }}
              >
                <ResponsiveContainer>
                  <LineChart
                    data={analytics.salesTrend}
                    margin={{
                      top: 20,
                      right: 20,
                      left: 10,
                      bottom: 20,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="date"
                      tick={{
                        fontSize: 12,
                      }}
                    />

                    <YAxis
                      tick={{
                        fontSize: 12,
                      }}
                    />

                    <Tooltip
                      formatter={(
                        value,
                        name
                      ) => {
                        if (
                          name ===
                          "revenue"
                        ) {
                          return [
                            formatCurrency(
                              value
                            ),
                            "Revenue",
                          ];
                        }

                        return [
                          value,
                          name,
                        ];
                      }}
                    />

                    <Legend />

                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      strokeWidth={3}
                      activeDot={{
                        r: 6,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </>
      )}

      <div
        className="admin-dashboard-sections"
        style={{
          marginTop: "30px",
        }}
      >
        <div className="admin-dashboard-card">
          <h2>
            Product Management
          </h2>

          <p>
            Add, edit and delete products from your
            VELNORA Fashion Store.
          </p>

          <Link
            to="/admin/products"
            className="admin-dashboard-button"
          >
            Manage Products →
          </Link>
        </div>

        <div className="admin-dashboard-card">
          <h2>
            User Management
          </h2>

          <p>
            View and manage registered customers and
            their accounts.
          </p>

          <Link
            to="/admin/users"
            className="admin-dashboard-button"
          >
            Manage Users →
          </Link>
        </div>

        <div className="admin-dashboard-card">
          <h2>
            Order Management
          </h2>

          <p>
            View customer orders and manage order
            status.
          </p>

          <Link
            to="/admin/orders"
            className="admin-dashboard-button"
          >
            Manage Orders →
          </Link>
        </div>

        <div className="admin-dashboard-card">
          <h2>
            Customer Reviews
          </h2>

          <p>
            View product ratings, verify customer
            feedback and moderate reviews.
          </p>

          <Link
            to="/admin/reviews"
            className="admin-dashboard-button"
          >
            Manage Reviews →
          </Link>
        </div>

        <div className="admin-dashboard-card">
          <h2>
            Coupons & Discounts
          </h2>

          <p>
            Create and manage promotional coupon
            codes and discounts for VELNORA
            customers.
          </p>

          <Link
            to="/admin/coupons"
            className="admin-dashboard-button"
          >
            Manage Coupons →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;