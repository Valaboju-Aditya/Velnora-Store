import { API_URL } from "../config";
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


  /* =========================================================
     LOAD PRODUCTS
  ========================================================= */

  useEffect(() => {
    let ignore = false;

    const loadProducts =
      async () => {
        try {
          const response =
            await fetch(
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


  /* =========================================================
     CATEGORIES
  ========================================================= */

  const categories =
    useMemo(
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


  /* =========================================================
     FILTER PRODUCTS
  ========================================================= */

  let filteredProducts =
    products.filter(
      (product) => {

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
          productCategory ===
            category;


        const matchesSale =
          !saleOnly ||
          product.sale === true;


        return (
          matchesSearch &&
          matchesCategory &&
          matchesSale
        );
      }
    );


  /* =========================================================
     NEW ARRIVALS
  ========================================================= */

  if (newOnly) {

    filteredProducts = [
      ...filteredProducts,
    ].sort(
      (a, b) => {

        const dateA =
          new Date(
            a.createdAt || 0
          ).getTime();

        const dateB =
          new Date(
            b.createdAt || 0
          ).getTime();

        return dateB - dateA;

      }
    );

  } else {

    filteredProducts = [
      ...filteredProducts,
    ];

  }


  /* =========================================================
     SORT
  ========================================================= */

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


  /* =========================================================
     PAGE TITLE
  ========================================================= */

  const pageTitle =
    saleOnly
      ? "Sale"
      : newOnly
      ? "New Arrivals"
      : category !== "All"
      ? category
      : "Shop All";


  /* =========================================================
     LOADING
  ========================================================= */

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


  /* =========================================================
     ERROR
  ========================================================= */

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


      {/* =====================================================
          SHOP HEADER
      ===================================================== */}

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


      {/* =====================================================
          MOBILE / DESKTOP SEARCH
      ===================================================== */}

      <section className="shop-controls">


        {/* SEARCH */}

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search products, styles and more..."
            value={search}
            onChange={
              (event) =>
                setSearch(
                  event.target.value
                )
            }
          />

        </div>


        {/* =================================================
            CATEGORY CHIPS
        ================================================= */}

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


        {/* =================================================
            SORT
        ================================================= */}

        <div className="sort-box">

          <SlidersHorizontal
            size={17}
          />

          <select
            value={sort}
            onChange={
              (event) =>
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


      {/* =====================================================
          PRODUCT RESULTS HEADER
      ===================================================== */}

      <div className="shop-results-bar">

        <div className="shop-count">

          {filteredProducts.length}{" "}

          {filteredProducts.length === 1
            ? "product"
            : "products"}

        </div>


        {category !== "All" && (

          <span className="shop-current-category">
            {category}
          </span>

        )}

      </div>


      {/* =====================================================
          PRODUCTS
      ===================================================== */}

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

                <article
                  className="shop-product"
                  key={productId}
                >


                  {/* PRODUCT IMAGE */}

                  <div className="shop-product-image">


                    <Link
                      to={`/product/${productId}`}
                    >

                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
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


                    {/* ADD TO CART */}

                    <button
                      type="button"
                      className="add-cart"
                      disabled={outOfStock}
                      onClick={() => {

                        if (!outOfStock) {

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


                  {/* PRODUCT INFORMATION */}

                  <div className="shop-product-info">

                    <Link
                      to={`/product/${productId}`}
                    >

                      <h3>
                        {product.name}
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
                        {stock} remaining

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
            Try another search
            or category.
          </p>

        </div>

      )}

    </div>

  );

}

export default Shop;