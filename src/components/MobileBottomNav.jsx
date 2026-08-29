import { Link, useLocation } from "react-router-dom";

import {
  House,
  Search,
  Heart,
  ShoppingBag,
  User,
} from "lucide-react";

function MobileBottomNav({
  cart = [],
  wishlist = [],
}) {
  const location = useLocation();

  const hideBottomNav =
  location.pathname.startsWith("/admin") ||
  location.pathname === "/login" ||
  location.pathname === "/register" ||
  location.pathname === "/checkout";

if (hideBottomNav) {
  return null;
}

  const cartCount = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  function active(path) {
  if (
    path === "/shop" &&
    location.pathname.startsWith("/product/")
  ) {
    return "active";
  }

  return location.pathname === path
    ? "active"
    : "";
}

  return (
    <nav className="mobile-bottom-nav">

      <Link
        to="/"
        className={active("/")}
      >
        <House size={20} />
        <span>Home</span>
      </Link>

      <Link
        to="/shop"
        className={active("/shop")}
      >
        <Search size={20} />
        <span>Shop</span>
      </Link>

      <Link
        to="/wishlist"
        className={`mobile-nav-item ${active(
          "/wishlist"
        )}`}
      >
        <Heart size={20} />
        <span>Wishlist</span>

        {wishlist.length > 0 && (
          <small>{wishlist.length}</small>
        )}
      </Link>

      <Link
        to="/cart"
        className={`mobile-nav-item ${active(
          "/cart"
        )}`}
      >
        <ShoppingBag size={20} />
        <span>Cart</span>

        {cartCount > 0 && (
          <small>{cartCount}</small>
        )}
      </Link>

      <Link
        to="/account"
        className={active("/account")}
      >
        <User size={20} />
        <span>Account</span>
      </Link>

    </nav>
  );
}

export default MobileBottomNav;