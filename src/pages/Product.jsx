import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  ArrowLeft,
  Truck,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

const products = [
  {
    id: 1,
    name: "Oversized Premium T-Shirt",
    price: 899,
    category: "Men",
    rating: 4.8,
    reviews: 124,
    description:
      "Premium oversized t-shirt designed for everyday comfort and modern style.",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 2,
    name: "Classic Denim Jacket",
    price: 1999,
    category: "Men",
    rating: 4.7,
    reviews: 98,
    description:
      "Classic denim jacket designed to give your outfit a clean and timeless look.",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 3,
    name: "Premium Hoodie",
    price: 1499,
    category: "Men",
    rating: 4.9,
    reviews: 156,
    description:
      "Soft premium hoodie with a relaxed fit and modern streetwear style.",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 4,
    name: "Casual Cotton Shirt",
    price: 1199,
    category: "Men",
    rating: 4.6,
    reviews: 87,
    description:
      "Lightweight cotton shirt perfect for casual and smart-casual outfits.",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 5,
    name: "Women's Summer Dress",
    price: 1599,
    category: "Women",
    rating: 4.8,
    reviews: 132,
    description:
      "Elegant summer dress designed for a comfortable and stylish everyday look.",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 6,
    name: "Women's Casual Outfit",
    price: 1299,
    category: "Women",
    rating: 4.7,
    reviews: 76,
    description:
      "Modern casual outfit designed for comfort and everyday fashion.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 7,
    name: "Classic Sneakers",
    price: 1799,
    category: "Accessories",
    rating: 4.9,
    reviews: 211,
    description:
      "Classic sneakers combining everyday comfort with a clean modern design.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 8,
    name: "Premium Sunglasses",
    price: 999,
    category: "Accessories",
    rating: 4.7,
    reviews: 64,
    description:
      "Premium sunglasses with a clean and timeless design.",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=85",
  },
];

function Product({ addToCart }) {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="product-not-found">
        <h1>Product Not Found</h1>

        <Link to="/shop">
          <ArrowLeft size={17} />
          Back to Shop
        </Link>
      </div>
    );
  }

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  }

  return (
    <div className="product-page">

      {/* BACK BUTTON */}

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

        </div>

        {/* INFORMATION */}

        <div className="product-details-info">

          <p className="product-category">
            {product.category}
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
              {product.rating}
            </span>

            <span>
              ({product.reviews} reviews)
            </span>

          </div>

          {/* PRICE */}

          <h2 className="product-price">
            ₹
            {product.price.toLocaleString(
              "en-IN"
            )}
          </h2>

          {/* DESCRIPTION */}

          <p className="product-description">
            {product.description}
          </p>

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

              {["S", "M", "L", "XL"].map(
                (item) => (

                  <button
                    key={item}
                    className={
                      size === item
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      setSize(item)
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
                onClick={() =>
                  setQuantity(
                    Math.max(
                      1,
                      quantity - 1
                    )
                  )
                }
              >
                −
              </button>

              <span>
                {quantity}
              </span>

              <button
                onClick={() =>
                  setQuantity(
                    quantity + 1
                  )
                }
              >
                +
              </button>

            </div>

          </div>

          {/* ACTION BUTTONS */}

          <div className="product-actions">

            <button
              className="product-add-cart"
              onClick={
                handleAddToCart
              }
            >

              <ShoppingBag size={19} />

              {added
                ? "Added to Cart ✓"
                : "Add to Cart"}

            </button>

            <button
              className="product-wishlist"
              onClick={() =>
                setWishlist(!wishlist)
              }
            >

              <Heart
                size={21}
                fill={
                  wishlist
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

              <RotateCcw size={22} />

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

              <ShieldCheck size={22} />

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
