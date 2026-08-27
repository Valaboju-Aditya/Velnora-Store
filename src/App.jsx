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
  User,
} from "lucide-react";

import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wishlist from "./pages/Wishlist";
import Account from "./pages/Account";
import AdminProducts from "./pages/AdminProducts";
import AdminDashboard from "./pages/AdminDashboard";

import "./index.css";


/* =========================================================
   PRODUCTS
========================================================= */

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


/* =========================================================
   HOME PAGE
========================================================= */

function Home({
  cart,
  addToCart,
  user,
  wishlist,
  toggleWishlist,
}) {
  return (
    <div className="app">

      {/* NAVBAR */}

      <header className="navbar">

        <Link to="/" className="logo">
          NOVA
        </Link>

        <nav className="nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/shop">
            Men
          </Link>

          <Link to="/shop">
            Women
          </Link>

          <Link to="/shop">
            Kids
          </Link>

          <Link to="/shop">
            New Arrivals
          </Link>

          <Link
            to="/shop"
            className="sale"
          >
            Sale
          </Link>

        </nav>


        <div className="nav-actions">

          {/* SEARCH */}

          <Link
            to="/shop"
            className="nav-button"
            title="Search"
          >
            <Search size={20} />
          </Link>


          {/* ACCOUNT */}

          <Link
            to="/account"
            className="nav-button"
            title="My Account"
          >
            <User size={20} />
          </Link>


          {/* WISHLIST */}

          <Link
            to="/wishlist"
            className="nav-button"
            title="Wishlist"
          >
            <Heart size={20} />

            {wishlist.length > 0 && (
              <span className="cart-count">
                {wishlist.length}
              </span>
            )}
          </Link>


          {/* USER */}

          {user && (
            <span className="user-name">
              👤 {user.name}
            </span>
          )}


          {!user && (
            <Link
              to="/login"
              className="login-link"
            >
              Login
            </Link>
          )}


          {/* CART */}

          <Link
            to="/cart"
            className="nav-button cart-button"
            title="Cart"
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


          {/* MOBILE MENU */}

          <button
            className="nav-button mobile-menu"
            type="button"
          >
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

            <p>
              EXPLORE
            </p>

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

          {/* WOMEN */}

          <Link
            to="/shop"
            className="category-card"
          >

            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85"
              alt="Women fashion"
            />

            <div className="category-overlay">

              <h3>
                Women
              </h3>

              <span>
                Explore Collection →
              </span>

            </div>

          </Link>


          {/* MEN */}

          <Link
            to="/shop"
            className="category-card"
          >

            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85"
              alt="Men fashion"
            />

            <div className="category-overlay">

              <h3>
                Men
              </h3>

              <span>
                Explore Collection →
              </span>

            </div>

          </Link>


          {/* ACCESSORIES */}

          <Link
            to="/shop"
            className="category-card"
          >

            <img
              src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&q=85"
              alt="Fashion accessories"
            />

            <div className="category-overlay">

              <h3>
                Accessories
              </h3>

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

            <p>
              OUR PICKS
            </p>

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

            const liked = wishlist.some(
              (item) =>
                item.id === product.id
            );

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


                  {/* WISHLIST */}

                  <button
                    className="wishlist-button"
                    type="button"
                    onClick={() =>
                      toggleWishlist(product)
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


                  {/* ADD TO CART */}

                  <button
                    className="add-cart-button"
                    type="button"
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


/* =========================================================
   APP
========================================================= */

function App() {

  /* =======================================================
     CART
  ======================================================= */

  const [cart, setCart] = useState([]);


  /* =======================================================
     USER
  ======================================================= */

  const [user, setUser] = useState(() => {

    try {

      const savedUser =
        localStorage.getItem("novaUser");

      return savedUser
        ? JSON.parse(savedUser)
        : null;

    } catch {

      return null;

    }

  });


  /* =======================================================
     ORDERS
     Orders are stored separately for every account.
  ======================================================= */

  const [orders, setOrders] = useState(() => {

    try {

      const savedUser =
        localStorage.getItem("novaUser");

      if (!savedUser) {
        return [];
      }

      const currentUser =
        JSON.parse(savedUser);

      if (!currentUser?.email) {
        return [];
      }

      const email =
        currentUser.email
          .toLowerCase()
          .trim();

      const orderKey =
        `novaOrders_${email}`;

      const savedOrders =
        localStorage.getItem(orderKey);

      return savedOrders
        ? JSON.parse(savedOrders)
        : [];

    } catch {

      return [];

    }

  });


  /* =======================================================
     WISHLIST
     Wishlist is stored separately for every account.
  ======================================================= */

  const [wishlist, setWishlist] = useState(() => {

    try {

      const savedUser =
        localStorage.getItem("novaUser");

      if (!savedUser) {
        return [];
      }

      const currentUser =
        JSON.parse(savedUser);

      if (!currentUser?.email) {
        return [];
      }

      const email =
        currentUser.email
          .toLowerCase()
          .trim();

      const wishlistKey =
        `novaWishlist_${email}`;

      const savedWishlist =
        localStorage.getItem(wishlistKey);

      return savedWishlist
        ? JSON.parse(savedWishlist)
        : [];

    } catch {

      return [];

    }

  });


  /* =======================================================
     LOGIN
  ======================================================= */

  /* =======================================================
   LOGIN
======================================================= */

function handleLogin(userData) {
  const email = userData?.email
    ?.toLowerCase()
    .trim();

  const loggedInUser = {
    ...userData,
    email,
  };

  localStorage.setItem(
    "novaUser",
    JSON.stringify(loggedInUser)
  );

  setUser(loggedInUser);


  /* LOAD WISHLIST */

  const wishlistKey =
    `novaWishlist_${email}`;

  try {
    const savedWishlist =
      localStorage.getItem(wishlistKey);

    setWishlist(
      savedWishlist
        ? JSON.parse(savedWishlist)
        : []
    );
  } catch {
    setWishlist([]);
  }


  /* LOAD ORDERS */

  const orderKey =
    `novaOrders_${email}`;

  try {
    const savedOrders =
      localStorage.getItem(orderKey);

    setOrders(
      savedOrders
        ? JSON.parse(savedOrders)
        : []
    );
  } catch {
    setOrders([]);
  }


  /* CLEAR CART */

  setCart([]);
}


  /* =======================================================
     REGISTER
  ======================================================= */

  function handleRegister(userData) {

    const email =
      userData?.email
        ?.toLowerCase()
        .trim();

    const registeredUser = {
      ...userData,
      email,
    };


    /* SAVE USER */

    localStorage.setItem(
      "novaUser",
      JSON.stringify(registeredUser)
    );


    /* SET USER */

    setUser(registeredUser);


    /* NEW ACCOUNT = EMPTY WISHLIST */

    setWishlist([]);


    /* NEW ACCOUNT = EMPTY ORDERS */

    setOrders([]);


    /* NEW ACCOUNT = EMPTY CART */

    setCart([]);

  }


  /* =======================================================
     LOGOUT
  ======================================================= */

  function handleLogout() {

    /* REMOVE LOGIN */

    localStorage.removeItem(
      "novaUser"
    );


    /* CLEAR USER */

    setUser(null);


    /* CLEAR WISHLIST FROM SCREEN */

    setWishlist([]);


    /* CLEAR ORDERS FROM SCREEN */

    setOrders([]);


    /* CLEAR CART */

    setCart([]);

  }


  /* =======================================================
     ADD TO CART
  ======================================================= */

  function addToCart(product) {

    setCart((current) => {

      const existing =
        current.find(
          (item) =>
            item.id === product.id
        );


      if (existing) {

        return current.map(
          (item) =>
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


  /* =======================================================
     CLEAR CART
  ======================================================= */

  function clearCart() {

    setCart([]);

  }


  /* =======================================================
     CREATE ORDER
     
     IMPORTANT:
     Orders are saved using the logged-in user's email.
  ======================================================= */

  /* =========================================================
   CREATE ORDER
   SAVE ORDER FOR CURRENT USER
========================================================= */

/* =========================================================
   CREATE ORDER
   SAVE ORDER FOR CURRENT USER
========================================================= */

function createOrder(orderDetails = {}) {
  if (!user?.email) {
    alert("Please login before placing an order.");
    return null;
  }

  if (cart.length === 0) {
    return null;
  }

  const email = user.email
    .toLowerCase()
    .trim();

  const orderKey = `novaOrders_${email}`;

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const newOrder = {
    id: `NOVA-${Date.now()}`,

    date: new Date().toLocaleDateString(
      "en-IN"
    ),

    status: "Order Confirmed",

    items: cart.map((item) => ({
      ...item,
    })),

    total: total,

    customer:
      orderDetails.customer || {},

    paymentMethod:
      orderDetails.paymentMethod || "cod",
  };


  /* ADD ORDER TO CURRENT USER'S ORDERS */

  setOrders((current) => {
    const updatedOrders = [
      ...current,
      newOrder,
    ];

    /* SAVE ONLY FOR THIS USER */

    localStorage.setItem(
      orderKey,
      JSON.stringify(updatedOrders)
    );

    return updatedOrders;
  });

  return newOrder;
}


  /* =======================================================
     REMOVE FROM WISHLIST
  ======================================================= */

  function removeFromWishlist(
    productId
  ) {

    if (!user?.email) {
      return;
    }


    const email =
      user.email
        .toLowerCase()
        .trim();


    const wishlistKey =
      `novaWishlist_${email}`;


    setWishlist((current) => {

      const updatedWishlist =
        current.filter(
          (item) =>
            item.id !== productId
        );


      localStorage.setItem(
        wishlistKey,
        JSON.stringify(
          updatedWishlist
        )
      );


      return updatedWishlist;

    });

  }


  /* =======================================================
     TOGGLE WISHLIST
  ======================================================= */

  function toggleWishlist(product) {

    /* LOGIN REQUIRED */

    if (!user?.email) {

      alert(
        "Please login to add products to your wishlist."
      );

      return;

    }


    const email =
      user.email
        .toLowerCase()
        .trim();


    const wishlistKey =
      `novaWishlist_${email}`;


    setWishlist((current) => {

      const exists =
        current.some(
          (item) =>
            item.id === product.id
        );


      const updatedWishlist =
        exists

          ? current.filter(
              (item) =>
                item.id !== product.id
            )

          : [
              ...current,
              product,
            ];


      /* SAVE ONLY FOR CURRENT USER */

      localStorage.setItem(
        wishlistKey,
        JSON.stringify(
          updatedWishlist
        )
      );


      return updatedWishlist;

    });

  }


  /* =======================================================
     ROUTES
  ======================================================= */

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
              user={user}
              wishlist={wishlist}
              toggleWishlist={
                toggleWishlist
              }
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


        {/* CHECKOUT */}

        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              clearCart={clearCart}
              createOrder={createOrder}
            />
          }
        />


        {/* ORDERS */}

        <Route
          path="/orders"
          element={
            <Orders
              orders={orders}
            />
          }
        />


        {/* LOGIN */}

        <Route
          path="/login"
          element={
            <Login
              onLogin={handleLogin}
            />
          }
        />


        {/* REGISTER */}

        <Route
          path="/register"
          element={
            <Register
              onRegister={
                handleRegister
              }
            />
          }
        />


        {/* ACCOUNT */}

        <Route
          path="/account"
          element={
            <Account
              user={user}
              onLogout={handleLogout}
            />
          }
        />

        

        <Route
  path="/admin/products"
  element={<AdminProducts />}
/>

        <Route
  path="/admin"
  element={<AdminDashboard />}
/>


        {/* WISHLIST */}

        <Route
          path="/wishlist"
          element={
            <Wishlist
              wishlist={wishlist}
              removeFromWishlist={
                removeFromWishlist
              }
              addToCart={addToCart}
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );

}


export default App;