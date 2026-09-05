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

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [size, setSize] =
    useState("M");

  const [quantity, setQuantity] =
    useState(1);

  const [added, setAdded] =
    useState(false);

  useEffect(() => {
    let ignore = false;

    const loadProduct = async () => {
      try {
        const response =
          await fetch(
            `${API_URL}/api/products/${id}`
          );

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

  useEffect(() => {
    if (!product) {
      return;
    }

    const originalTitle =
      document.title;

    const metaDescription =
      document.querySelector(
        'meta[name="description"]'
      );

    const originalDescription =
      metaDescription?.getAttribute(
        "content"
      );

    const canonicalLink =
      document.querySelector(
        'link[rel="canonical"]'
      );

    const originalCanonical =
      canonicalLink?.getAttribute(
        "href"
      );

    const productId =
      product._id ||
      product.id;

    const productUrl =
      `${window.location.origin}/product/${productId}`;

    const description =
      product.description ||
      `Shop ${product.name} at VELNORA. Discover premium fashion designed for comfort, quality and modern everyday style.`;

    document.title =
      `${product.name} | VELNORA`;

    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        description
      );
    }

    if (canonicalLink) {
      canonicalLink.setAttribute(
        "href",
        productUrl
      );
    } else {
      const newCanonical =
        document.createElement(
          "link"
        );

      newCanonical.rel =
        "canonical";

      newCanonical.href =
        productUrl;

      newCanonical.id =
        "dynamic-product-canonical";

      document.head.appendChild(
        newCanonical
      );
    }

    return () => {
      document.title =
        originalTitle;

      if (
        metaDescription &&
        originalDescription
      ) {
        metaDescription.setAttribute(
          "content",
          originalDescription
        );
      }

      if (
        canonicalLink &&
        originalCanonical
      ) {
        canonicalLink.setAttribute(
          "href",
          originalCanonical
        );
      }

      const dynamicCanonical =
        document.getElementById(
          "dynamic-product-canonical"
        );

      if (dynamicCanonical) {
        dynamicCanonical.remove();
      }
    };
  }, [product]);

  useEffect(() => {
    if (!product) {
      return;
    }

    const productId =
      product._id ||
      product.id;

    const productUrl =
      `${window.location.origin}/product/${productId}`;

    const description =
      product.description ||
      `Shop ${product.name} at VELNORA. Premium fashion designed for comfort, quality and modern everyday style.`;

    const metaTags = {
      "og:title":
        `${product.name} | VELNORA`,

      "og:description":
        description,

      "og:image":
        product.image || "",

      "og:url":
        productUrl,

      "og:type":
        "product",
    };

    const originalValues = {};

    Object.entries(
      metaTags
    ).forEach(
      ([property, content]) => {
        let tag =
          document.querySelector(
            `meta[property="${property}"]`
          );

        if (tag) {
          originalValues[property] =
            tag.getAttribute(
              "content"
            );

          tag.setAttribute(
            "content",
            content
          );
        } else {
          tag =
            document.createElement(
              "meta"
            );

          tag.setAttribute(
            "property",
            property
          );

          tag.setAttribute(
            "content",
            content
          );

          tag.setAttribute(
            "data-velnora-product-og",
            "true"
          );

          document.head.appendChild(
            tag
          );
        }
      }
    );

    return () => {
      Object.keys(
        metaTags
      ).forEach(
        (property) => {
          const tag =
            document.querySelector(
              `meta[property="${property}"]`
            );

          if (!tag) {
            return;
          }

          if (
            tag.getAttribute(
              "data-velnora-product-og"
            ) === "true"
          ) {
            tag.remove();
          } else if (
            originalValues[property]
          ) {
            tag.setAttribute(
              "content",
              originalValues[property]
            );
          }
        }
      );
    };
  }, [product]);

  useEffect(() => {
    if (!product) {
      return;
    }

    const stock =
      Number(
        product.stock ?? 0
      );

    const productUrl =
      `${window.location.origin}/product/${
        product._id ||
        product.id
      }`;

    const structuredData = {
      "@context":
        "https://schema.org",

      "@type":
        "Product",

      name:
        product.name,

      image:
        product.image
          ? [product.image]
          : [],

      description:
        product.description ||
        `Premium VELNORA fashion designed for comfort, quality and modern everyday style.`,

      sku:
        String(
          product._id ||
            product.id ||
            ""
        ),

      brand: {
        "@type":
          "Brand",

        name:
          "VELNORA",
      },

      category:
        product.category ||
        "Fashion",

      offers: {
        "@type":
          "Offer",

        url:
          productUrl,

        priceCurrency:
          "INR",

        price:
          Number(
            product.price || 0
          ),

        availability:
          stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",

        itemCondition:
          "https://schema.org/NewCondition",

        shippingDetails: {
          "@type":
            "OfferShippingDetails",

          shippingDestination: {
            "@type":
              "DefinedRegion",

            addressCountry:
              "IN",
          },

          shippingRate: {
            "@type":
              "MonetaryAmount",

            value:
              99,

            currency:
              "INR",
          },

          deliveryTime: {
            "@type":
              "ShippingDeliveryTime",

            handlingTime: {
  "@type":
    "QuantitativeValue",

  minValue:
    1,

  maxValue:
    2,

  unitCode:
    "DAY",
},

            transitTime: {
              "@type":
                "QuantitativeValue",

              minValue:
                3,

              maxValue:
                7,

              unitCode:
                "DAY",
            },
          },
        },

        hasMerchantReturnPolicy: {
  "@type":
    "MerchantReturnPolicy",

  applicableCountry:
    "IN",

  returnPolicyCategory:
    "https://schema.org/MerchantReturnFiniteReturnWindow",

  merchantReturnDays:
    7,
},
      },
    };

    const realRating =
      Number(
        product.rating
      );

    const realReviews =
      Number(
        product.reviews
      );

    if (
      realRating > 0 &&
      realReviews > 0
    ) {
      structuredData.aggregateRating =
        {
          "@type":
            "AggregateRating",

          ratingValue:
            realRating,

          reviewCount:
            realReviews,
        };
    }

    const existingScript =
      document.getElementById(
        "product-structured-data"
      );

    if (existingScript) {
      existingScript.remove();
    }

    const script =
      document.createElement(
        "script"
      );

    script.type =
      "application/ld+json";

    script.id =
      "product-structured-data";

    script.textContent =
      JSON.stringify(
        structuredData
      );

    document.head.appendChild(
      script
    );

    return () => {
      const currentScript =
        document.getElementById(
          "product-structured-data"
        );

      if (currentScript) {
        currentScript.remove();
      }
    };
  }, [product]);

  if (loading) {
    return (
      <div className="product-not-found">
        <h1>
          Loading Product...
        </h1>
      </div>
    );
  }

  if (
    error ||
    !product
  ) {
    return (
      <div className="product-not-found">
        <h1>
          Product Not Found
        </h1>

        <p>
          {error}
        </p>

        <Link to="/shop">
          <ArrowLeft
            size={17}
          />

          Back to Shop
        </Link>
      </div>
    );
  }

  const productId =
    product._id ||
    product.id;

  const liked =
    wishlist.some(
      (item) =>
        (item._id ||
          item.id) ===
        productId
    );

  const stock =
    Number(
      product.stock ?? 0
    );

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
      i <
      safeQuantity;
      i++
    ) {
      addToCart(
        product
      );
    }

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  }

  function increaseQuantity() {
    if (
      !outOfStock &&
      quantity <
        stock
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

      <Link
        to="/shop"
        className="back-to-shop"
      >
        <ArrowLeft
          size={17}
        />

        Back to Shop
      </Link>

      <div className="product-details">

        <div className="product-details-image">

          <img
            src={
              product.image
            }
            alt={`${product.name} - VELNORA`}
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

        <div className="product-details-info">

          <p className="product-category">
            {product.category ||
              "VELNORA Collection"}
          </p>

          <h1>
            {product.name}
          </h1>

          <div className="product-rating">

            <span>
              ★★★★★
            </span>

            <span>
              {product.rating ||
                "4.8"}
            </span>

            <span>
              (
              {product.reviews ||
                0}
              {" "}
              reviews)
            </span>

          </div>

          <h2 className="product-price">

            ₹
            {Number(
              product.price ||
                0
            ).toLocaleString(
              "en-IN"
            )}

          </h2>

          <p className="product-description">
            {product.description ||
              "Premium VELNORA fashion designed for comfort, quality and modern everyday style."}
          </p>

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
                Hurry! Only{" "}
                {stock} left
                in stock
              </span>

            ) : (

              <span>
                In Stock ·{" "}
                {stock} available
              </span>

            )}

          </div>

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
                      size ===
                      item
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      setSize(
                        item
                      )
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
                  quantity <=
                    1 ||
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

          <div className="product-benefits">

            <div className="benefit">

              <Truck
                size={22}
              />

              <div>

                <strong>
                  Free Shipping
                </strong>

                <span>
                  On orders above
                  ₹999
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
                  7-day return
                  policy
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
                  100% secure
                  checkout
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