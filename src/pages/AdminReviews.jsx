import {
  useEffect,
  useState,
} from "react";

import {
  Star,
  BadgeCheck,
  Check,
  X,
  Trash2,
  RefreshCw,
} from "lucide-react";

import { API_URL } from "../config";

function AdminReviews() {
  const [reviews, setReviews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [workingId, setWorkingId] =
    useState(null);

  useEffect(() => {
    let ignore = false;

    const token =
      localStorage.getItem(
        "novaToken"
      );

    fetch(
      `${API_URL}/api/admin/reviews`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    )
      .then(async (response) => {
        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load reviews"
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
      .catch((fetchError) => {
        if (!ignore) {
          setError(
            fetchError.message
          );
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function updateStatus(
    reviewId,
    status
  ) {
    try {
      setWorkingId(reviewId);
      setError("");
      setMessage("");

      const token =
        localStorage.getItem(
          "novaToken"
        );

      const response =
        await fetch(
          `${API_URL}/api/admin/reviews/${reviewId}/status`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              status,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update review"
        );
      }

      setReviews(
        (currentReviews) =>
          currentReviews.map(
            (review) =>
              review._id === reviewId
                ? data.review
                : review
          )
      );

      setMessage(
        `Review ${status.toLowerCase()} successfully`
      );
    } catch (updateError) {
      setError(
        updateError.message
      );
    } finally {
      setWorkingId(null);
    }
  }

  async function deleteReview(
    reviewId
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to permanently delete this review?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setWorkingId(reviewId);
      setError("");
      setMessage("");

      const token =
        localStorage.getItem(
          "novaToken"
        );

      const response =
        await fetch(
          `${API_URL}/api/admin/reviews/${reviewId}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete review"
        );
      }

      setReviews(
        (currentReviews) =>
          currentReviews.filter(
            (review) =>
              review._id !== reviewId
          )
      );

      setMessage(
        "Review deleted successfully"
      );
    } catch (deleteError) {
      setError(
        deleteError.message
      );
    } finally {
      setWorkingId(null);
    }
  }

  function renderStars(rating) {
    return (
      <div
        style={{
          display: "flex",
          gap: "3px",
          flexShrink: 0,
        }}
      >
        {[1, 2, 3, 4, 5].map(
          (star) => (
            <Star
              key={star}
              size={17}
              fill={
                star <= rating
                  ? "currentColor"
                  : "none"
              }
            />
          )
        )}
      </div>
    );
  }

  function statusStyle(status) {
    if (status === "Approved") {
      return {
        background: "#e8f5e9",
        color: "#1b5e20",
      };
    }

    if (status === "Rejected") {
      return {
        background: "#ffebee",
        color: "#b71c1c",
      };
    }

    return {
      background: "#fff8e1",
      color: "#8a5a00",
    };
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f6f6f6",
          padding:
            "clamp(18px, 4vw, 40px)",
        }}
      >
        <h2>Reviews</h2>
        <p>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f6f6",
        padding:
          "clamp(14px, 3vw, 32px)",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent:
              "space-between",
            gap: "16px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              minWidth: 0,
              flex: "1 1 240px",
            }}
          >
            <p
              style={{
                margin: "0 0 6px",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "1.5px",
              }}
            >
              VELNORA ADMIN
            </p>

            <h1
              style={{
                margin: 0,
                fontSize:
                  "clamp(26px, 7vw, 32px)",
                lineHeight: "1.15",
                overflowWrap:
                  "anywhere",
              }}
            >
              Customer Reviews
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                color: "#666",
                fontSize:
                  "clamp(14px, 3.5vw, 16px)",
                lineHeight: "1.5",
              }}
            >
              Manage product ratings
              and customer reviews.
            </p>
          </div>

          <div
            style={{
              background: "#111",
              color: "#fff",
              padding: "10px 15px",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "14px",
              flexShrink: 0,
            }}
          >
            {reviews.length} Reviews
          </div>
        </div>

        {error && (
          <div
            style={{
              background: "#ffebee",
              color: "#b71c1c",
              padding: "13px",
              borderRadius: "8px",
              marginBottom: "18px",
              overflowWrap:
                "anywhere",
            }}
          >
            {error}
          </div>
        )}

        {message && (
          <div
            style={{
              background: "#e8f5e9",
              color: "#1b5e20",
              padding: "13px",
              borderRadius: "8px",
              marginBottom: "18px",
              overflowWrap:
                "anywhere",
            }}
          >
            {message}
          </div>
        )}

        {reviews.length === 0 ? (
          <div
            style={{
              background: "#fff",
              padding:
                "clamp(30px, 8vw, 50px)",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <Star
              size={35}
              style={{
                marginBottom: "12px",
              }}
            />

            <h3>No reviews yet</h3>

            <p
              style={{
                color: "#666",
              }}
            >
              Customer reviews will
              appear here.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
            {reviews.map(
              (review) => {
                const working =
                  workingId ===
                  review._id;

                return (
                  <div
                    key={review._id}
                    className="admin-review-card"
                  >
                    <div className="admin-review-product">
                      {review.product
                        ?.image && (
                        <img
                          src={
                            review
                              .product
                              .image
                          }
                          alt={
                            review
                              .product
                              .name ||
                            "Product"
                          }
                          className="admin-review-image"
                        />
                      )}

                      <div className="admin-review-product-info">
                        <h3>
                          {review
                            .product
                            ?.name ||
                            "Deleted Product"}
                        </h3>

                        <p className="admin-review-user">
                          {review.user
                            ?.name ||
                            review.userName}
                        </p>

                        {review.user
                          ?.email && (
                          <p className="admin-review-email">
                            {
                              review
                                .user
                                .email
                            }
                          </p>
                        )}

                        <span
                          className="admin-review-status"
                          style={{
                            ...statusStyle(
                              review.status
                            ),
                          }}
                        >
                          {
                            review.status
                          }
                        </span>
                      </div>
                    </div>

                    <div className="admin-review-rating">
                      {renderStars(
                        Number(
                          review.rating
                        )
                      )}

                      <strong>
                        {review.rating}
                        /5
                      </strong>

                      {review.verifiedPurchase && (
                        <span className="admin-review-verified">
                          <BadgeCheck
                            size={16}
                          />
                          Verified
                          Purchase
                        </span>
                      )}
                    </div>

                    <div className="admin-review-comment">
                      {review.comment}
                    </div>

                    <p className="admin-review-date">
                      {review.createdAt
                        ? new Date(
                            review.createdAt
                          ).toLocaleString(
                            "en-IN"
                          )
                        : ""}
                    </p>

                    <div className="admin-review-actions">
                      <button
                        type="button"
                        disabled={
                          working ||
                          review.status ===
                            "Approved"
                        }
                        onClick={() =>
                          updateStatus(
                            review._id,
                            "Approved"
                          )
                        }
                        className="admin-review-action admin-review-approve"
                      >
                        <Check
                          size={16}
                        />
                        Approve
                      </button>

                      <button
                        type="button"
                        disabled={
                          working ||
                          review.status ===
                            "Rejected"
                        }
                        onClick={() =>
                          updateStatus(
                            review._id,
                            "Rejected"
                          )
                        }
                        className="admin-review-action admin-review-reject"
                      >
                        <X
                          size={16}
                        />
                        Reject
                      </button>

                      <button
                        type="button"
                        disabled={
                          working
                        }
                        onClick={() =>
                          deleteReview(
                            review._id
                          )
                        }
                        className="admin-review-action admin-review-delete"
                      >
                        {working ? (
                          <RefreshCw
                            size={16}
                          />
                        ) : (
                          <Trash2
                            size={16}
                          />
                        )}

                        Delete
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReviews;