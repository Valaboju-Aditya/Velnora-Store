import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingBag,
  SlidersHorizontal,
} from "lucide-react";



function Shop({ addToCart }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      setProducts(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);

if (loading) {
  return <div className="loading">Loading products...</div>;
}

if (error) {
  return <div className="error-message">{error}</div>;
}

  function toggleWishlist(id) {
    setWishlist((current) => {
      if (current.includes(id)) {
        return current.filter(
          (item) => item !== id
        );
      }

      return [...current, id];
    });
  }

  let filteredProducts = products.filter(
    (product) => {
      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );

  if (sort === "low") {
    filteredProducts.sort(
      (a, b) => a.price - b.price
    );
  }

  if (sort === "high") {
    filteredProducts.sort(
      (a, b) => b.price - a.price
    );
  }

  return (
    <div className="shop-page">

      {/* SHOP HEADER */}

      <section className="shop-header">

        <p>OUR COLLECTION</p>

        <h1>
          Shop All
        </h1>

        <span>
          Discover our latest collection
          of premium fashion.
        </span>

      </section>

      {/* CONTROLS */}

      <section className="shop-controls">

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>

        <div className="category-buttons">

          {[
            "All",
            "Men",
            "Women",
            "Accessories",
          ].map((item) => (

            <button
              key={item}
              className={
                category === item
                  ? "active"
                  : ""
              }
              onClick={() =>
                setCategory(item)
              }
            >
              {item}
            </button>

          ))}

        </div>

        <div className="sort-box">

          <SlidersHorizontal
            size={17}
          />

          <select
            value={sort}
            onChange={(event) =>
              setSort(
                event.target.value
              )
            }
          >
            <option value="default">
              Sort By
            </option>

            <option value="low">
              Price: Low to High
            </option>

            <option value="high">
              Price: High to Low
            </option>
          </select>

        </div>

      </section>

      {/* PRODUCT COUNT */}

      <div className="shop-count">
        {filteredProducts.length} products
      </div>

      {/* PRODUCTS */}

      {filteredProducts.length > 0 ? (

        <div className="shop-grid">

          {filteredProducts.map(
            (product) => {

              const liked =
                wishlist.includes(
                  product.id
                );

              return (

                <div
                  className="shop-product"
                  key={product.id}
                >

                  <div className="shop-product-image">

                    <Link to={`/product/${product.id}`}>
  <img
    src={product.image}
    alt={product.name}
  />
</Link>

                    <button
                      className="shop-wishlist"
                      onClick={() =>
                        toggleWishlist(
                          product.id
                        )
                      }
                    >

                      <Heart
                        size={19}
                        fill={
                          liked
                            ? "currentColor"
                            : "none"
                        }
                      />

                    </button>

                    <button
                      className="add-cart"
                      onClick={() =>
                        addToCart(product)
                      }
                    >

                      <ShoppingBag
                        size={17}
                      />

                      Add to Cart

                    </button>

                  </div>

                  <div className="shop-product-info">

                    <Link to={`/product/${product.id}`}>
  <h3>{product.name}</h3>
</Link>

                    <p>
                      ₹
                      {product.price.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </div>

                </div>

              );
            }
          )}

        </div>

      ) : (

        <div className="no-products">

          <h2>
            No products found
          </h2>

          <p>
            Try another search or category.
          </p>

        </div>

      )}

    </div>
  );
}

export default Shop;