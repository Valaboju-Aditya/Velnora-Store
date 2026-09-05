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
          padding: "40px",
        }}
      >
        <h2>
          Reviews
        </h2>

        <p>
          Loading reviews...
        </p>
      </div>
    );
  }


  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f6f6",
        padding: "32px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: "20px",
            marginBottom: "28px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 6px",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "1.5px",
              }}
            >
              VELNORA ADMIN
            </p>

            <h1
              style={{
                margin: 0,
                fontSize: "32px",
              }}
            >
              Customer Reviews
            </h1>

            <p
              style={{
                margin:
                  "8px 0 0",
                color: "#666",
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
              padding:
                "12px 18px",
              borderRadius: "8px",
              fontWeight: "700",
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
              padding: "14px",
              borderRadius: "8px",
              marginBottom: "18px",
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
              padding: "14px",
              borderRadius: "8px",
              marginBottom: "18px",
            }}
          >
            {message}
          </div>
        )}


        {reviews.length === 0 ? (
          <div
            style={{
              background: "#fff",
              padding: "50px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <Star
              size={35}
              style={{
                marginBottom:
                  "12px",
              }}
            />

            <h3>
              No reviews yet
            </h3>

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
              gap: "18px",
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
                    style={{
                      background:
                        "#fff",
                      borderRadius:
                        "12px",
                      padding: "22px",
                      boxShadow:
                        "0 2px 10px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                        gap: "20px",
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <div
                        style={{
                          display:
                            "flex",
                          gap: "15px",
                          alignItems:
                            "center",
                        }}
                      >
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
                            style={{
                              width:
                                "70px",
                              height:
                                "80px",
                              objectFit:
                                "cover",
                              borderRadius:
                                "8px",
                            }}
                          />
                        )}

                        <div>
                          <h3
                            style={{
                              margin:
                                "0 0 5px",
                            }}
                          >
                            {review
                              .product
                              ?.name ||
                              "Deleted Product"}
                          </h3>

                          <p
                            style={{
                              margin: 0,
                              color:
                                "#666",
                              fontSize:
                                "14px",
                            }}
                          >
                            {review
                              .user
                              ?.name ||
                              review.userName}
                          </p>

                          {review.user
                            ?.email && (
                            <p
                              style={{
                                margin:
                                  "3px 0 0",
                                color:
                                  "#888",
                                fontSize:
                                  "13px",
                              }}
                            >
                              {
                                review
                                  .user
                                  .email
                              }
                            </p>
                          )}
                        </div>
                      </div>


                      <span
                        style={{
                          ...statusStyle(
                            review.status
                          ),
                          padding:
                            "7px 12px",
                          borderRadius:
                            "20px",
                          fontSize:
                            "12px",
                          fontWeight:
                            "700",
                        }}
                      >
                        {review.status}
                      </span>
                    </div>


                    <div
                      style={{
                        marginTop:
                          "18px",
                      }}
                    >
                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "12px",
                          flexWrap:
                            "wrap",
                        }}
                      >
                        {renderStars(
                          Number(
                            review.rating
                          )
                        )}

                        <strong>
                          {review.rating}/5
                        </strong>

                        {review.verifiedPurchase && (
                          <span
                            style={{
                              display:
                                "inline-flex",
                              alignItems:
                                "center",
                              gap: "5px",
                              fontSize:
                                "13px",
                              fontWeight:
                                "700",
                            }}
                          >
                            <BadgeCheck
                              size={
                                16
                              }
                            />
                            Verified Purchase
                          </span>
                        )}
                      </div>


                      <p
                        style={{
                          margin:
                            "15px 0",
                          lineHeight:
                            "1.7",
                          color: "#333",
                        }}
                      >
                        {review.comment}
                      </p>


                      <p
                        style={{
                          margin: 0,
                          color: "#888",
                          fontSize:
                            "13px",
                        }}
                      >
                        {review.createdAt
                          ? new Date(
                              review.createdAt
                            ).toLocaleString(
                              "en-IN"
                            )
                          : ""}
                      </p>
                    </div>


                    <div
                      style={{
                        display:
                          "flex",
                        gap: "10px",
                        flexWrap:
                          "wrap",
                        marginTop:
                          "20px",
                        paddingTop:
                          "18px",
                        borderTop:
                          "1px solid #eee",
                      }}
                    >
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
                        style={{
                          padding:
                            "10px 15px",
                          cursor:
                            "pointer",
                        }}
                      >
                        <Check
                          size={15}
                        />{" "}
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
                        style={{
                          padding:
                            "10px 15px",
                          cursor:
                            "pointer",
                        }}
                      >
                        <X
                          size={15}
                        />{" "}
                        Reject
                      </button>


                      <button
                        type="button"
                        disabled={working}
                        onClick={() =>
                          deleteReview(
                            review._id
                          )
                        }
                        style={{
                          padding:
                            "10px 15px",
                          cursor:
                            "pointer",
                        }}
                      >
                        {working ? (
                          <RefreshCw
                            size={15}
                          />
                        ) : (
                          <Trash2
                            size={15}
                          />
                        )}{" "}
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