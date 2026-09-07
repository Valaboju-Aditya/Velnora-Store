import {
  useEffect,
  useState,
} from "react";

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
  const [analytics, setAnalytics] =
    useState({
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

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadAnalytics =
      async () => {
        try {
          setLoading(true);
          setError("");

          const token =
            localStorage.getItem(
              "novaToken"
            );

          const response =
            await fetch(
              `${API_URL}/api/admin/analytics`,
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
                "Failed to fetch admin analytics"
            );
          }

          setAnalytics({
            overview: {
              totalRevenue:
                data.overview
                  ?.totalRevenue ||
                0,

              totalOrders:
                data.overview
                  ?.totalOrders ||
                0,

              totalCustomers:
                data.overview
                  ?.totalCustomers ||
                0,

              productsSold:
                data.overview
                  ?.productsSold ||
                0,

              averageOrderValue:
                data.overview
                  ?.averageOrderValue ||
                0,
            },

            recentOrders:
              data.recentOrders ||
              [],

            topProducts:
              data.topProducts ||
              [],

            salesTrend:
              data.salesTrend ||
              [],

            orderStatus:
              data.orderStatus ||
              [],
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

  const formatCurrency = (
    value
  ) => {
    return Number(
      value || 0
    ).toLocaleString(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    );
  };

  const PIE_COLORS = [
    "#7c3aed",
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
    "#0891b2",
    "#db2777",
  ];

  const formatDate = (
    value
  ) => {
    if (!value) {
      return "-";
    }

    return new Date(
      value
    ).toLocaleDateString(
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
            Store analytics and
            management overview
          </span>
        </div>
      </div>

      {error && (
        <div className="admin-dashboard-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="admin-dashboard-loading">
          <p>
            Loading analytics...
          </p>
        </div>
      ) : (
        <>
          <div className="admin-stats">
            <div className="admin-stat-card">
              <span className="admin-stat-icon">
                💰
              </span>

              <div className="admin-stat-content">
                <p>
                  Total Revenue
                </p>

                <h2>
                  {formatCurrency(
                    analytics
                      .overview
                      .totalRevenue
                  )}
                </h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <span className="admin-stat-icon">
                🛒
              </span>

              <div className="admin-stat-content">
                <p>
                  Total Orders
                </p>

                <h2>
                  {
                    analytics
                      .overview
                      .totalOrders
                  }
                </h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <span className="admin-stat-icon">
                👥
              </span>

              <div className="admin-stat-content">
                <p>
                  Total Customers
                </p>

                <h2>
                  {
                    analytics
                      .overview
                      .totalCustomers
                  }
                </h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <span className="admin-stat-icon">
                📦
              </span>

              <div className="admin-stat-content">
                <p>
                  Products Sold
                </p>

                <h2>
                  {
                    analytics
                      .overview
                      .productsSold
                  }
                </h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <span className="admin-stat-icon">
                📈
              </span>

              <div className="admin-stat-content">
                <p>
                  Average Order
                </p>

                <h2>
                  {formatCurrency(
                    analytics
                      .overview
                      .averageOrderValue
                  )}
                </h2>
              </div>
            </div>
          </div>

          <div className="admin-analytics-grid">
            <div className="admin-dashboard-card">
              <h2>
                Top Selling Products
              </h2>

              {analytics
                .topProducts
                .length === 0 ? (
                <p>
                  No sales data
                  available yet.
                </p>
              ) : (
                <div className="admin-top-products">
                  {analytics.topProducts.map(
                    (
                      product,
                      index
                    ) => (
                      <div
                        key={
                          product._id ||
                          index
                        }
                        className="admin-top-product"
                      >
                        <div className="admin-top-product-info">
                          <strong>
                            {index +
                              1}
                            .{" "}
                            {product.name ||
                              "Product"}
                          </strong>

                          <p>
                            {
                              product.quantitySold
                            }{" "}
                            sold
                          </p>
                        </div>

                        <strong className="admin-top-product-revenue">
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
              <h2>
                Order Status
              </h2>

              {analytics
                .orderStatus
                .length === 0 ? (
                <p>
                  No orders
                  available yet.
                </p>
              ) : (
                <div className="admin-pie-chart">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={
                          analytics.orderStatus
                        }
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="43%"
                        outerRadius="65%"
                      >
                        {analytics.orderStatus.map(
                          (
                            entry,
                            index
                          ) => (
                            <Cell
                              key={`${entry.status}-${index}`}
                              fill={
                                PIE_COLORS[
                                  index %
                                    PIE_COLORS.length
                                ]
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip />

                      <Legend
                        verticalAlign="bottom"
                        height={55}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          <div className="admin-dashboard-card admin-recent-orders-card">
            <h2>
              Recent Orders
            </h2>

            {analytics
              .recentOrders
              .length === 0 ? (
              <p>
                No recent orders.
              </p>
            ) : (
              <>
                <div className="admin-orders-desktop">
                  <table className="admin-orders-table">
                    <thead>
                      <tr>
                        <th>
                          Order
                        </th>

                        <th>
                          Customer
                        </th>

                        <th>
                          Total
                        </th>

                        <th>
                          Status
                        </th>

                        <th>
                          Date
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {analytics.recentOrders.map(
                        (
                          order
                        ) => (
                          <tr
                            key={
                              order._id
                            }
                          >
                            <td>
                              {order.orderId ||
                                order._id
                                  ?.slice(
                                    -8
                                  )
                                  .toUpperCase()}
                            </td>

                            <td>
                              {order
                                .userId
                                ?.name ||
                                order
                                  .shippingAddress
                                  ?.fullName ||
                                "Customer"}
                            </td>

                            <td>
                              {formatCurrency(
                                order.total
                              )}
                            </td>

                            <td>
                              <span className="admin-order-status">
                                {
                                  order.status
                                }
                              </span>
                            </td>

                            <td>
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

                <div className="admin-orders-mobile">
                  {analytics.recentOrders.map(
                    (order) => (
                      <div
                        key={
                          order._id
                        }
                        className="admin-mobile-order-card"
                      >
                        <div className="admin-mobile-order-top">
                          <div>
                            <span className="admin-mobile-order-label">
                              ORDER
                            </span>

                            <strong>
                              {order.orderId ||
                                order._id
                                  ?.slice(
                                    -8
                                  )
                                  .toUpperCase()}
                            </strong>
                          </div>

                          <span className="admin-order-status">
                            {
                              order.status
                            }
                          </span>
                        </div>

                        <div className="admin-mobile-order-details">
                          <div>
                            <span>
                              Customer
                            </span>

                            <strong>
                              {order
                                .userId
                                ?.name ||
                                order
                                  .shippingAddress
                                  ?.fullName ||
                                "Customer"}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Total
                            </span>

                            <strong>
                              {formatCurrency(
                                order.total
                              )}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Date
                            </span>

                            <strong>
                              {formatDate(
                                order.createdAt
                              )}
                            </strong>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </>
            )}
          </div>

          <div className="admin-dashboard-card admin-sales-card">
            <h2>
              Last 30 Days Sales
            </h2>

            {analytics
              .salesTrend
              .length === 0 ? (
              <p>
                No sales during the
                last 30 days.
              </p>
            ) : (
              <div className="admin-sales-chart">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <LineChart
                    data={
                      analytics.salesTrend
                    }
                    margin={{
                      top: 15,
                      right: 12,
                      left: -15,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="date"
                      tick={{
                        fontSize: 10,
                      }}
                      minTickGap={25}
                    />

                    <YAxis
                      tick={{
                        fontSize: 10,
                      }}
                      width={55}
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
                      stroke="#7c3aed"
                      strokeWidth={
                        3
                      }
                      dot={false}
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

      <div className="admin-management-section">
        <div className="admin-dashboard-card admin-management-card">
          <h2>
            Product Management
          </h2>

          <p>
            Add, edit and delete
            products from your
            VELNORA Fashion Store.
          </p>

          <Link
            to="/admin/products"
            className="admin-dashboard-button"
          >
            Manage Products →
          </Link>
        </div>

        <div className="admin-dashboard-card admin-management-card">
          <h2>
            User Management
          </h2>

          <p>
            View and manage
            registered customers
            and their accounts.
          </p>

          <Link
            to="/admin/users"
            className="admin-dashboard-button"
          >
            Manage Users →
          </Link>
        </div>

        <div className="admin-dashboard-card admin-management-card">
          <h2>
            Order Management
          </h2>

          <p>
            View customer orders
            and manage order
            status.
          </p>

          <Link
            to="/admin/orders"
            className="admin-dashboard-button"
          >
            Manage Orders →
          </Link>
        </div>

        <div className="admin-dashboard-card admin-management-card">
          <h2>
            Customer Reviews
          </h2>

          <p>
            View product ratings,
            verify customer
            feedback and moderate
            reviews.
          </p>

          <Link
            to="/admin/reviews"
            className="admin-dashboard-button"
          >
            Manage Reviews →
          </Link>
        </div>

        <div className="admin-dashboard-card admin-management-card">
          <h2>
            Coupons & Discounts
          </h2>

          <p>
            Create and manage
            promotional coupon
            codes and discounts
            for VELNORA customers.
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