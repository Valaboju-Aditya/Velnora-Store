import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Trash2,
} from "lucide-react";

function Wishlist({
  wishlist = [],
  removeFromWishlist,
  addToCart,
}) {
  return (
    <div className="wishlist-page">
      <div className="wishlist-container">

        {/* HEADER */}

        <div className="wishlist-header">
          <p>
            YOUR SAVED ITEMS
          </p>

          <h1>
            My Wishlist
          </h1>

          <span>
            {wishlist.length}{" "}
            {wishlist.length === 1
              ? "item"
              : "items"}
          </span>
        </div>


        {/* EMPTY WISHLIST */}

        {wishlist.length === 0 ? (

          <div className="wishlist-empty">

            <Heart size={50} />

            <h2>
              Your wishlist is empty
            </h2>

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

          /* WISHLIST PRODUCTS */

          <div className="wishlist-grid">

            {wishlist.map((product) => {
              const productId =
                product?._id ||
                product?.id;

              if (!productId) {
                return null;
              }

              return (
                <div
                  className="wishlist-card"
                  key={productId}
                >

                  {/* IMAGE */}

                  <div className="wishlist-image">

                    <Link
                      to={`/product/${productId}`}
                    >
                      <img
                        src={
                          product.image ||
                          "https://via.placeholder.com/400x500?text=NOVA"
                        }
                        alt={
                          product.name ||
                          "NOVA Product"
                        }
                      />
                    </Link>


                    {/* REMOVE */}

                    <button
                      type="button"
                      className="wishlist-remove"
                      onClick={() =>
                        removeFromWishlist(
                          productId
                        )
                      }
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>


                  {/* PRODUCT INFO */}

                  <div className="wishlist-info">

                    <Link
                      to={`/product/${productId}`}
                    >
                      <h3>
                        {product.name ||
                          "NOVA Product"}
                      </h3>
                    </Link>

                    <p>
                      ₹
                      {Number(
                        product.price || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </p>


                    {/* ADD TO CART */}

                    <button
                      type="button"
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
              );
            })}

          </div>

        )}

      </div>
    </div>
  );
}

export default Wishlist;