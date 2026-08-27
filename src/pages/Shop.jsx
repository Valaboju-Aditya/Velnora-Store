import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  Search,
  Heart,
  ShoppingBag,
  SlidersHorizontal,
} from "lucide-react";

function Shop({
  addToCart,
  wishlist,
  toggleWishlist,
}) {
  const [searchParams] =
    useSearchParams();

  const [search, setSearch] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState(null);

  const [sort, setSort] =
    useState("default");

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const urlCategory =
    searchParams.get("category");

  const category =
    selectedCategory ||
    urlCategory ||
    "All";

  const saleOnly =
    searchParams.get("sale") ===
    "true";

  const newOnly =
    searchParams.get("new") ===
    "true";

  useEffect(() => {
    let ignore = false;

    const loadProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/products"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch products"
          );
        }

        const data =
          await response.json();

        if (!ignore) {
          setProducts(data);
        }
      } catch (error) {
        if (!ignore) {
          console.error(
            "Failed to load products:",
            error
          );

          setError(
            "Unable to load products"
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      ignore = true;
    };
  }, []);

  const categories = useMemo(
    () => [
      "All",
      ...new Set(
        products
          .map(
            (product) =>
              product.category
          )
          .filter(Boolean)
      ),
    ],
    [products]
  );

  let filteredProducts =
    products.filter((product) => {
      const productName =
        product.name || "";

      const productCategory =
        product.category || "";

      const matchesSearch =
        productName
          .toLowerCase()
          .includes(
            search
              .toLowerCase()
              .trim()
          );

      const matchesCategory =
        category === "All" ||
        productCategory === category;

      const matchesSale =
        !saleOnly ||
        product.sale === true;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSale
      );
    });

  if (newOnly) {
    filteredProducts = [
      ...filteredProducts,
    ].sort((a, b) => {
      const dateA =
        new Date(
          a.createdAt || 0
        ).getTime();

      const dateB =
        new Date(
          b.createdAt || 0
        ).getTime();

      return dateB - dateA;
    });
  } else {
    filteredProducts = [
      ...filteredProducts,
    ];
  }

  if (sort === "low") {
    filteredProducts.sort(
      (a, b) =>
        Number(a.price) -
        Number(b.price)
    );
  }

  if (sort === "high") {
    filteredProducts.sort(
      (a, b) =>
        Number(b.price) -
        Number(a.price)
    );
  }

  const pageTitle = saleOnly
    ? "Sale"
    : newOnly
    ? "New Arrivals"
    : category !== "All"
    ? category
    : "Shop All";

  if (loading) {
    return (
      <div className="shop-page">
        <div className="no-products">
          <h2>
            Loading products...
          </h2>

          <p>
            Please wait while NOVA
            loads the collection.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shop-page">
        <div className="no-products">
          <h2>
            Unable to load products
          </h2>

          <p>
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-page">

      {/* SHOP HEADER */}

      <section className="shop-header">

        <p>
          OUR COLLECTION
        </p>

        <h1>
          {pageTitle}
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

          {categories.map((item) => (

            <button
              type="button"
              key={item}
              className={
                category === item
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSelectedCategory(
                  item
                )
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

        {filteredProducts.length}{" "}
        {filteredProducts.length === 1
          ? "product"
          : "products"}

      </div>


      {/* PRODUCTS */}

      {filteredProducts.length > 0 ? (

        <div className="shop-grid">

          {filteredProducts.map(
            (product) => {

              const productId =
                product._id ||
                product.id;

              const liked =
                wishlist.some(
                  (item) =>
                    (
                      item._id ||
                      item.id
                    ) === productId
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

              return (

                <div
                  className="shop-product"
                  key={productId}
                >

                  <div className="shop-product-image">

                    <Link
                      to={`/product/${productId}`}
                    >
                      <img
                        src={
                          product.image
                        }
                        alt={
                          product.name
                        }
                      />
                    </Link>


                    {/* STOCK BADGE */}

                    {outOfStock && (
                      <span className="shop-stock-badge out">
                        Out of Stock
                      </span>
                    )}

                    {lowStock && (
                      <span className="shop-stock-badge low">
                        Only {stock} left
                      </span>
                    )}


                    {/* WISHLIST */}

                    <button
                      type="button"
                      className="shop-wishlist"
                      onClick={() =>
                        toggleWishlist(
                          product
                        )
                      }
                      aria-label="Toggle wishlist"
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


                    {/* ADD TO CART */}

                    <button
                      type="button"
                      className="add-cart"
                      disabled={outOfStock}
                      onClick={() => {
                        if (
                          !outOfStock
                        ) {
                          addToCart(
                            product
                          );
                        }
                      }}
                    >

                      <ShoppingBag
                        size={17}
                      />

                      {outOfStock
                        ? "Out of Stock"
                        : "Add to Cart"}

                    </button>

                  </div>


                  {/* PRODUCT INFO */}

                  <div className="shop-product-info">

                    <Link
                      to={`/product/${productId}`}
                    >
                      <h3>
                        {product.name}
                      </h3>
                    </Link>

                    <p>
                      ₹
                      {Number(
                        product.price || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    {lowStock && (
                      <span className="shop-low-stock-text">
                        Hurry, only {stock} remaining
                      </span>
                    )}

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
            Try another search
            or category.
          </p>

        </div>

      )}

    </div>
  );
}

export default Shop;