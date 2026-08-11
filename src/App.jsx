import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  ArrowRight,
} from "lucide-react";

import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import "./index.css";

const products = [
  {
    id: 1,
    name: "Oversized Premium T-Shirt",
    price: 899,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 2,
    name: "Classic Denim Jacket",
    price: 1999,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 3,
    name: "Premium Hoodie",
    price: 1499,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 4,
    name: "Casual Cotton Shirt",
    price: 1199,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=85",
  },
];

function Home({ cart, addToCart }) {
  const [wishlist, setWishlist] = useState([]);

  function toggleWishlist(id) {
    setWishlist((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      return [...current, id];
    });
  }

  return (
    <div className="app">

      {/* NAVBAR */}

      <header className="navbar">

        <Link to="/" className="logo">
          NOVA
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/shop">Men</Link>
          <Link to="/shop">Women</Link>
          <Link to="/shop">Kids</Link>
          <Link to="/shop">New Arrivals</Link>

          <Link to="/shop" className="sale">
            Sale
          </Link>
        </nav>

        <div className="nav-actions">

          <Link to="/shop" className="nav-button">
            <Search size={20} />
          </Link>

          <button className="nav-button">
            <Heart size={20} />
          </button>

          <Link
            to="/cart"
            className="nav-button cart-button"
          >
            <ShoppingBag size={20} />

            {cart.length > 0 && (
              <span className="cart-count">
                {cart.reduce(
                  (total, item) =>
                    total + item.quantity,
                  0
                )}
              </span>
            )}
          </Link>

          <button className="nav-button mobile-menu">
            <Menu size={20} />
          </button>

        </div>

      </header>

      {/* HERO */}

      <section className="hero">

        <div className="hero-content">

          <p className="hero-label">
            NEW COLLECTION 2026
          </p>

          <h1>
            Define Your
            <br />
            <span>Own Style.</span>
          </h1>

          <p className="hero-description">
            Discover premium fashion designed
            for people who don't follow trends.
          </p>

          <Link
            to="/shop"
            className="hero-button"
          >
            Shop Collection
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

      {/* CATEGORIES */}

      <section className="categories">

        <div className="section-header">

          <div>
            <p>EXPLORE</p>

            <h2>
              Shop By Category
            </h2>
          </div>

          <Link to="/shop">
            View All
            <ArrowRight size={16} />
          </Link>

        </div>

        <div className="category-grid">

          <Link
            to="/shop"
            className="category-card"
          >
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85"
              alt="Women fashion"
            />

            <div className="category-overlay">
              <h3>Women</h3>

              <span>
                Explore Collection →
              </span>
            </div>
          </Link>

          <Link
            to="/shop"
            className="category-card"
          >
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85"
              alt="Men fashion"
            />

            <div className="category-overlay">
              <h3>Men</h3>

              <span>
                Explore Collection →
              </span>
            </div>
          </Link>

          <Link
            to="/shop"
            className="category-card"
          >
            <img
              src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&q=85"
              alt="Fashion accessories"
            />

            <div className="category-overlay">
              <h3>Accessories</h3>

              <span>
                Explore Collection →
              </span>
            </div>
          </Link>

        </div>

      </section>

      {/* FEATURED PRODUCTS */}

      <section className="featured">

        <div className="section-header">

          <div>
            <p>OUR PICKS</p>

            <h2>
              Featured Products
            </h2>
          </div>

          <Link to="/shop">
            Shop All
            <ArrowRight size={16} />
          </Link>

        </div>

        <div className="product-grid">

          {products.map((product) => {

            const liked =
              wishlist.includes(product.id);

            return (
              <div
                className="product-card"
                key={product.id}
              >

                <div className="product-image">

                  <Link
                    to={`/product/${product.id}`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                  </Link>

                  <button
                    className="wishlist-button"
                    onClick={() =>
                      toggleWishlist(product.id)
                    }
                  >
                    <Heart
                      size={20}
                      fill={
                        liked
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>

                  <button
                    className="add-cart-button"
                    onClick={() =>
                      addToCart(product)
                    }
                  >
                    <ShoppingBag size={17} />
                    Add to Cart
                  </button>

                </div>

                <div className="product-info">

                  <Link
                    to={`/product/${product.id}`}
                  >
                    <h3>
                      {product.name}
                    </h3>
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
          })}

        </div>

      </section>

    </div>
  );
}

function App() {
  const [cart, setCart] = useState([]);

  function addToCart(product) {
    setCart((current) => {

      const existing = current.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...current,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  }

  return (
    <BrowserRouter>

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={
            <Home
              cart={cart}
              addToCart={addToCart}
            />
          }
        />

        {/* SHOP */}

        <Route
          path="/shop"
          element={
            <Shop
              addToCart={addToCart}
            />
          }
        />
        <Route
  path="/checkout"
  element={
    <Checkout cart={cart} />
  }
/>

        {/* PRODUCT */}

        <Route
          path="/product/:id"
          element={
            <Product
              addToCart={addToCart}
            />
          }
        />

        {/* CART */}

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              setCart={setCart}
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;