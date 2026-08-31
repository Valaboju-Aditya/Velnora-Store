import { useEffect, useState } from "react";
import { API_URL } from "./config";
import MobileBottomNav from "./components/MobileBottomNav";

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
import AdminUsers from "./pages/AdminUsers";
import AdminOrders from "./pages/AdminOrders";
import AdminRoute from "./components/AdminRoute";
import Addresses from "./pages/Addresses";
import AccountDetails from "./pages/AccountDetails";

import "./index.css";


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
  const [products, setProducts] =
    useState([]);

  const [
    loadingProducts,
    setLoadingProducts,
  ] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadProducts = async () => {
      try {
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
          setProducts(data);
        }
      } catch (error) {
        console.error(
          "Home products error:",
          error
        );
      } finally {
        if (!ignore) {
          setLoadingProducts(false);
        }
      }
    };

    loadProducts();

    return () => {
      ignore = true;
    };
  }, []);

  const featuredProducts =
    products.filter(
      (product) =>
        product.featured === true
    );

  const cartCount =
    cart.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    );

  return (
    <div className="app">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="navbar">

        <Link
          to="/"
          className="logo"
        >
          NOVA
        </Link>

        <nav className="nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/shop?category=Men">
            Men
          </Link>

          <Link to="/shop?category=Women">
            Women
          </Link>

          <Link to="/shop?category=Kids">
            Kids
          </Link>

          <Link to="/shop?new=true">
            New Arrivals
          </Link>

          <Link
            to="/shop?sale=true"
            className="sale"
          >
            Sale
          </Link>

        </nav>


        <div className="nav-actions">

          <Link
            to="/shop"
            className="nav-button"
            title="Search"
          >
            <Search size={20} />
          </Link>


          <Link
            to="/account"
            className="nav-button"
            title="My Account"
          >
            <User size={20} />
          </Link>


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


          <Link
            to="/cart"
            className="nav-button cart-button"
            title="Cart"
          >
            <ShoppingBag size={20} />

            {cart.length > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}
          </Link>


          <button
            className="nav-button mobile-menu"
            type="button"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

        </div>

      </header>


      <div className="mobile-search-bar">

        <Search size={18} />

        <Link to="/shop">
          Search for products, brands and more
        </Link>

      </div>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero">

        <div className="hero-content">

          <p className="hero-label">
            NEW COLLECTION 2026
          </p>

          <h1>
            Define Your
            <br />

            <span>
              Own Style.
            </span>
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


      {/* =====================================================
          CATEGORIES
      ===================================================== */}

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
            to="/shop?category=Women"
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
            to="/shop?category=Men"
            className="category-card"
          >

            <img
              src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=85"
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
            to="/shop?category=Accessories"
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


      {/* =====================================================
          FEATURED PRODUCTS
      ===================================================== */}

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

          {loadingProducts ? (

            <p>
              Loading featured products...
            </p>

          ) : featuredProducts.length === 0 ? (

            <p>
              No featured products yet.
            </p>

          ) : (

            featuredProducts.map(
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

                return (

                  <div
                    className="product-card"
                    key={productId}
                  >

                    <div className="product-image">

                      <Link
                        to={`/product/${productId}`}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                        />
                      </Link>


                      <button
                        className="wishlist-button"
                        type="button"
                        aria-label={
                          liked
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                        onClick={() =>
                          toggleWishlist(
                            product
                          )
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
                        type="button"
                        onClick={() =>
                          addToCart(
                            product
                          )
                        }
                      >

                        <ShoppingBag
                          size={17}
                        />

                        Add to Cart

                      </button>

                    </div>


                    <div className="product-info">

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
                          product.price ||
                          0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>

                    </div>

                  </div>

                );
              }
            )

          )}

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
     USER
  ======================================================= */

  const [user, setUser] =
    useState(() => {

      try {

        const savedUser =
          localStorage.getItem(
            "novaUser"
          );

        return savedUser
          ? JSON.parse(savedUser)
          : null;

      } catch {

        return null;

      }

    });


  /* =======================================================
     CART
  ======================================================= */

  const [cart, setCart] =
    useState([]);


  /* =======================================================
     WISHLIST
  ======================================================= */

  const [
    wishlist,
    setWishlist,
  ] = useState([]);


  /* =======================================================
     SERVER DATA READY
  ======================================================= */

  const [
    userDataLoaded,
    setUserDataLoaded,
  ] = useState(false);


  /* =======================================================
     LOAD CART + WISHLIST FROM MONGODB
  ======================================================= */

  useEffect(() => {

    let ignore = false;

    async function loadUserData() {

      if (!user) {

        setCart([]);
        setWishlist([]);
        setUserDataLoaded(false);

        return;
      }


      const token =
        localStorage.getItem(
          "novaToken"
        );


      if (!token) {

        setCart([]);
        setWishlist([]);
        setUserDataLoaded(false);

        return;
      }


      setUserDataLoaded(false);


      try {

        const [
          cartResponse,
          wishlistResponse,
        ] = await Promise.all([

          fetch(
            `${API_URL}/api/user-data/cart`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          ),

          fetch(
            `${API_URL}/api/user-data/wishlist`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          ),

        ]);


        if (!cartResponse.ok) {

          const data =
            await cartResponse
              .json()
              .catch(() => ({}));

          throw new Error(
            data.message ||
            "Failed to load cart"
          );

        }


        if (!wishlistResponse.ok) {

          const data =
            await wishlistResponse
              .json()
              .catch(() => ({}));

          throw new Error(
            data.message ||
            "Failed to load wishlist"
          );

        }


        const [
          serverCart,
          serverWishlist,
        ] = await Promise.all([

          cartResponse.json(),

          wishlistResponse.json(),

        ]);


        if (!ignore) {

          setCart(
            Array.isArray(serverCart)
              ? serverCart
              : []
          );

          setWishlist(
            Array.isArray(serverWishlist)
              ? serverWishlist
              : []
          );

          setUserDataLoaded(true);

        }

      } catch (error) {

        console.error(
          "Load account data failed:",
          error
        );


        if (!ignore) {

          setUserDataLoaded(false);

        }

      }

    }


    loadUserData();


    return () => {
      ignore = true;
    };

  }, [user]);


  /* =======================================================
     SAVE CART TO MONGODB
  ======================================================= */

  useEffect(() => {

    if (
      !user ||
      !userDataLoaded
    ) {
      return;
    }


    const token =
      localStorage.getItem(
        "novaToken"
      );


    if (!token) {
      return;
    }


    const saveCart = async () => {

      try {

        const response =
          await fetch(
            `${API_URL}/api/user-data/cart`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                cart,
              }),
            }
          );


        if (!response.ok) {

          const data =
            await response
              .json()
              .catch(() => ({}));

          throw new Error(
            data.message ||
            "Failed to sync cart"
          );

        }

      } catch (error) {

        console.error(
          "Cart sync failed:",
          error
        );

      }

    };


    saveCart();

  }, [
    cart,
    user,
    userDataLoaded,
  ]);


  /* =======================================================
     SAVE WISHLIST TO MONGODB
  ======================================================= */

  useEffect(() => {

    if (
      !user ||
      !userDataLoaded
    ) {
      return;
    }


    const token =
      localStorage.getItem(
        "novaToken"
      );


    if (!token) {
      return;
    }


    const saveWishlist = async () => {

      try {

        const response =
          await fetch(
            `${API_URL}/api/user-data/wishlist`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                wishlist,
              }),
            }
          );


        if (!response.ok) {

          const data =
            await response
              .json()
              .catch(() => ({}));

          throw new Error(
            data.message ||
            "Failed to sync wishlist"
          );

        }

      } catch (error) {

        console.error(
          "Wishlist sync failed:",
          error
        );

      }

    };


    saveWishlist();

  }, [
    wishlist,
    user,
    userDataLoaded,
  ]);


  /* =======================================================
     LOGIN
  ======================================================= */

  function handleLogin(
    userData
  ) {

    const email =
      userData?.email
        ?.toLowerCase()
        .trim();


    const loggedInUser = {
      ...userData,
      email,
    };


    localStorage.setItem(
      "novaUser",
      JSON.stringify(
        loggedInUser
      )
    );


    setUserDataLoaded(false);

    setCart([]);

    setWishlist([]);

    setUser(
      loggedInUser
    );

  }

  function handleUserUpdate(updatedUserData) {
  setUser((currentUser) => {
    const updatedUser = {
      ...currentUser,
      ...updatedUserData,
    };

    localStorage.setItem(
      "novaUser",
      JSON.stringify(updatedUser)
    );

    return updatedUser;
  });
}

  /* =======================================================
     LOGOUT
  ======================================================= */

  function handleLogout() {

    setUserDataLoaded(false);

    localStorage.removeItem(
      "novaUser"
    );

    localStorage.removeItem(
      "novaToken"
    );


    setUser(null);

    setWishlist([]);

    setCart([]);

  }


  /* =======================================================
     ADD TO CART
  ======================================================= */

  function addToCart(
    product
  ) {

    if (!user) {

      alert(
        "Please login to add products to your cart."
      );

      return;

    }


    setCart((current) => {

      const productId =
        String(
          product._id ||
          product.id
        );


      const existing =
        current.find(
          (item) =>
            String(
              item._id ||
              item.id
            ) === productId
        );


      if (existing) {

        return current.map(
          (item) =>
            String(
              item._id ||
              item.id
            ) === productId
              ? {
                  ...item,
                  quantity:
                    Number(
                      item.quantity ||
                      0
                    ) + 1,
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
  ======================================================= */

  async function createOrder(
    orderDetails = {}
  ) {

    if (!user?.email) {

      alert(
        "Please login before placing an order."
      );

      return null;

    }


    if (cart.length === 0) {
      return null;
    }


    const total =
      cart.reduce(
        (
          sum,
          item
        ) =>
          sum +
          Number(
            item.price
          ) *
          Number(
            item.quantity
          ),
        0
      );


    const newOrder = {

      id:
        `NOVA-${Date.now()}`,

      date:
        new Date()
          .toLocaleDateString(
            "en-IN"
          ),

      status:
        "Order Confirmed",

      items:
        cart.map(
          (item) => ({
            ...item,
          })
        ),

      total,

      customer:
        orderDetails.customer ||
        {},

      paymentMethod:
        orderDetails.paymentMethod ||
        "cod",

    };


    try {

      const token =
        localStorage.getItem(
          "novaToken"
        );


      if (!token) {

        alert(
          "Please login again before placing an order."
        );

        return null;

      }


      const response =
        await fetch(
          `${API_URL}/api/orders`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify({

                orderId:
                  newOrder.id,

                customer:
                  newOrder.customer,

                items:
                  newOrder.items.map(
                    (item) => ({
                      id: String(
                        item._id ||
                        item.id
                      ),

                      name:
                        item.name,

                      price:
                        Number(
                          item.price
                        ),

                      quantity:
                        Number(
                          item.quantity
                        ),

                      image:
                        item.image ||
                        "",
                    })
                  ),

                total:
                  newOrder.total,

                paymentMethod:
                  newOrder.paymentMethod,

                razorpay_order_id:
                  orderDetails
                    .razorpayPayment
                    ?.razorpay_order_id,

                razorpay_payment_id:
                  orderDetails
                    .razorpayPayment
                    ?.razorpay_payment_id,

                razorpay_signature:
                  orderDetails
                    .razorpayPayment
                    ?.razorpay_signature,
              }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to save order"
        );

      }


      return {
        ...newOrder,

        mongoId:
          data.order._id,
      };

    } catch (error) {

      console.error(
        "Create order failed:",
        error
      );

      alert(
        error.message ||
        "Failed to place order"
      );

      return null;

    }

  }


  /* =======================================================
     REMOVE FROM WISHLIST
  ======================================================= */

  function removeFromWishlist(
    productId
  ) {

    if (!user) {

      return;

    }


    setWishlist(
      (current) =>
        current.filter(
          (item) =>
            String(
              item._id ||
              item.id
            ) !==
            String(productId)
        )
    );

  }


  /* =======================================================
     TOGGLE WISHLIST
  ======================================================= */

  function toggleWishlist(
    product
  ) {

    if (!user) {

      alert(
        "Please login to add products to your wishlist."
      );

      return;

    }


    const productId =
      String(
        product._id ||
        product.id
      );


    setWishlist(
      (current) => {

        const exists =
          current.some(
            (item) =>
              String(
                item._id ||
                item.id
              ) === productId
          );


        if (exists) {

          return current.filter(
            (item) =>
              String(
                item._id ||
                item.id
              ) !== productId
          );

        }


        return [
          ...current,
          product,
        ];

      }
    );

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
              toggleWishlist={toggleWishlist}
            />
          }
        />


        {/* SHOP */}

        <Route
          path="/shop"
          element={
            <Shop
              addToCart={addToCart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />
          }
        />


        {/* PRODUCT */}

        <Route
          path="/product/:id"
          element={
            <Product
              addToCart={addToCart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
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
            <Orders />
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
            <Register />
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


        {/* SAVED ADDRESSES */}

        <Route
          path="/account/addresses"
          element={
            <Addresses />
          }
        />


        {/* ACCOUNT DETAILS */}

        <Route
  path="/account/details"
  element={
    <AccountDetails
      user={user}
      onUserUpdate={
        handleUserUpdate
      }
    />
  }
/>


        {/* ADMIN DASHBOARD */}

        <Route
          path="/admin"
          element={
            <AdminRoute
              user={user}
            >
              <AdminDashboard />
            </AdminRoute>
          }
        />


        {/* ADMIN PRODUCTS */}

        <Route
          path="/admin/products"
          element={
            <AdminRoute
              user={user}
            >
              <AdminProducts />
            </AdminRoute>
          }
        />


        {/* ADMIN USERS */}

        <Route
          path="/admin/users"
          element={
            <AdminRoute
              user={user}
            >
              <AdminUsers />
            </AdminRoute>
          }
        />


        {/* ADMIN ORDERS */}

        <Route
          path="/admin/orders"
          element={
            <AdminRoute
              user={user}
            >
              <AdminOrders />
            </AdminRoute>
          }
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


      <MobileBottomNav
        cart={cart}
        wishlist={wishlist}
      />


    </BrowserRouter>

  );

}


export default App;