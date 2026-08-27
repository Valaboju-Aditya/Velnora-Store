const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

const products = [
  {
    name: "Oversized Premium T-Shirt",
    price: 899,
    category: "Men",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    description: "Premium oversized cotton t-shirt with a comfortable modern fit.",
    stock: 50,
    featured: true
  },
  {
    name: "Classic Denim Jacket",
    price: 1999,
    category: "Men",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
    description: "Classic denim jacket designed for a timeless everyday look.",
    stock: 30,
    featured: true
  },
  {
    name: "Premium Hoodie",
    price: 1499,
    category: "Men",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
    description: "Soft premium hoodie perfect for casual and everyday wear.",
    stock: 40,
    featured: true
  },
  {
    name: "Casual Cotton Shirt",
    price: 1199,
    category: "Men",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
    description: "Comfortable cotton shirt with a clean casual design.",
    stock: 35,
    featured: false
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log("Products added successfully!");

    await mongoose.disconnect();

    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

seedProducts();