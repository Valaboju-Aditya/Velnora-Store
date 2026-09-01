import { useEffect, useState } from "react";
import { API_URL } from "../config";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
    featured: false,
    sale: false,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      stock: "",
      featured: false,
      sale: false,
    });

    setEditingProduct(null);
    setShowForm(false);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/products`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadProducts = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/products`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        if (!ignore) {
          setProducts(data);
        }
      } catch (error) {
        if (!ignore) {
          console.error(
            "Failed to fetch products:",
            error
          );
        }
      }
    };

    loadProducts();

    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("novaToken");

      if (!token) {
        alert(
          "Your admin session has expired. Please login again."
        );
        return;
      }

      const url = editingProduct
        ? `${API_URL}/api/products/${editingProduct._id}`
        : `${API_URL}/api/products`;

      const method = editingProduct
        ? "PUT"
        : "POST";

      const response = await fetch(
        url,
        {
          method,

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            ...formData,

            price: Number(
              formData.price
            ),

            stock: Number(
              formData.stock
            ),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (
              editingProduct
                ? "Failed to update product"
                : "Failed to create product"
            )
        );
      }

      await fetchProducts();

      alert(
        editingProduct
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      resetForm();
    } catch (error) {
      console.error(
        "Product save error:",
        error
      );

      alert(
        error.message ||
          (
            editingProduct
              ? "Failed to update product"
              : "Failed to add product"
          )
      );
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);

    setFormData({
      name:
        product.name || "",

      description:
        product.description || "",

      price:
        product.price ?? "",

      category:
        product.category || "",

      image:
        product.image || "",

      stock:
        product.stock ?? "",

      featured:
        Boolean(product.featured),

      sale:
        Boolean(product.sale),
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete =
    async (productId) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this product?"
        );

      if (!confirmed) {
        return;
      }

      try {
        const token =
          localStorage.getItem(
            "novaToken"
          );

        if (!token) {
          alert(
            "Your admin session has expired. Please login again."
          );
          return;
        }

        const response =
          await fetch(
            `${API_URL}/api/products/${productId}`,
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
              "Failed to delete product"
          );
        }

        await fetchProducts();

        alert(
          "Product deleted successfully!"
        );
      } catch (error) {
        console.error(
          "Delete product error:",
          error
        );

        alert(
          error.message ||
            "Failed to delete product"
        );
      }
    };

  return (
    <div className="admin-products-page">

      <div className="admin-products-header">

        <div>
          <p>
            velnora ADMIN
          </p>

          <h1>
            Manage Products
          </h1>

          <span>
            Total Products:{" "}
            {products.length}
          </span>
        </div>

        <button
          className="admin-add-button"
          type="button"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm
            ? "Close Form"
            : "+ Add Product"}
        </button>

      </div>

      {showForm && (

        <form
          className="admin-product-form"
          onSubmit={handleSubmit}
        >

          <h2>
            {editingProduct
              ? "Edit Product"
              : "Add New Product"}
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Product name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Product description"
            value={
              formData.description
            }
            onChange={handleChange}
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={
              formData.category
            }
            onChange={handleChange}
            required
          />

          <input
            type="url"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
          />

          <label>
            <input
              type="checkbox"
              name="featured"
              checked={
                formData.featured
              }
              onChange={handleChange}
            />

            Featured Product
          </label>

          <label>
            <input
              type="checkbox"
              name="sale"
              checked={
                formData.sale
              }
              onChange={handleChange}
            />

            Sale Product
          </label>

          <div className="admin-form-actions">

            <button
              type="submit"
            >
              {editingProduct
                ? "Update Product"
                : "Add Product"}
            </button>

            {editingProduct && (

              <button
                type="button"
                onClick={resetForm}
              >
                Cancel Edit
              </button>

            )}

          </div>

        </form>

      )}

      <div className="admin-products-list">

        {products.length === 0 ? (

          <div className="admin-empty-products">

            <h2>
              No products found
            </h2>

            <p>
              Add your first product
              using the button above.
            </p>

          </div>

        ) : (

          products.map(
            (product) => (

              <div
                className="admin-product-card"
                key={product._id}
              >

                <img
                  src={
                    product.image
                  }
                  alt={
                    product.name
                  }
                />

                <div className="admin-product-info">

                  <h2>
                    {product.name}
                  </h2>

                  <p className="admin-product-price">
                    ₹
                    {Number(
                      product.price ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  <p>
                    Category:{" "}
                    {product.category}
                  </p>

                  <p>
                    Stock:{" "}
                    {product.stock}
                  </p>

                  {product.featured && (

                    <span className="admin-badge">
                      Featured
                    </span>

                  )}

                  {product.sale && (

                    <span className="admin-badge sale-badge">
                      Sale
                    </span>

                  )}

                  <div className="admin-product-actions">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(
                          product
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          product._id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            )
          )

        )}

      </div>

    </div>
  );
}

export default AdminProducts;