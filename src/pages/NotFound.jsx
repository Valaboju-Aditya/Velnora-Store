import { Link } from "react-router-dom";
import { Home, ShoppingBag } from "lucide-react";

function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <h1>404</h1>

        <h2>Page Not Found</h2>

        <p>
          The page you are looking for does not exist
          or may have been moved.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="not-found-home">
            <Home size={18} />
            Go Home
          </Link>

          <Link to="/shop" className="not-found-shop">
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default NotFound;