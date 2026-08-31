import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">

        <div className="footer-brand">
          <Link
            to="/"
            className="footer-logo"
          >
            NOVA
          </Link>

          <p>
            Modern fashion designed for everyday
            confidence, comfort and style.
          </p>
        </div>

        <div className="footer-column">
          <h3>Shop</h3>

          <Link to="/shop?category=Men">
            Men
          </Link>

          <Link to="/shop?category=Women">
            Women
          </Link>

          <Link to="/shop?category=Accessories">
            Accessories
          </Link>

          <Link to="/shop?new=true">
            New Arrivals
          </Link>

          <Link to="/shop?sale=true">
            Sale
          </Link>
        </div>

        <div className="footer-column">
          <h3>Help</h3>

          <Link to="/contact">
            Contact Us
          </Link>

          <Link to="/shipping">
            Shipping Policy
          </Link>

          <Link to="/returns">
            Returns & Refunds
          </Link>

          <Link to="/orders">
            Track Orders
          </Link>
        </div>

        <div className="footer-column">
          <h3>Company</h3>

          <Link to="/about">
            About NOVA
          </Link>

          <Link to="/privacy">
            Privacy Policy
          </Link>

          <Link to="/terms">
            Terms & Conditions
          </Link>
        </div>

      </div>

      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} NOVA.
          All rights reserved.
        </p>

        <span>
          <Mail size={15} />
          support@nova.com
        </span>

      </div>
    </footer>
  );
}

export default Footer;