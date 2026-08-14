import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

function Wishlist({
  wishlist,
  removeFromWishlist,
  addToCart,
}) {
  return (
    <div className="wishlist-page">
      <div className="wishlist-container">

        <div className="wishlist-header">
          <p>YOUR SAVED ITEMS</p>
          <h1>My Wishlist</h1>
          <span>
            {wishlist.length}{" "}
            {wishlist.length === 1
              ? "item"
              : "items"}
          </span>
        </div>

        {wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <Heart size={50} />

            <h2>Your wishlist is empty</h2>

            <p>
              Save your favorite fashion pieces
              and find them here later.
            </p>

            <Link
              to="/shop"
              className="wishlist-shop-button"
            >
              <ShoppingBag size={18} />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((product) => (
              <div
                className="wishlist-card"
                key={product.id}
              >
                <div className="wishlist-image">
                  <Link
                    to={`/product/${product.id}`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                  </Link>

                  <button
                    className="wishlist-remove"
                    onClick={() =>
                      removeFromWishlist(product.id)
                    }
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="wishlist-info">
                  <Link
                    to={`/product/${product.id}`}
                  >
                    <h3>{product.name}</h3>
                  </Link>

                  <p>
                    ₹
                    {product.price.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  <button
                    className="wishlist-cart-button"
                    onClick={() =>
                      addToCart(product)
                    }
                  >
                    <ShoppingBag size={17} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Wishlist;