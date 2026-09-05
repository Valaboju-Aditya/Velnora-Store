import { useEffect, useMemo, useState } from "react";
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
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minimumOrderAmount: "",
    maximumDiscountAmount: "",
    usageLimit: "",
    expiresAt: "",
    isActive: true,
  });

  const token = localStorage.getItem("novaToken");

  const loadCoupons = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/coupons`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const contentType =
        response.headers.get("content-type");

      let data = null;

      if (
        contentType &&
        contentType.includes("application/json")
      ) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load coupons"
        );
      }

      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.message || "Failed to load coupons"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    fetch(`${API_URL}/api/coupons`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const contentType =
          response.headers.get("content-type");

        let data = null;

        if (
          contentType &&
          contentType.includes("application/json")
        ) {
          data = await response.json();
        }

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load coupons"
          );
        }

        return data;
      })
      .then((data) => {
        if (!ignore) {
          setCoupons(
            Array.isArray(data) ? data : []
          );
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(
            err.message || "Failed to load coupons"
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
      discountType: "percentage",
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
        type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
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
        Number(form.discountValue) <= 0
      ) {
        throw new Error(
          "Enter a valid discount value"
        );
      }

      const payload = {
        code: form.code.trim().toUpperCase(),
        discountType: form.discountType,
        discountValue:
          Number(form.discountValue),

        minimumOrderAmount:
          form.minimumOrderAmount === ""
            ? 0
            : Number(
                form.minimumOrderAmount
              ),

        maximumDiscountAmount:
          form.maximumDiscountAmount === ""
            ? null
            : Number(
                form.maximumDiscountAmount
              ),

        usageLimit:
          form.usageLimit === ""
            ? null
            : Number(form.usageLimit),

        expiresAt:
          form.expiresAt || null,

        isActive: form.isActive,
      };

      const url = editingId
        ? `${API_URL}/api/coupons/${editingId}`
        : `${API_URL}/api/coupons`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(payload),
      });

      const contentType =
        response.headers.get("content-type");

      let data = null;

      if (
        contentType &&
        contentType.includes("application/json")
      ) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to save coupon"
        );
      }

      setEditingId(null);

      setForm({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minimumOrderAmount: "",
        maximumDiscountAmount: "",
        usageLimit: "",
        expiresAt: "",
        isActive: true,
      });

      setError("");

      setMessage(
        editingId
          ? "Coupon updated successfully"
          : "Coupon created successfully"
      );

      await loadCoupons();
    } catch (err) {
      setError(
        err.message || "Failed to save coupon"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon._id);

    setForm({
      code: coupon.code || "",

      discountType:
        coupon.discountType || "percentage",

      discountValue:
        coupon.discountValue ?? "",

      minimumOrderAmount:
        coupon.minimumOrderAmount ?? "",

      maximumDiscountAmount:
        coupon.maximumDiscountAmount ?? "",

      usageLimit:
        coupon.usageLimit ?? "",

      expiresAt:
        coupon.expiresAt
          ? new Date(coupon.expiresAt)
              .toISOString()
              .split("T")[0]
          : "",

      isActive:
        coupon.isActive !== false,
    });

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (coupon) => {
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

      const response = await fetch(
        `${API_URL}/api/coupons/${coupon._id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const contentType =
        response.headers.get("content-type");

      let data = null;

      if (
        contentType &&
        contentType.includes("application/json")
      ) {
        data = await response.json();
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
            item._id !== coupon._id
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

  const toggleCoupon = async (coupon) => {
    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/coupons/${coupon._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            isActive: !coupon.isActive,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type");

      let data = null;

      if (
        contentType &&
        contentType.includes("application/json")
      ) {
        data = await response.json();
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

  const activeCoupons = useMemo(
    () =>
      coupons.filter(
        (coupon) => coupon.isActive
      ).length,
    [coupons]
  );

  const formatDate = (date) => {
    if (!date) {
      return "No expiry";
    }

    return new Date(
      date
    ).toLocaleDateString("en-IN");
  };

  const formatDiscount = (coupon) => {
    if (
      coupon.discountType === "percentage"
    ) {
      return `${coupon.discountValue}% OFF`;
    }

    return `₹${coupon.discountValue} OFF`;
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px 70px",
      }}
    >
      <div
        style={{
          marginBottom: "32px",
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
            margin: "8px 0 10px",
            fontSize: "34px",
          }}
        >
          Coupons & Discounts
        </h1>

        <p
          style={{
            margin: 0,
            color: "#666",
          }}
        >
          Create and manage discount codes
          for your customers.
        </p>
      </div>

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",

          gap: "16px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: "14px",
            padding: "20px",
            background: "#fff",
          }}
        >
          <p
            style={{
              margin: "0 0 6px",
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
            border: "1px solid #e5e5e5",
            borderRadius: "14px",
            padding: "20px",
            background: "#fff",
          }}
        >
          <p
            style={{
              margin: "0 0 6px",
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
          border: "1px solid #e5e5e5",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "34px",
          background: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "15px",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: "22px",
          }}
        >
          <div>
            <h2
              style={{
                margin: "0 0 5px",
                fontSize: "22px",
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
              }}
            >
              Configure discount rules
              and availability.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              style={{
                border: "1px solid #ddd",
                background: "#fff",
                borderRadius: "9px",
                padding: "9px 13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
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
              background: "#fff2f2",
              border:
                "1px solid #ffc8c8",
              color: "#b42318",
              padding: "12px 14px",
              borderRadius: "10px",
              marginBottom: "18px",
            }}
          >
            {error}
          </div>
        )}

        {message && (
          <div
            style={{
              background: "#f0fff4",
              border:
                "1px solid #b7ebc6",
              color: "#16733d",
              padding: "12px 14px",
              borderRadius: "10px",
              marginBottom: "18px",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",

              gap: "18px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  marginBottom: "7px",
                }}
              >
                Coupon Code
              </label>

              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="VELNORA10"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  marginBottom: "7px",
                }}
              >
                Discount Type
              </label>

              <select
                name="discountType"
                value={form.discountType}
                onChange={handleChange}
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

            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  marginBottom: "7px",
                }}
              >
                Discount Value
              </label>

              <input
                type="number"
                name="discountValue"
                value={form.discountValue}
                onChange={handleChange}
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

            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  marginBottom: "7px",
                }}
              >
                Minimum Order ₹
              </label>

              <input
                type="number"
                name="minimumOrderAmount"
                value={
                  form.minimumOrderAmount
                }
                onChange={handleChange}
                min="0"
                placeholder="999"
                style={inputStyle}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  marginBottom: "7px",
                }}
              >
                Maximum Discount ₹
              </label>

              <input
                type="number"
                name="maximumDiscountAmount"
                value={
                  form.maximumDiscountAmount
                }
                onChange={handleChange}
                min="0"
                placeholder="500"
                style={inputStyle}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  marginBottom: "7px",
                }}
              >
                Usage Limit
              </label>

              <input
                type="number"
                name="usageLimit"
                value={form.usageLimit}
                onChange={handleChange}
                min="1"
                placeholder="100"
                style={inputStyle}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  marginBottom: "7px",
                }}
              >
                Expiry Date
              </label>

              <input
                type="date"
                name="expiresAt"
                value={form.expiresAt}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              marginTop: "20px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
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
              padding: "12px 18px",
              background: "#111",
              color: "#fff",
              fontWeight: 700,

              cursor: saving
                ? "not-allowed"
                : "pointer",

              display: "flex",
              alignItems: "center",
              gap: "8px",
              opacity: saving ? 0.7 : 1,
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
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "18px",
        }}
      >
        <div>
          <h2
            style={{
              margin: "0 0 4px",
            }}
          >
            Existing Coupons
          </h2>

          <p
            style={{
              margin: 0,
              color: "#777",
            }}
          >
            Manage all VELNORA discount codes.
          </p>
        </div>

        <button
          type="button"
          onClick={loadCoupons}
          style={{
            border: "1px solid #ddd",
            background: "#fff",
            padding: "10px 14px",
            borderRadius: "9px",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            cursor: "pointer",
          }}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div
          style={{
            padding: "50px 20px",
            textAlign: "center",
            color: "#777",
          }}
        >
          Loading coupons...
        </div>
      ) : coupons.length === 0 ? (
        <div
          style={{
            border: "1px dashed #ccc",
            borderRadius: "14px",
            padding: "50px 20px",
            textAlign: "center",
          }}
        >
          <TicketPercent
            size={34}
            style={{
              marginBottom: "12px",
            }}
          />

          <h3
            style={{
              margin: "0 0 8px",
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
            Create your first VELNORA
            discount code above.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              style={{
                border:
                  "1px solid #e5e5e5",
                borderRadius: "14px",
                padding: "20px",
                background: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: "20px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    flex: "1 1 300px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "21px",
                      }}
                    >
                      {coupon.code}
                    </h3>

                    <span
                      style={{
                        padding: "4px 9px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 700,

                        background:
                          coupon.isActive
                            ? "#eaf8ef"
                            : "#f1f1f1",

                        color:
                          coupon.isActive
                            ? "#17753b"
                            : "#666",
                      }}
                    >
                      {coupon.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: "10px 0 12px",
                      fontWeight: 700,
                      fontSize: "18px",
                    }}
                  >
                    {formatDiscount(coupon)}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "14px 22px",
                      color: "#666",
                      fontSize: "14px",
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
                      {coupon.usedCount || 0}
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
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      toggleCoupon(coupon)
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
                      handleEdit(coupon)
                    }
                    style={actionButton}
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(coupon)
                    }
                    style={{
                      ...actionButton,
                      color: "#b42318",
                      borderColor:
                        "#ffc8c8",
                    }}
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  border: "1px solid #dcdcdc",
  borderRadius: "9px",
  padding: "11px 12px",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
};

const actionButton = {
  border: "1px solid #ddd",
  background: "#fff",
  padding: "9px 12px",
  borderRadius: "9px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontWeight: 600,
};

export default AdminCoupons;