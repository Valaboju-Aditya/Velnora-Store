import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
        const productsResponse = await fetch(
          "http://localhost:5000/api/products"
        );

        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products");
        }

        const products = await productsResponse.json();

        setStats((prev) => ({
          ...prev,
          products: products.length,
        }));
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
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
          <span>Welcome to your store management panel</span>
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
            Add, edit and delete products from your NOVA Fashion Store.
          </p>

          <Link
            to="/admin/products"
            className="admin-dashboard-button"
          >
            Manage Products
          </Link>
        </div>

        <div className="admin-dashboard-card">
          <h2>User Management</h2>
          <p>
            View and manage registered customers and their accounts.
          </p>

          <Link
            to="/admin/users"
            className="admin-dashboard-button"
          >
            Manage Users
          </Link>
        </div>

        <div className="admin-dashboard-card">
          <h2>Order Management</h2>
          <p>
            View customer orders and manage order status.
          </p>

          <Link
            to="/admin/orders"
            className="admin-dashboard-button"
          >
            Manage Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;