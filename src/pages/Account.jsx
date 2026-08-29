import { Link, useNavigate } from "react-router-dom";

import {
  User,
  Package,
  Heart,
  ShoppingBag,
  LogOut,
  ChevronRight,
  MapPin,
  ShieldCheck,
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

        {/* PROFILE HEADER */}

        <div className="account-profile-card">

          <div className="account-avatar">
            <User size={26} />
          </div>

          <div className="account-profile-details">

            <span>Welcome</span>

            <h2>
              {user?.name || "NOVA Customer"}
            </h2>

            <p>
              {user?.email || "NOVA Customer"}
            </p>

          </div>

        </div>


        {/* SHOPPING SECTION */}

        <div className="account-section">

          <h3 className="account-section-title">
            My Shopping
          </h3>

          <div className="account-menu">

            <Link
              to="/orders"
              className="account-menu-item"
            >

              <div className="account-menu-icon">
                <Package size={19} />
              </div>

              <div className="account-menu-text">

                <strong>
                  My Orders
                </strong>

                <span>
                  Track and view your orders
                </span>

              </div>

              <ChevronRight size={17} />

            </Link>


            <Link
              to="/wishlist"
              className="account-menu-item"
            >

              <div className="account-menu-icon">
                <Heart size={19} />
              </div>

              <div className="account-menu-text">

                <strong>
                  Wishlist
                </strong>

                <span>
                  Your saved products
                </span>

              </div>

              <ChevronRight size={17} />

            </Link>


            <Link
              to="/shop"
              className="account-menu-item"
            >

              <div className="account-menu-icon">
                <ShoppingBag size={19} />
              </div>

              <div className="account-menu-text">

                <strong>
                  Continue Shopping
                </strong>

                <span>
                  Explore latest products
                </span>

              </div>

              <ChevronRight size={17} />

            </Link>

          </div>

        </div>


        {/* ACCOUNT SECTION */}

        <div className="account-section">

          <h3 className="account-section-title">
            Account
          </h3>

          <div className="account-menu">

            <div className="account-menu-item">

              <div className="account-menu-icon">
                <MapPin size={19} />
              </div>

              <div className="account-menu-text">

                <strong>
                  Saved Addresses
                </strong>

                <span>
                  Manage delivery addresses
                </span>

              </div>

              <ChevronRight size={17} />

            </div>


            <div className="account-menu-item">

              <div className="account-menu-icon">
                <ShieldCheck size={19} />
              </div>

              <div className="account-menu-text">

                <strong>
                  Account Details
                </strong>

                <span>
                  Personal information
                </span>

              </div>

              <ChevronRight size={17} />

            </div>

          </div>

        </div>


        {/* LOGOUT */}

        <button
          type="button"
          className="account-logout-new"
          onClick={handleLogout}
        >
          <LogOut size={17} />

          Logout
        </button>

      </div>

    </div>
  );
}

export default Account;