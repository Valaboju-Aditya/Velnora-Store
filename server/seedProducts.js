const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

const products = [
  {
    name: "Men Oversized Graphic T-Shirt",
    description: "Premium cotton oversized t-shirt with a relaxed streetwear fit.",
    price: 899,
    category: "Men",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
    stock: 28,
    featured: true,
    sale: false,
  },
  {
    name: "Men Classic Denim Jacket",
    description: "Classic blue denim jacket designed for casual everyday styling.",
    price: 2199,
    category: "Men",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85",
    stock: 16,
    featured: true,
    sale: false,
  },
  {
    name: "Men Premium Black Hoodie",
    description: "Soft premium hoodie with a comfortable relaxed fit.",
    price: 1599,
    category: "Men",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85",
    stock: 20,
    featured: false,
    sale: true,
  },
  {
    name: "Men Casual Cotton Shirt",
    description: "Breathable cotton shirt suitable for casual and smart-casual outfits.",
    price: 1299,
    category: "Men",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85",
    stock: 22,
    featured: false,
    sale: false,
  },
  {
    name: "Men Slim Fit Jeans",
    description: "Modern slim-fit denim jeans with comfortable stretch fabric.",
    price: 1799,
    category: "Men",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85",
    stock: 18,
    featured: false,
    sale: true,
  },
  {
    name: "Men Everyday Sweatshirt",
    description: "Minimal everyday sweatshirt made with soft and durable fabric.",
    price: 1399,
    category: "Men",
    image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=900&q=85",
    stock: 25,
    featured: false,
    sale: false,
  },
  {
    name: "Men Bomber Jacket",
    description: "Lightweight bomber jacket with a clean modern silhouette.",
    price: 2499,
    category: "Men",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85",
    stock: 12,
    featured: true,
    sale: false,
  },

  {
    name: "Women Floral Summer Dress",
    description: "Lightweight floral dress designed for comfortable summer styling.",
    price: 1699,
    category: "Women",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85",
    stock: 19,
    featured: true,
    sale: false,
  },
  {
    name: "Women Ribbed Crop Top",
    description: "Stylish ribbed crop top with a soft stretch finish.",
    price: 799,
    category: "Women",
    image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&q=85",
    stock: 30,
    featured: false,
    sale: true,
  },
  {
    name: "Women Classic Denim Jacket",
    description: "Versatile denim jacket for layering with everyday outfits.",
    price: 2099,
    category: "Women",
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=900&q=85",
    stock: 14,
    featured: true,
    sale: false,
  },
  {
    name: "Women High Waist Jeans",
    description: "Comfortable high-waist jeans with a flattering modern fit.",
    price: 1899,
    category: "Women",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=85",
    stock: 21,
    featured: false,
    sale: false,
  },
  {
    name: "Women Oversized Hoodie",
    description: "Soft oversized hoodie ideal for casual and relaxed outfits.",
    price: 1499,
    category: "Women",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=900&q=85",
    stock: 24,
    featured: false,
    sale: true,
  },
  {
    name: "Women Elegant Black Dress",
    description: "Elegant black dress designed for evening and occasion wear.",
    price: 2299,
    category: "Women",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85",
    stock: 11,
    featured: true,
    sale: false,
  },
  {
    name: "Women Casual Blazer",
    description: "Modern tailored blazer suitable for office and smart-casual looks.",
    price: 2499,
    category: "Women",
    image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=900&q=85",
    stock: 13,
    featured: false,
    sale: false,
  },

  {
    name: "Premium Leather Handbag",
    description: "Elegant everyday handbag with spacious storage and premium styling.",
    price: 1999,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",
    stock: 17,
    featured: true,
    sale: false,
  },
  {
    name: "Classic Analog Watch",
    description: "Minimal analog wristwatch designed for both casual and formal wear.",
    price: 2499,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",
    stock: 15,
    featured: true,
    sale: false,
  },
  {
    name: "Modern Black Sunglasses",
    description: "Stylish sunglasses with a modern frame and everyday design.",
    price: 999,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85",
    stock: 27,
    featured: false,
    sale: true,
  },
  {
    name: "Minimal Baseball Cap",
    description: "Adjustable casual cap with a clean minimalist design.",
    price: 699,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=85",
    stock: 32,
    featured: false,
    sale: false,
  },
  {
    name: "Everyday White Sneakers",
    description: "Clean everyday sneakers designed for casual outfits and daily wear.",
    price: 2199,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=85",
    stock: 18,
    featured: true,
    sale: true,
  },
  {
    name: "Classic Leather Belt",
    description: "Premium everyday belt with a clean buckle and classic finish.",
    price: 899,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
    stock: 35,
    featured: false,
    sale: false,
  },
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Product.insertMany(products);

    console.log(`${products.length} products added successfully`);

    await mongoose.connection.close();
  } catch (error) {
    console.error("Seed error:", error);

    await mongoose.connection.close();

    process.exit(1);
  }
}

seedProducts();