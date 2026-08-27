import { Link } from "react-router-dom";

function Admin() {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <p className="admin-label">NOVA ADMIN</p>
          <h1>Dashboard</h1>
          <p>Manage your fashion store from one place.</p>
        </div>

        <Link to="/" className="admin-back">
          Back to Store
        </Link>
      </div>

      <div className="admin-cards">
        <div className="admin-card">
          <span className="admin-card-icon">📦</span>
          <h2>Products</h2>
          <p>Manage your store products.</p>
          <Link to="/admin/products">Manage Products →</Link>
        </div>

        <div className="admin-card">
          <span className="admin-card-icon">🛒</span>
          <h2>Orders</h2>
          <p>View and manage customer orders.</p>
          <Link to="/admin/orders">View Orders →</Link>
        </div>

        <div className="admin-card">
          <span className="admin-card-icon">👥</span>
          <h2>Users</h2>
          <p>View registered customers.</p>
          <Link to="/admin/users">View Users →</Link>
        </div>
      </div>
    </div>
  );
}

export default Admin;