import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";

function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    sales: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const token = localStorage.getItem("novaToken");

        const response = await fetch(
          `${API_URL}/api/admin/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch admin statistics");
        }

        const data = await response.json();

        setStats({
          products: data.products || 0,
          users: data.users || 0,
          orders: data.orders || 0,
          sales: data.sales || 0,
        });
      } catch (error) {
        console.error(
          "Failed to load dashboard stats:",
          error
        );
      }
    };

    loadStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <p>NOVA ADMIN</p>
          <h1>Dashboard</h1>
          <span>
            Welcome to your store management panel
          </span>
        </div>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <span>📦</span>

          <div>
            <p>Total Products</p>
            <h2>{stats.products}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <span>👥</span>

          <div>
            <p>Total Users</p>
            <h2>{stats.users}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <span>🛒</span>

          <div>
            <p>Total Orders</p>
            <h2>{stats.orders}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <span>💰</span>

          <div>
            <p>Total Sales</p>
            <h2>₹{stats.sales}</h2>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-sections">
        <div className="admin-dashboard-card">
          <h2>Product Management</h2>

          <p>
            Add, edit and delete products from your
            NOVA Fashion Store.
          </p>

          <Link
            to="/admin/products"
            className="admin-dashboard-button"
          >
            Manage Products →
          </Link>
        </div>

        <div className="admin-dashboard-card">
          <h2>User Management</h2>

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
          <h2>Order Management</h2>

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
      </div>
    </div>
  );
}

export default AdminDashboard;
