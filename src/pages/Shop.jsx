import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingBag,
  SlidersHorizontal,
} from "lucide-react";

const products = [
  {
    id: 1,
    name: "Oversized Premium T-Shirt",
    price: 899,
    category: "Men",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 2,
    name: "Classic Denim Jacket",
    price: 1999,
    category: "Men",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 3,
    name: "Premium Hoodie",
    price: 1499,
    category: "Men",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 4,
    name: "Casual Cotton Shirt",
    price: 1199,
    category: "Men",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 5,
    name: "Women's Summer Dress",
    price: 1599,
    category: "Women",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 6,
    name: "Women's Casual Outfit",
    price: 1299,
    category: "Women",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 7,
    name: "Classic Sneakers",
    price: 1799,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 8,
    name: "Premium Sunglasses",
    price: 999,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=85",
  },
];

function Shop({ addToCart }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [wishlist, setWishlist] = useState([]);

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