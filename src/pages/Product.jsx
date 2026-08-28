import { useEffect, useState } from "react";
import { API_URL } from "../config";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  Heart,
  ShoppingBag,
  ArrowLeft,
  Truck,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

function Product({
  addToCart,
  wishlist = [],
  toggleWishlist,
}) {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/${id}`);

        if (!response.ok) {
          throw new Error(
            "Product not found"
          );
        }

        const data =
          await response.json();

        if (!ignore) {
          setProduct(data);
        }
      } catch (error) {
        if (!ignore) {
          console.error(
            "Failed to load product:",
            error
          );

          setError(
            error.message ||
              "Unable to load product"
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="product-not-found">
        <h1>
          Loading Product...
        </h1>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-not-found">

        <h1>
          Product Not Found
        </h1>

        <p>
          {error}
        </p>

        <Link to="/shop">
          <ArrowLeft size={17} />
          Back to Shop
        </Link>

      </div>
    );
  }

  const productId =
    product._id || product.id;

  const liked =
    wishlist.some(
      (item) =>
        (item._id || item.id) ===
        productId
    );

  const stock =
    Number(product.stock ?? 0);

  const outOfStock =
    stock <= 0;

  const lowStock =
    stock > 0 &&
    stock <= 5;

  const maxQuantityReached =
    stock > 0 &&
    quantity >= stock;

  function handleAddToCart() {
    if (outOfStock) {
      alert(
        "This product is currently out of stock."
      );

      return;
    }

    const safeQuantity =
      Math.min(
        quantity,
        stock
      );

    for (
      let i = 0;
      i < safeQuantity;
      i++
    ) {
      addToCart(product);
    }

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  }

  function increaseQuantity() {
    if (
      !outOfStock &&
      quantity < stock
    ) {
      setQuantity(
        quantity + 1
      );
    }
  }

  function decreaseQuantity() {
    setQuantity(
      Math.max(
        1,
        quantity - 1
      )
    );
  }

  return (
    <div className="product-page">

      {/* BACK */}

      <Link
        to="/shop"
        className="back-to-shop"
      >
        <ArrowLeft size={17} />
        Back to Shop
      </Link>


      {/* PRODUCT */}

      <div className="product-details">

        {/* IMAGE */}

        <div className="product-details-image">

          <img
            src={product.image}
            alt={product.name}
          />

          {outOfStock && (
            <span className="product-stock-badge out">
              Out of Stock
            </span>
          )}

          {lowStock && (
            <span className="product-stock-badge low">
              Only {stock} left
            </span>
          )}

        </div>


        {/* INFORMATION */}

        <div className="product-details-info">

          <p className="product-category">
            {product.category ||
              "NOVA Collection"}
          </p>

          <h1>
            {product.name}
          </h1>


          {/* RATING */}

          <div className="product-rating">

            <span>
              ★★★★★
            </span>

            <span>
              {product.rating || "4.8"}
            </span>

            <span>
              (
              {product.reviews || 0}
              {" "}
              reviews)
            </span>

          </div>


          {/* PRICE */}

          <h2 className="product-price">

            ₹
            {Number(
              product.price || 0
            ).toLocaleString(
              "en-IN"
            )}

          </h2>


          {/* DESCRIPTION */}

          <p className="product-description">
            {product.description ||
              "Premium NOVA fashion designed for comfort, quality and modern everyday style."}
          </p>


          {/* STOCK */}

          <div
            className={`product-stock ${
              outOfStock
                ? "out"
                : lowStock
                ? "low"
                : "available"
            }`}
          >

            {outOfStock ? (

              <span>
                Out of Stock
              </span>

            ) : lowStock ? (

              <span>
                Hurry! Only {stock} left in stock
              </span>

            ) : (

              <span>
                In Stock · {stock} available
              </span>

            )}

          </div>


          {/* SIZE */}

          <div className="size-section">

            <div className="size-title">

              <strong>
                Select Size
              </strong>

              <span>
                Size Guide
              </span>

            </div>

            <div className="size-buttons">

              {[
                "S",
                "M",
                "L",
                "XL",
              ].map(
                (item) => (

                  <button
                    type="button"
                    key={item}
                    className={
                      size === item
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      setSize(item)
                    }
                    disabled={
                      outOfStock
                    }
                  >
                    {item}
                  </button>

                )
              )}

            </div>

          </div>


          {/* QUANTITY */}

          <div className="quantity-section">

            <strong>
              Quantity
            </strong>

            <div className="quantity-control">

              <button
                type="button"
                onClick={
                  decreaseQuantity
                }
                disabled={
                  quantity <= 1 ||
                  outOfStock
                }
              >
                −
              </button>

              <span>
                {quantity}
              </span>

              <button
                type="button"
                onClick={
                  increaseQuantity
                }
                disabled={
                  outOfStock ||
                  maxQuantityReached
                }
              >
                +
              </button>

            </div>

            {maxQuantityReached &&
              !outOfStock && (
                <span className="product-max-stock">
                  Maximum available quantity reached
                </span>
              )}

          </div>


          {/* ACTIONS */}

          <div className="product-actions">

            <button
              type="button"
              className="product-add-cart"
              onClick={
                handleAddToCart
              }
              disabled={
                outOfStock
              }
            >

              <ShoppingBag
                size={19}
              />

              {outOfStock
                ? "Out of Stock"
                : added
                ? "Added to Cart ✓"
                : "Add to Cart"}

            </button>


            <button
              type="button"
              className="product-wishlist"
              onClick={() => {
                if (
                  toggleWishlist
                ) {
                  toggleWishlist(
                    product
                  );
                }
              }}
              aria-label="Toggle wishlist"
            >

              <Heart
                size={21}
                fill={
                  liked
                    ? "currentColor"
                    : "none"
                }
              />

            </button>

          </div>


          {/* BENEFITS */}

          <div className="product-benefits">

            <div className="benefit">

              <Truck size={22} />

              <div>

                <strong>
                  Free Shipping
                </strong>

                <span>
                  On orders above ₹999
                </span>

              </div>

            </div>


            <div className="benefit">

              <RotateCcw
                size={22}
              />

              <div>

                <strong>
                  Easy Returns
                </strong>

                <span>
                  7-day return policy
                </span>

              </div>

            </div>


            <div className="benefit">

              <ShieldCheck
                size={22}
              />

              <div>

                <strong>
                  Secure Payment
                </strong>

                <span>
                  100% secure checkout
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Product;