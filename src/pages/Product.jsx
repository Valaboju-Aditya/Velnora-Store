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
  Star,
  BadgeCheck,
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

  const [reviews, setReviews] =
    useState([]);

  const [
    reviewsLoading,
    setReviewsLoading,
  ] = useState(true);

  const [reviewRating, setReviewRating] =
    useState(0);

  const [reviewComment, setReviewComment] =
    useState("");

  const [
    reviewSubmitting,
    setReviewSubmitting,
  ] = useState(false);

  const [
    reviewError,
    setReviewError,
  ] = useState("");

  const [
    reviewSuccess,
    setReviewSuccess,
  ] = useState("");

  const loadProduct = async () => {
    const response = await fetch(
      `${API_URL}/api/products/${id}`
    );

    if (!response.ok) {
      throw new Error(
        "Product not found"
      );
    }

    const data =
      await response.json();

    setProduct(data);

    return data;
  };

  

  useEffect(() => {
    let ignore = false;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

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

    fetchProduct();

    return () => {
      ignore = true;
    };
  }, [id]);

  useEffect(() => {
  let ignore = false;

  fetch(
    `${API_URL}/api/reviews/product/${id}`
  )
    .then(async (response) => {
      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load reviews"
        );
      }

      return data;
    })
    .then((data) => {
      if (!ignore) {
        setReviews(
          Array.isArray(data)
            ? data
            : []
        );
      }
    })
    .catch((error) => {
      if (!ignore) {
        console.error(
          "Load reviews error:",
          error
        );
      }
    })
    .finally(() => {
      if (!ignore) {
        setReviewsLoading(false);
      }
    });

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
        "Premium VELNORA fashion designed for comfort, quality and modern everyday style.",

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
        product.ratingAverage ||
          0
      );

    const realReviews =
      Number(
        product.ratingCount ||
          0
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

  const handleReviewSubmit =
    async (event) => {
      event.preventDefault();

      setReviewError("");
      setReviewSuccess("");

      const token =
        localStorage.getItem(
          "novaToken"
        );

      if (!token) {
        setReviewError(
          "Please login before submitting a review."
        );

        return;
      }

      if (
        reviewRating < 1 ||
        reviewRating > 5
      ) {
        setReviewError(
          "Please select a star rating."
        );

        return;
      }

      const cleanComment =
        reviewComment.trim();

      if (!cleanComment) {
        setReviewError(
          "Please write your review."
        );

        return;
      }

      try {
        setReviewSubmitting(true);

        const response =
          await fetch(
            `${API_URL}/api/reviews/product/${id}`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify({
                  rating:
                    reviewRating,

                  comment:
                    cleanComment,
                }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to submit review"
          );
        }

        setReviewRating(0);
        setReviewComment("");

        setReviewSuccess(
          "Thank you! Your review has been submitted."
        );

        const reviewsResponse =
  await fetch(
    `${API_URL}/api/reviews/product/${id}`
  );

const updatedReviews =
  await reviewsResponse.json();

if (reviewsResponse.ok) {
  setReviews(
    Array.isArray(
      updatedReviews
    )
      ? updatedReviews
      : []
  );
}

await loadProduct();
      } catch (error) {
        console.error(
          "Submit review error:",
          error
        );

        setReviewError(
          error.message ||
            "Unable to submit review."
        );
      } finally {
        setReviewSubmitting(false);
      }
    };

  const renderStars = (
    rating
  ) => {
    const rounded =
      Math.round(
        Number(rating || 0)
      );

    return Array.from(
      { length: 5 },
      (_, index) =>
        index < rounded
          ? "★"
          : "☆"
    ).join("");
  };

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

  const ratingAverage =
    Number(
      product.ratingAverage ||
        0
    );

  const ratingCount =
    Number(
      product.ratingCount ||
        0
    );

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
              {ratingCount > 0
                ? renderStars(
                    ratingAverage
                  )
                : "☆☆☆☆☆"}
            </span>

            {ratingCount > 0 ? (
              <>
                <span>
                  {ratingAverage.toFixed(
                    1
                  )}
                </span>

                <span>
                  (
                  {ratingCount}{" "}
                  {ratingCount === 1
                    ? "review"
                    : "reviews"}
                  )
                </span>
              </>
            ) : (
              <span>
                No reviews yet
              </span>
            )}

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
                      size === item
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

      <section
        style={{
          maxWidth: "1200px",
          margin: "70px auto 0",
          padding: "0 20px 70px",
        }}
      >

        <div
          style={{
            borderTop:
              "1px solid #e5e5e5",
            paddingTop:
              "50px",
          }}
        >

          <div
            style={{
              marginBottom:
                "35px",
            }}
          >

            <p
              style={{
                fontSize:
                  "12px",
                letterSpacing:
                  "2px",
                fontWeight:
                  "700",
                marginBottom:
                  "8px",
              }}
            >
              CUSTOMER FEEDBACK
            </p>

            <h2
              style={{
                fontSize:
                  "32px",
                margin:
                  "0 0 12px",
              }}
            >
              Reviews & Ratings
            </h2>

            <div
              style={{
                display:
                  "flex",
                alignItems:
                  "center",
                gap:
                  "12px",
                flexWrap:
                  "wrap",
              }}
            >

              <strong
                style={{
                  fontSize:
                    "28px",
                }}
              >
                {ratingCount > 0
                  ? ratingAverage.toFixed(
                      1
                    )
                  : "0.0"}
              </strong>

              <span
                style={{
                  color:
                    "#d49b00",
                  fontSize:
                    "22px",
                  letterSpacing:
                    "2px",
                }}
              >
                {ratingCount > 0
                  ? renderStars(
                      ratingAverage
                    )
                  : "☆☆☆☆☆"}
              </span>

              <span
                style={{
                  color:
                    "#666",
                }}
              >
                Based on{" "}
                {ratingCount}{" "}
                {ratingCount === 1
                  ? "review"
                  : "reviews"}
              </span>

            </div>

          </div>

          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(300px, 1fr))",
              gap:
                "35px",
              alignItems:
                "start",
            }}
          >

            <div>

              <h3
                style={{
                  marginTop:
                    "0",
                  marginBottom:
                    "20px",
                }}
              >
                Customer Reviews
              </h3>

              {reviewsLoading ? (

                <p>
                  Loading reviews...
                </p>

              ) : reviews.length ===
                0 ? (

                <div
                  style={{
                    padding:
                      "30px",
                    border:
                      "1px solid #e6e6e6",
                    borderRadius:
                      "10px",
                  }}
                >

                  <h4
                    style={{
                      marginTop:
                        "0",
                    }}
                  >
                    No reviews yet
                  </h4>

                  <p
                    style={{
                      color:
                        "#666",
                      marginBottom:
                        "0",
                    }}
                  >
                    Be the first verified
                    customer to review this
                    product.
                  </p>

                </div>

              ) : (

                <div
                  style={{
                    display:
                      "grid",
                    gap:
                      "16px",
                  }}
                >

                  {reviews.map(
                    (review) => (

                      <div
                        key={
                          review._id
                        }
                        style={{
                          border:
                            "1px solid #e6e6e6",

                          borderRadius:
                            "10px",

                          padding:
                            "20px",
                        }}
                      >

                        <div
                          style={{
                            display:
                              "flex",

                            justifyContent:
                              "space-between",

                            gap:
                              "12px",

                            alignItems:
                              "flex-start",

                            marginBottom:
                              "10px",
                          }}
                        >

                          <div>

                            <strong>
                              {review.userName ||
                                "VELNORA Customer"}
                            </strong>

                            {review.verifiedPurchase && (
                              <div
                                style={{
                                  display:
                                    "flex",

                                  alignItems:
                                    "center",

                                  gap:
                                    "5px",

                                  color:
                                    "#067647",

                                  fontSize:
                                    "13px",

                                  marginTop:
                                    "5px",
                                }}
                              >

                                <BadgeCheck
                                  size={
                                    15
                                  }
                                />

                                Verified Purchase

                              </div>
                            )}

                          </div>

                          <span
                            style={{
                              color:
                                "#d49b00",

                              letterSpacing:
                                "1px",

                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {renderStars(
                              review.rating
                            )}
                          </span>

                        </div>

                        <p
                          style={{
                            margin:
                              "12px 0",

                            lineHeight:
                              "1.6",

                            color:
                              "#333",
                          }}
                        >
                          {review.comment}
                        </p>

                        <small
                          style={{
                            color:
                              "#777",
                          }}
                        >
                          {review.createdAt
                            ? new Date(
                                review.createdAt
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : ""}
                        </small>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

            <div
              style={{
                border:
                  "1px solid #e6e6e6",

                borderRadius:
                  "12px",

                padding:
                  "26px",

                position:
                  "sticky",

                top:
                  "100px",
              }}
            >

              <h3
                style={{
                  margin:
                    "0 0 8px",
                }}
              >
                Write a Review
              </h3>

              <p
                style={{
                  color:
                    "#666",

                  fontSize:
                    "14px",

                  lineHeight:
                    "1.5",

                  marginTop:
                    "0",

                  marginBottom:
                    "22px",
                }}
              >
                Only customers who have
                purchased this product and
                received their order can
                submit a review.
              </p>

              {!localStorage.getItem(
                "novaToken"
              ) && (

                <div
                  style={{
                    padding:
                      "13px 15px",

                    background:
                      "#f7f7f7",

                    borderRadius:
                      "8px",

                    marginBottom:
                      "18px",
                  }}
                >
                  <Link
                    to="/login"
                    style={{
                      color:
                        "#111",

                      fontWeight:
                        "600",
                    }}
                  >
                    Login to write a review
                  </Link>
                </div>

              )}

              <form
                onSubmit={
                  handleReviewSubmit
                }
              >

                <label
                  style={{
                    display:
                      "block",

                    fontWeight:
                      "600",

                    marginBottom:
                      "10px",
                  }}
                >
                  Your Rating
                </label>

                <div
                  style={{
                    display:
                      "flex",

                    gap:
                      "6px",

                    marginBottom:
                      "22px",
                  }}
                >

                  {[1, 2, 3, 4, 5].map(
                    (star) => (

                      <button
                        type="button"
                        key={
                          star
                        }
                        onClick={() =>
                          setReviewRating(
                            star
                          )
                        }
                        aria-label={`Rate ${star} star`}
                        style={{
                          border:
                            "none",

                          background:
                            "transparent",

                          padding:
                            "0",

                          cursor:
                            "pointer",

                          color:
                            star <=
                            reviewRating
                              ? "#d49b00"
                              : "#bbb",
                        }}
                      >
                        <Star
                          size={
                            30
                          }
                          fill={
                            star <=
                            reviewRating
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>

                    )
                  )}

                </div>

                <label
                  htmlFor="review-comment"
                  style={{
                    display:
                      "block",

                    fontWeight:
                      "600",

                    marginBottom:
                      "10px",
                  }}
                >
                  Your Review
                </label>

                <textarea
                  id="review-comment"
                  value={
                    reviewComment
                  }
                  onChange={(
                    event
                  ) =>
                    setReviewComment(
                      event.target.value
                    )
                  }
                  maxLength={
                    1000
                  }
                  rows={
                    6
                  }
                  placeholder="Tell us what you think about this product..."
                  style={{
                    width:
                      "100%",

                    boxSizing:
                      "border-box",

                    resize:
                      "vertical",

                    padding:
                      "13px",

                    border:
                      "1px solid #ccc",

                    borderRadius:
                      "8px",

                    font:
                      "inherit",

                    outline:
                      "none",
                  }}
                />

                <div
                  style={{
                    textAlign:
                      "right",

                    color:
                      "#777",

                    fontSize:
                      "12px",

                    marginTop:
                      "6px",
                  }}
                >
                  {reviewComment.length}/1000
                </div>

                {reviewError && (
                  <div
                    style={{
                      marginTop:
                        "15px",

                      padding:
                        "12px",

                      borderRadius:
                        "7px",

                      background:
                        "#fff0f0",

                      color:
                        "#b42318",

                      fontSize:
                        "14px",
                    }}
                  >
                    {reviewError}
                  </div>
                )}

                {reviewSuccess && (
                  <div
                    style={{
                      marginTop:
                        "15px",

                      padding:
                        "12px",

                      borderRadius:
                        "7px",

                      background:
                        "#eefbf3",

                      color:
                        "#067647",

                      fontSize:
                        "14px",
                    }}
                  >
                    {reviewSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    reviewSubmitting
                  }
                  style={{
                    marginTop:
                      "20px",

                    width:
                      "100%",

                    padding:
                      "14px 20px",

                    border:
                      "none",

                    background:
                      "#111",

                    color:
                      "#fff",

                    borderRadius:
                      "8px",

                    fontWeight:
                      "700",

                    fontSize:
                      "15px",

                    cursor:
                      reviewSubmitting
                        ? "not-allowed"
                        : "pointer",

                    opacity:
                      reviewSubmitting
                        ? 0.65
                        : 1,
                  }}
                >
                  {reviewSubmitting
                    ? "Submitting..."
                    : "Submit Review"}
                </button>

              </form>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Product;