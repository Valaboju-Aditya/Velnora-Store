import { API_URL } from "../config";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  Search,
  Heart,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from "lucide-react";

function Shop({
  addToCart,
  wishlist,
  toggleWishlist,
}) {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const [search, setSearch] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState(null);

  const [sort, setSort] =
    useState("default");

  const [
    priceRange,
    setPriceRange,
  ] = useState("all");

  const [
    inStockOnly,
    setInStockOnly,
  ] = useState(false);

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
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/products`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch products"
          );
        }

        const data =
          await response.json();

        if (!ignore) {
          setProducts(
            Array.isArray(data)
              ? data
              : []
          );
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

      const productDescription =
        product.description || "";

      const productSearchText = [
        productName,
        productCategory,
        productDescription,
      ]
        .join(" ")
        .toLowerCase();

      const searchText =
        search
          .trim()
          .toLowerCase();

      const matchesSearch =
        !searchText ||
        productSearchText.includes(
          searchText
        );

      const matchesCategory =
        category === "All" ||
        productCategory === category;

      const matchesSale =
        !saleOnly ||
        product.sale === true;

      const price = Number(
        product.price || 0
      );

      const matchesPrice =
        priceRange === "all" ||
        (priceRange ===
          "under1000" &&
          price < 1000) ||
        (priceRange ===
          "1000to2000" &&
          price >= 1000 &&
          price <= 2000) ||
        (priceRange ===
          "above2000" &&
          price > 2000);

      const stock = Number(
        product.stock ?? 0
      );

      const matchesStock =
        !inStockOnly ||
        stock > 0;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSale &&
        matchesPrice &&
        matchesStock
      );
    });

  filteredProducts = [
    ...filteredProducts,
  ];

  if (
    newOnly &&
    sort === "default"
  ) {
    filteredProducts.sort(
      (a, b) => {
        const dateA = new Date(
          a.createdAt || 0
        ).getTime();

        const dateB = new Date(
          b.createdAt || 0
        ).getTime();

        return dateB - dateA;
      }
    );
  }

  if (sort === "low") {
    filteredProducts.sort(
      (a, b) =>
        Number(a.price || 0) -
        Number(b.price || 0)
    );
  }

  if (sort === "high") {
    filteredProducts.sort(
      (a, b) =>
        Number(b.price || 0) -
        Number(a.price || 0)
    );
  }

  if (sort === "newest") {
    filteredProducts.sort(
      (a, b) => {
        const dateA = new Date(
          a.createdAt || 0
        ).getTime();

        const dateB = new Date(
          b.createdAt || 0
        ).getTime();

        return dateB - dateA;
      }
    );
  }

  if (sort === "name-az") {
    filteredProducts.sort(
      (a, b) =>
        String(a.name || "")
          .localeCompare(
            String(b.name || "")
          )
    );
  }

  if (sort === "name-za") {
    filteredProducts.sort(
      (a, b) =>
        String(b.name || "")
          .localeCompare(
            String(a.name || "")
          )
    );
  }

  const pageTitle =
    saleOnly
      ? "Sale"
      : newOnly
      ? "New Arrivals"
      : category !== "All"
      ? category
      : "Shop All";

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedCategory !== null ||
    Boolean(urlCategory) ||
    saleOnly ||
    newOnly ||
    sort !== "default" ||
    priceRange !== "all" ||
    inStockOnly;

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory(null);
    setSort("default");
    setPriceRange("all");
    setInStockOnly(false);
    setSearchParams({});
  };

  useEffect(() => {
    let seoTitle =
      "Shop Fashion Online | VELNORA";

    let seoDescription =
      "Shop VELNORA's latest collection of men's fashion, women's fashion and accessories. Discover premium everyday styles online.";

    if (saleOnly) {
      seoTitle =
        "Fashion Sale | VELNORA";

      seoDescription =
        "Shop VELNORA fashion sale and discover selected men's, women's and accessory styles at special prices.";
    } else if (newOnly) {
      seoTitle =
        "New Arrivals | VELNORA";

      seoDescription =
        "Discover the latest VELNORA new arrivals including men's fashion, women's fashion and modern accessories.";
    } else if (
      category !== "All"
    ) {
      seoTitle =
        `${category} Fashion | VELNORA`;

      seoDescription =
        `Shop VELNORA ${category.toLowerCase()} collection. Discover premium fashion, modern styles and everyday essentials online.`;
    }

    const canonicalUrl =
      `${window.location.origin}/shop`;

    const originalTitle =
      document.title;

    document.title =
      seoTitle;

    const descriptionTag =
      document.querySelector(
        'meta[name="description"]'
      );

    const originalDescription =
      descriptionTag?.getAttribute(
        "content"
      );

    if (descriptionTag) {
      descriptionTag.setAttribute(
        "content",
        seoDescription
      );
    }

    const canonicalTag =
      document.querySelector(
        'link[rel="canonical"]'
      );

    const originalCanonical =
      canonicalTag?.getAttribute(
        "href"
      );

    if (canonicalTag) {
      canonicalTag.setAttribute(
        "href",
        canonicalUrl
      );
    }

    const ogTags = {
      "og:title": seoTitle,
      "og:description":
        seoDescription,
      "og:url": canonicalUrl,
      "og:type": "website",
    };

    const originalOgValues = {};

    Object.entries(
      ogTags
    ).forEach(
      ([property, content]) => {
        let tag =
          document.querySelector(
            `meta[property="${property}"]`
          );

        if (tag) {
          originalOgValues[
            property
          ] =
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
            "data-velnora-shop-og",
            "true"
          );

          document.head.appendChild(
            tag
          );
        }
      }
    );

    return () => {
      document.title =
        originalTitle;

      if (
        descriptionTag &&
        originalDescription
      ) {
        descriptionTag.setAttribute(
          "content",
          originalDescription
        );
      }

      if (
        canonicalTag &&
        originalCanonical
      ) {
        canonicalTag.setAttribute(
          "href",
          originalCanonical
        );
      }

      Object.keys(
        ogTags
      ).forEach((property) => {
        const tag =
          document.querySelector(
            `meta[property="${property}"]`
          );

        if (!tag) {
          return;
        }

        if (
          tag.getAttribute(
            "data-velnora-shop-og"
          ) === "true"
        ) {
          tag.remove();
        } else if (
          originalOgValues[
            property
          ]
        ) {
          tag.setAttribute(
            "content",
            originalOgValues[
              property
            ]
          );
        }
      });
    };
  }, [
    category,
    saleOnly,
    newOnly,
  ]);

  if (loading) {
    return (
      <div className="shop-page">
        <div className="no-products">
          <h2>
            Loading products...
          </h2>

          <p>
            Please wait while VELNORA
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

          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-page">
      <section className="shop-header">
        <p>OUR COLLECTION</p>

        <h1>{pageTitle}</h1>

        <span>
          Discover our latest
          collection of premium
          fashion.
        </span>
      </section>

      <section className="shop-controls">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search products, styles and more..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() =>
                setSearch("")
              }
              style={{
                border: "none",
                background:
                  "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: 0,
              }}
            >
              <X size={17} />
            </button>
          )}
        </div>

        <div className="category-buttons">
          {categories.map(
            (item) => (
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
            )
          )}
        </div>

        <div className="sort-box">
          <select
            value={priceRange}
            onChange={(event) =>
              setPriceRange(
                event.target.value
              )
            }
            aria-label="Filter by price"
          >
            <option value="all">
              All Prices
            </option>

            <option value="under1000">
              Under ₹1,000
            </option>

            <option value="1000to2000">
              ₹1,000 - ₹2,000
            </option>

            <option value="above2000">
              Above ₹2,000
            </option>
          </select>
        </div>

        <label className="stock-filter">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(event) =>
              setInStockOnly(
                event.target.checked
              )
            }
          />

          <span>
            In Stock Only
          </span>
        </label>

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
            aria-label="Sort products"
          >
            <option value="default">
              Sort By
            </option>

            <option value="newest">
              Newest First
            </option>

            <option value="low">
              Price: Low to High
            </option>

            <option value="high">
              Price: High to Low
            </option>

            <option value="name-az">
              Name: A to Z
            </option>

            <option value="name-za">
              Name: Z to A
            </option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="clear-filters-btn"
            onClick={
              clearFilters
            }
          >
            <X size={16} />
            Clear Filters
          </button>
        )}
      </section>

      <div className="shop-results-bar">
        <div className="shop-count">
          {filteredProducts.length}{" "}
          {filteredProducts.length ===
          1
            ? "product"
            : "products"}
        </div>

        {category !== "All" && (
          <span className="shop-current-category">
            {category}
          </span>
        )}
      </div>

      {filteredProducts.length >
      0 ? (
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
                    ) ===
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

              return (
                <article
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
                        loading="lazy"
                      />
                    </Link>

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

                    <button
                      type="button"
                      className="shop-wishlist"
                      onClick={() =>
                        toggleWishlist(
                          product
                        )
                      }
                      aria-label={
                        liked
                          ? "Remove from wishlist"
                          : "Add to wishlist"
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
                      type="button"
                      className="add-cart"
                      disabled={
                        outOfStock
                      }
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

                      <span>
                        {outOfStock
                          ? "Out of Stock"
                          : "Add to Cart"}
                      </span>
                    </button>
                  </div>

                  <div className="shop-product-info">
                    <Link
                      to={`/product/${productId}`}
                    >
                      <h3>
                        {
                          product.name
                        }
                      </h3>
                    </Link>

                    <p className="shop-product-price">
                      ₹
                      {Number(
                        product.price ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    {lowStock && (
                      <span className="shop-low-stock-text">
                        Hurry, only{" "}
                        {stock}{" "}
                        remaining
                      </span>
                    )}
                  </div>
                </article>
              );
            }
          )}
        </div>
      ) : (
        <div className="no-products">
          <Search size={32} />

          <h2>
            No products found
          </h2>

          <p>
            Try changing your
            search, category, price
            or stock filters.
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              className="clear-filters-btn"
              onClick={
                clearFilters
              }
            >
              <X size={16} />
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Shop;