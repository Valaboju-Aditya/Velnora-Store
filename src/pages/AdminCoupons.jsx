import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Pencil,
  Trash2,
  TicketPercent,
  RefreshCw,
  X,
} from "lucide-react";

import { API_URL } from "../config";

function AdminCoupons() {
  const [coupons, setCoupons] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [form, setForm] =
    useState({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minimumOrderAmount: "",
      maximumDiscountAmount: "",
      usageLimit: "",
      expiresAt: "",
      isActive: true,
    });

  const token =
    localStorage.getItem(
      "novaToken"
    );

  const loadCoupons = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          `${API_URL}/api/coupons`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const contentType =
        response.headers.get(
          "content-type"
        );

      let data = null;

      if (
        contentType &&
        contentType.includes(
          "application/json"
        )
      ) {
        data =
          await response.json();
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to load coupons"
        );
      }

      setCoupons(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to load coupons"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    fetch(
      `${API_URL}/api/coupons`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    )
      .then(
        async (response) => {
          const contentType =
            response.headers.get(
              "content-type"
            );

          let data = null;

          if (
            contentType &&
            contentType.includes(
              "application/json"
            )
          ) {
            data =
              await response.json();
          }

          if (!response.ok) {
            throw new Error(
              data?.message ||
                "Failed to load coupons"
            );
          }

          return data;
        }
      )
      .then((data) => {
        if (!ignore) {
          setCoupons(
            Array.isArray(data)
              ? data
              : []
          );
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(
            err.message ||
              "Failed to load coupons"
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
  }, [token]);

  const resetForm = () => {
    setEditingId(null);

    setForm({
      code: "",
      discountType:
        "percentage",
      discountValue: "",
      minimumOrderAmount: "",
      maximumDiscountAmount: "",
      usageLimit: "",
      expiresAt: "",
      isActive: true,
    });

    setError("");
    setMessage("");
  };

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        setSaving(true);
        setError("");
        setMessage("");

        if (!form.code.trim()) {
          throw new Error(
            "Coupon code is required"
          );
        }

        if (
          !form.discountValue ||
          Number(
            form.discountValue
          ) <= 0
        ) {
          throw new Error(
            "Enter a valid discount value"
          );
        }

        const payload = {
          code: form.code
            .trim()
            .toUpperCase(),

          discountType:
            form.discountType,

          discountValue:
            Number(
              form.discountValue
            ),

          minimumOrderAmount:
            form.minimumOrderAmount ===
            ""
              ? 0
              : Number(
                  form.minimumOrderAmount
                ),

          maximumDiscountAmount:
            form.maximumDiscountAmount ===
            ""
              ? null
              : Number(
                  form.maximumDiscountAmount
                ),

          usageLimit:
            form.usageLimit === ""
              ? null
              : Number(
                  form.usageLimit
                ),

          expiresAt:
            form.expiresAt ||
            null,

          isActive:
            form.isActive,
        };

        const url = editingId
          ? `${API_URL}/api/coupons/${editingId}`
          : `${API_URL}/api/coupons`;

        const response =
          await fetch(url, {
            method: editingId
              ? "PUT"
              : "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify(
                payload
              ),
          });

        const contentType =
          response.headers.get(
            "content-type"
          );

        let data = null;

        if (
          contentType &&
          contentType.includes(
            "application/json"
          )
        ) {
          data =
            await response.json();
        }

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to save coupon"
          );
        }

        const wasEditing =
          Boolean(editingId);

        setEditingId(null);

        setForm({
          code: "",
          discountType:
            "percentage",
          discountValue: "",
          minimumOrderAmount: "",
          maximumDiscountAmount: "",
          usageLimit: "",
          expiresAt: "",
          isActive: true,
        });

        setError("");

        setMessage(
          wasEditing
            ? "Coupon updated successfully"
            : "Coupon created successfully"
        );

        await loadCoupons();
      } catch (err) {
        setError(
          err.message ||
            "Failed to save coupon"
        );
      } finally {
        setSaving(false);
      }
    };

  const handleEdit = (
    coupon
  ) => {
    setEditingId(coupon._id);

    setForm({
      code: coupon.code || "",

      discountType:
        coupon.discountType ||
        "percentage",

      discountValue:
        coupon.discountValue ??
        "",

      minimumOrderAmount:
        coupon.minimumOrderAmount ??
        "",

      maximumDiscountAmount:
        coupon.maximumDiscountAmount ??
        "",

      usageLimit:
        coupon.usageLimit ?? "",

      expiresAt:
        coupon.expiresAt
          ? new Date(
              coupon.expiresAt
            )
              .toISOString()
              .split("T")[0]
          : "",

      isActive:
        coupon.isActive !==
        false,
    });

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete =
    async (coupon) => {
      const confirmed =
        window.confirm(
          `Delete coupon "${coupon.code}"?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setError("");
        setMessage("");

        const response =
          await fetch(
            `${API_URL}/api/coupons/${coupon._id}`,
            {
              method: "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const contentType =
          response.headers.get(
            "content-type"
          );

        let data = null;

        if (
          contentType &&
          contentType.includes(
            "application/json"
          )
        ) {
          data =
            await response.json();
        }

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to delete coupon"
          );
        }

        setCoupons((prev) =>
          prev.filter(
            (item) =>
              item._id !==
              coupon._id
          )
        );

        setMessage(
          "Coupon deleted successfully"
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to delete coupon"
        );
      }
    };

  const toggleCoupon =
    async (coupon) => {
      try {
        setError("");
        setMessage("");

        const response =
          await fetch(
            `${API_URL}/api/coupons/${coupon._id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify({
                  isActive:
                    !coupon.isActive,
                }),
            }
          );

        const contentType =
          response.headers.get(
            "content-type"
          );

        let data = null;

        if (
          contentType &&
          contentType.includes(
            "application/json"
          )
        ) {
          data =
            await response.json();
        }

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to update coupon"
          );
        }

        setCoupons((prev) =>
          prev.map((item) =>
            item._id === data._id
              ? data
              : item
          )
        );

        setMessage(
          data.isActive
            ? "Coupon activated"
            : "Coupon disabled"
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to update coupon"
        );
      }
    };

  const activeCoupons =
    useMemo(
      () =>
        coupons.filter(
          (coupon) =>
            coupon.isActive
        ).length,
      [coupons]
    );

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "No expiry";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN"
    );
  };

  const formatDiscount = (
    coupon
  ) => {
    if (
      coupon.discountType ===
      "percentage"
    ) {
      return `${coupon.discountValue}% OFF`;
    }

    return `₹${coupon.discountValue} OFF`;
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        width: "100%",
        margin: "0 auto",
        padding:
          "clamp(20px, 5vw, 40px) clamp(14px, 4vw, 20px) 70px",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          marginBottom:
            "clamp(24px, 5vw, 32px)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "2px",
            color: "#777",
          }}
        >
          VELNORA ADMIN
        </p>

        <h1
          style={{
            margin:
              "8px 0 10px",
            fontSize:
              "clamp(26px, 7vw, 34px)",
            lineHeight: "1.15",
            overflowWrap:
              "anywhere",
          }}
        >
          Coupons & Discounts
        </h1>

        <p
          style={{
            margin: 0,
            color: "#666",
            fontSize:
              "clamp(14px, 3.5vw, 16px)",
            lineHeight: "1.5",
          }}
        >
          Create and manage
          discount codes for your
          customers.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(160px, 100%), 1fr))",
          gap: "14px",
          marginBottom: "26px",
        }}
      >
        <div
          style={{
            border:
              "1px solid #e5e5e5",
            borderRadius: "14px",
            padding:
              "clamp(16px, 4vw, 20px)",
            background: "#fff",
            minWidth: 0,
          }}
        >
          <p
            style={{
              margin:
                "0 0 6px",
              color: "#777",
            }}
          >
            Total Coupons
          </p>

          <h2
            style={{
              margin: 0,
              fontSize: "30px",
            }}
          >
            {coupons.length}
          </h2>
        </div>

        <div
          style={{
            border:
              "1px solid #e5e5e5",
            borderRadius: "14px",
            padding:
              "clamp(16px, 4vw, 20px)",
            background: "#fff",
            minWidth: 0,
          }}
        >
          <p
            style={{
              margin:
                "0 0 6px",
              color: "#777",
            }}
          >
            Active Coupons
          </p>

          <h2
            style={{
              margin: 0,
              fontSize: "30px",
            }}
          >
            {activeCoupons}
          </h2>
        </div>
      </div>

      <div
        style={{
          border:
            "1px solid #e5e5e5",
          borderRadius: "16px",
          padding:
            "clamp(15px, 4vw, 24px)",
          marginBottom: "34px",
          background: "#fff",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            gap: "15px",
            alignItems:
              "flex-start",
            flexWrap: "wrap",
            marginBottom: "22px",
          }}
        >
          <div
            style={{
              flex: "1 1 200px",
              minWidth: 0,
            }}
          >
            <h2
              style={{
                margin:
                  "0 0 5px",
                fontSize:
                  "clamp(20px, 5vw, 22px)",
              }}
            >
              {editingId
                ? "Edit Coupon"
                : "Create Coupon"}
            </h2>

            <p
              style={{
                margin: 0,
                color: "#777",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              Configure discount
              rules and availability.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              style={{
                border:
                  "1px solid #ddd",
                background: "#fff",
                borderRadius: "9px",
                padding:
                  "9px 13px",
                cursor: "pointer",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                gap: "6px",
                minHeight: "40px",
              }}
            >
              <X size={16} />
              Cancel Edit
            </button>
          )}
        </div>

        {error && (
          <div
            style={{
              background:
                "#fff2f2",
              border:
                "1px solid #ffc8c8",
              color: "#b42318",
              padding:
                "12px 14px",
              borderRadius: "10px",
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
              background:
                "#f0fff4",
              border:
                "1px solid #b7ebc6",
              color: "#16733d",
              padding:
                "12px 14px",
              borderRadius: "10px",
              marginBottom: "18px",
              overflowWrap:
                "anywhere",
            }}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={
            handleSubmit
          }
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
              gap: "18px",
            }}
          >
            <div
              style={{
                minWidth: 0,
              }}
            >
              <label
                style={
                  labelStyle
                }
              >
                Coupon Code
              </label>

              <input
                type="text"
                name="code"
                value={form.code}
                onChange={
                  handleChange
                }
                placeholder="VELNORA10"
                required
                style={inputStyle}
              />
            </div>

            <div
              style={{
                minWidth: 0,
              }}
            >
              <label
                style={
                  labelStyle
                }
              >
                Discount Type
              </label>

              <select
                name="discountType"
                value={
                  form.discountType
                }
                onChange={
                  handleChange
                }
                style={inputStyle}
              >
                <option value="percentage">
                  Percentage
                </option>

                <option value="fixed">
                  Fixed Amount
                </option>
              </select>
            </div>

            <div
              style={{
                minWidth: 0,
              }}
            >
              <label
                style={
                  labelStyle
                }
              >
                Discount Value
              </label>

              <input
                type="number"
                name="discountValue"
                value={
                  form.discountValue
                }
                onChange={
                  handleChange
                }
                min="0"
                step="0.01"
                placeholder={
                  form.discountType ===
                  "percentage"
                    ? "10"
                    : "200"
                }
                required
                style={inputStyle}
              />
            </div>

            <div
              style={{
                minWidth: 0,
              }}
            >
              <label
                style={
                  labelStyle
                }
              >
                Minimum Order ₹
              </label>

              <input
                type="number"
                name="minimumOrderAmount"
                value={
                  form.minimumOrderAmount
                }
                onChange={
                  handleChange
                }
                min="0"
                placeholder="999"
                style={inputStyle}
              />
            </div>

            <div
              style={{
                minWidth: 0,
              }}
            >
              <label
                style={
                  labelStyle
                }
              >
                Maximum Discount ₹
              </label>

              <input
                type="number"
                name="maximumDiscountAmount"
                value={
                  form.maximumDiscountAmount
                }
                onChange={
                  handleChange
                }
                min="0"
                placeholder="500"
                style={inputStyle}
              />
            </div>

            <div
              style={{
                minWidth: 0,
              }}
            >
              <label
                style={
                  labelStyle
                }
              >
                Usage Limit
              </label>

              <input
                type="number"
                name="usageLimit"
                value={
                  form.usageLimit
                }
                onChange={
                  handleChange
                }
                min="1"
                placeholder="100"
                style={inputStyle}
              />
            </div>

            <div
              style={{
                minWidth: 0,
              }}
            >
              <label
                style={
                  labelStyle
                }
              >
                Expiry Date
              </label>

              <input
                type="date"
                name="expiresAt"
                value={
                  form.expiresAt
                }
                onChange={
                  handleChange
                }
                style={inputStyle}
              />
            </div>
          </div>

          <label
            style={{
              display: "flex",
              alignItems:
                "center",
              gap: "9px",
              marginTop: "20px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            <input
              type="checkbox"
              name="isActive"
              checked={
                form.isActive
              }
              onChange={
                handleChange
              }
            />

            Coupon Active
          </label>

          <button
            type="submit"
            disabled={saving}
            style={{
              marginTop: "22px",
              border: 0,
              borderRadius: "10px",
              padding:
                "12px 18px",
              background: "#111",
              color: "#fff",
              fontWeight: 700,

              cursor: saving
                ? "not-allowed"
                : "pointer",

              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              gap: "8px",
              opacity:
                saving
                  ? 0.7
                  : 1,
              minHeight: "44px",
              maxWidth: "100%",
            }}
          >
            <Plus size={17} />

            {saving
              ? "Saving..."
              : editingId
              ? "Update Coupon"
              : "Create Coupon"}
          </button>
        </form>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "flex-start",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            flex: "1 1 200px",
            minWidth: 0,
          }}
        >
          <h2
            style={{
              margin:
                "0 0 4px",
              fontSize:
                "clamp(20px, 5vw, 24px)",
            }}
          >
            Existing Coupons
          </h2>

          <p
            style={{
              margin: 0,
              color: "#777",
              lineHeight: "1.5",
            }}
          >
            Manage all VELNORA
            discount codes.
          </p>
        </div>

        <button
          type="button"
          onClick={
            loadCoupons
          }
          style={{
            border:
              "1px solid #ddd",
            background: "#fff",
            padding:
              "10px 14px",
            borderRadius: "9px",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            gap: "7px",
            cursor: "pointer",
            minHeight: "42px",
          }}
        >
          <RefreshCw
            size={16}
          />
          Refresh
        </button>
      </div>

      {loading ? (
        <div
          style={{
            padding:
              "50px 20px",
            textAlign: "center",
            color: "#777",
          }}
        >
          Loading coupons...
        </div>
      ) : coupons.length ===
        0 ? (
        <div
          style={{
            border:
              "1px dashed #ccc",
            borderRadius: "14px",
            padding:
              "clamp(35px, 8vw, 50px) 15px",
            textAlign: "center",
          }}
        >
          <TicketPercent
            size={34}
            style={{
              marginBottom:
                "12px",
            }}
          />

          <h3
            style={{
              margin:
                "0 0 8px",
            }}
          >
            No coupons yet
          </h3>

          <p
            style={{
              margin: 0,
              color: "#777",
            }}
          >
            Create your first
            VELNORA discount code
            above.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          {coupons.map(
            (coupon) => (
              <div
                key={
                  coupon._id
                }
                style={{
                  border:
                    "1px solid #e5e5e5",
                  borderRadius:
                    "14px",
                  padding:
                    "clamp(15px, 4vw, 20px)",
                  background:
                    "#fff",
                  width: "100%",
                  boxSizing:
                    "border-box",
                  overflow:
                    "hidden",
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
                    gap: "18px",
                    flexWrap:
                      "wrap",
                  }}
                >
                  <div
                    style={{
                      flex:
                        "1 1 240px",
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "10px",
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize:
                            "clamp(18px, 5vw, 21px)",
                          overflowWrap:
                            "anywhere",
                          wordBreak:
                            "break-word",
                        }}
                      >
                        {
                          coupon.code
                        }
                      </h3>

                      <span
                        style={{
                          padding:
                            "4px 9px",
                          borderRadius:
                            "999px",
                          fontSize:
                            "12px",
                          fontWeight:
                            700,

                          background:
                            coupon.isActive
                              ? "#eaf8ef"
                              : "#f1f1f1",

                          color:
                            coupon.isActive
                              ? "#17753b"
                              : "#666",

                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {coupon.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <p
                      style={{
                        margin:
                          "10px 0 12px",
                        fontWeight:
                          700,
                        fontSize:
                          "18px",
                      }}
                    >
                      {formatDiscount(
                        coupon
                      )}
                    </p>

                    <div
                      style={{
                        display:
                          "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(min(145px, 100%), 1fr))",
                        gap:
                          "9px 16px",
                        color:
                          "#666",
                        fontSize:
                          "13px",
                        lineHeight:
                          "1.45",
                      }}
                    >
                      <span>
                        Minimum: ₹
                        {coupon.minimumOrderAmount ||
                          0}
                      </span>

                      <span>
                        Max discount:{" "}
                        {coupon.maximumDiscountAmount ===
                        null
                          ? "No limit"
                          : `₹${coupon.maximumDiscountAmount}`}
                      </span>

                      <span>
                        Used:{" "}
                        {coupon.usedCount ||
                          0}
                        {coupon.usageLimit
                          ? ` / ${coupon.usageLimit}`
                          : ""}
                      </span>

                      <span>
                        Expiry:{" "}
                        {formatDate(
                          coupon.expiresAt
                        )}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(90px, 1fr))",
                      gap: "8px",
                      width:
                        "min(100%, 330px)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        toggleCoupon(
                          coupon
                        )
                      }
                      style={{
                        ...actionButton,

                        background:
                          coupon.isActive
                            ? "#f5f5f5"
                            : "#111",

                        color:
                          coupon.isActive
                            ? "#111"
                            : "#fff",
                      }}
                    >
                      {coupon.isActive
                        ? "Disable"
                        : "Enable"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(
                          coupon
                        )
                      }
                      style={
                        actionButton
                      }
                    >
                      <Pencil
                        size={15}
                      />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          coupon
                        )
                      }
                      style={{
                        ...actionButton,
                        color:
                          "#b42318",
                        borderColor:
                          "#ffc8c8",
                      }}
                    >
                      <Trash2
                        size={15}
                      />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontWeight: 600,
  marginBottom: "7px",
};

const inputStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  border:
    "1px solid #dcdcdc",
  borderRadius: "9px",
  padding: "11px 12px",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
};

const actionButton = {
  border: "1px solid #ddd",
  background: "#fff",
  padding: "9px 10px",
  minHeight: "41px",
  borderRadius: "9px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  fontWeight: 600,
  whiteSpace: "nowrap",
};

export default AdminCoupons;