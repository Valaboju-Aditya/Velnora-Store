import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Package,
  Heart,
  ShoppingBag,
  LogOut,
  ChevronRight,
} from "lucide-react";

function Account({ user, onLogout }) {
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();
    navigate("/");
  }

  return (
    <div className="account-page">
      <div className="account-container">
        {/* Header */}
        <div className="account-header">
          <p className="account-label">YOUR ACCOUNT</p>

          <h1>My Account</h1>

          <p>
            Manage your profile, orders, wishlist and
            account settings.
          </p>
        </div>

        {/* User Profile */}
        <div className="account-profile">
          <div className="profile-icon">
            <User size={32} />
          </div>

          <div className="profile-info">
            <h2>
              {user?.name || "NOVA Customer"}
            </h2>

            <p>
              {user?.email || "Welcome to NOVA"}
            </p>
          </div>
        </div>

        {/* Account Options */}
        <div className="account-grid">
          {/* Orders */}
          <Link
            to="/orders"
            className="account-card"
          >
            <div className="account-card-icon">
              <Package size={24} />
            </div>

            <div className="account-card-content">
              <h3>My Orders</h3>

              <p>
                View your previous orders and
                order details.
              </p>
            </div>

            <ChevronRight size={20} />
          </Link>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="account-card"
          >
            <div className="account-card-icon">
              <Heart size={24} />
            </div>

            <div className="account-card-content">
              <h3>My Wishlist</h3>

              <p>
                View products you have saved
                for later.
              </p>
            </div>

            <ChevronRight size={20} />
          </Link>

          {/* Shopping */}
          <Link
            to="/shop"
            className="account-card"
          >
            <div className="account-card-icon">
              <ShoppingBag size={24} />
            </div>

            <div className="account-card-content">
              <h3>Continue Shopping</h3>

              <p>
                Explore the latest NOVA fashion
                collection.
              </p>
            </div>

            <ChevronRight size={20} />
          </Link>
        </div>

        {/* Logout */}
        <button
          className="account-logout"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </button>

        {/* Back Home */}
        <Link
          to="/"
          className="account-home-link"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Account;