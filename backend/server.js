const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

// Load static product data
const { tees } = require("../src/customer/data/tees");
const { hoodies } = require("../src/customer/data/hoodies");
const { caps } = require("../src/customer/data/cap");
const { mobilecover } = require("../src/customer/data/mobilecover");
const { mugs } = require("../src/customer/data/mugs");
const { keychain } = require("../src/customer/data/keychain");

// Combine all products into a single array
const allProducts = [
  ...tees,
  ...hoodies,
  ...caps,
  ...mobilecover,
  ...mugs,
  ...keychain,
];

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Initialize Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `design-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MySQL connection pool
const db = mysql.createPool({
  host: "localhost",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: "kraftkart",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("MySQL Pool created");

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// Register endpoint
app.post("/api/register", (req, res) => {
  const { email, name, password, phone_number, provider } = req.body;
  if (!email || !name || !password) {
    return res
      .status(400)
      .json({ message: "Email, name, and password are required" });
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const query =
    "INSERT INTO users (email, name, password, phone_number, provider) VALUES (?, ?, ?, ?, ?)";
  db.query(
    query,
    [email, name, hashedPassword, phone_number || null, provider || "manual"],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email already exists" });
        }
        return res
          .status(500)
          .json({ message: "Database error: " + err.message });
      }
      res.status(201).json({ message: "User registered successfully" });
    }
  );
});

// Login endpoint
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Database error: " + err.message });
    if (results.length === 0)
      return res.status(400).json({ message: "Invalid email or password" });

    const user = results[0];
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      token,
      user: {
        userId: user.user_id,
        email: user.email,
        name: user.name,
        phone_number: user.phone_number,
        provider: user.provider,
        picture: user.picture,
      },
    });
  });
});

// Google OAuth login endpoint
app.post("/api/google-login", (req, res) => {
  const { email, name, picture, phone_number } = req.body;
  console.log("Received Google Login Request:", req.body);
  if (!email || !name) {
    console.log("Validation Failed: Email or name missing");
    return res.status(400).json({ message: "Email and name are required" });
  }
  let query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Database Error in SELECT:", err);
      return res
        .status(500)
        .json({ message: "Database error: " + err.message });
    }
    console.log("SELECT Query Results:", results);
    if (results.length > 0) {
      const user = results[0];
      const token = jwt.sign(
        { userId: user.user_id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      console.log("Existing User Found, Returning Token:", token);
      return res.json({
        token,
        user: {
          userId: user.user_id,
          email: user.email,
          name: user.name,
          phone_number: user.phone_number,
          provider: "google",
          picture: user.picture,
        },
      });
    }
    query =
      "INSERT INTO users (email, name, password, provider, picture, phone_number) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(
      query,
      [email, name, null, "google", picture || null, phone_number || null],
      (err, result) => {
        if (err) {
          console.error("Database Error in INSERT:", err);
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Email already exists" });
          }
          return res
            .status(500)
            .json({ message: "Database error: " + err.message });
        }
        console.log("INSERT Query Result:", result);
        const token = jwt.sign(
          { userId: result.insertId, email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        console.log("New User Created, Returning Token:", token);
        res.json({
          token,
          user: {
            userId: result.insertId,
            email,
            name,
            phone_number: phone_number || null,
            provider: "google",
            picture: picture || null,
          },
        });
      }
    );
  });
});

// User update endpoint
app.put("/api/user/:userId", (req, res) => {
  const { userId } = req.params;
  const { name, email, phone_number } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }
  const query =
    "UPDATE users SET name = ?, email = ?, phone_number = ? WHERE user_id = ?";
  db.query(
    query,
    [name, email, phone_number || null, userId],
    (err, result) => {
      if (err) {
        console.error("Database Error in UPDATE:", err);
        return res
          .status(500)
          .json({ message: "Database error: " + err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User updated successfully" });
    }
  );
});

// Product-related endpoints
app.get("/api/products", (req, res) => {
  const { category, exclude } = req.query;
  let filteredProducts = allProducts;
  if (category) {
    filteredProducts = filteredProducts.filter(
      (p) => p.topLevelCategory.toLowerCase() === category.toLowerCase()
    );
  }
  if (exclude) {
    filteredProducts = filteredProducts.filter(
      (p) => p.product_id !== parseInt(exclude)
    );
  }
  res.json(filteredProducts);
});

app.get("/api/product/:id", (req, res) => {
  const { id } = req.params;
  const product = allProducts.find((p) => p.product_id === parseInt(id));
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

// Add customized products
app.post("/api/customized-products",
  upload.single("fullDesign"),
  (req, res) => {
    const { userId, productId, customizationDetails, price } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("JWT Verification Error:", err.message);
        return res.status(401).json({ message: "Invalid token" });
      }
      if (decoded.userId !== parseInt(userId)) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      if (!productId || !customizationDetails || !price || !req.file) {
        return res.status(400).json({
          message:
            "productId, customizationDetails, price, and fullDesign are required",
        });
      }

      const parsedProductId = parseInt(productId);
      if (isNaN(parsedProductId)) {
        return res
          .status(400)
          .json({ message: "productId must be a valid integer" });
      }

      const product = allProducts.find((p) => p.product_id === parsedProductId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const customizationData = JSON.parse(customizationDetails);
      customizationData.fullDesignPath = `/uploads/${req.file.filename}`;

      const query = `
      INSERT INTO customized_products (product_id, user_id, customization_details, price)
      VALUES (?, ?, ?, ?)
    `;
      db.query(
        query,
        [parsedProductId, userId, JSON.stringify(customizationData), price],
        (err, result) => {
          if (err) {
            console.error("Database Error in INSERT:", err);
            return res
              .status(500)
              .json({ message: "Database error: " + err.message });
          }
          const customId = result.insertId;
          console.log("Customized product created with custom_id:", customId);
          res
            .status(201)
            .json({ message: "Customized product created", customId });
        }
      );
    });
  }
);

// Updated /api/cart endpoint with enhanced logging and validation
app.post("/api/cart", (req, res) => {
  console.log("Received /api/cart request:", req.body); // Log incoming request

  const { userId, productId, quantity, size, customId } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  // Validate required fields
  if (!token) {
    console.error("No token provided in request headers");
    return res.status(401).json({ message: "No token provided" });
  }
  if (!userId || !productId || !quantity) {
    console.error("Missing required fields:", { userId, productId, quantity });
    return res
      .status(400)
      .json({ message: "userId, productId, and quantity are required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err.message);
      return res.status(401).json({ message: "Invalid token" });
    }
    if (decoded.userId !== userId) {
      console.error("Unauthorized: userId mismatch", {
        decodedUserId: decoded.userId,
        userId,
      });
      return res.status(403).json({ message: "Unauthorized" });
    }

    const parsedProductId = parseInt(productId);
    if (isNaN(parsedProductId)) {
      console.error("Invalid productId:", productId);
      return res
        .status(400)
        .json({ message: "productId must be a valid integer" });
    }

    const product = allProducts.find((p) => p.product_id === parsedProductId);
    if (!product) {
      console.error(`Product not found for productId: ${parsedProductId}`);
      return res.status(404).json({ message: "Product not found" });
    }

    console.log(
      `Adding to cart - Product: ${product.title}, ID: ${product.product_id}`
    );

    // Handle discountedPrice
    let price;
    if (typeof product.discountedPrice === "string") {
      price = parseFloat(product.discountedPrice.replace(/[^0-9.-]+/g, ""));
    } else if (typeof product.discountedPrice === "number") {
      price = product.discountedPrice;
    } else {
      console.error(
        `Invalid discountedPrice for productId ${parsedProductId}:`,
        product.discountedPrice
      );
      return res.status(500).json({ message: "Invalid product price" });
    }

    if (isNaN(price)) {
      console.error(
        `Failed to parse price for productId ${parsedProductId}:`,
        product.discountedPrice
      );
      return res.status(500).json({ message: "Unable to parse product price" });
    }

    // Validate quantity
    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      console.error("Invalid quantity:", quantity);
      return res
        .status(400)
        .json({ message: "quantity must be a positive integer" });
    }

    // Log data before query
    const queryData = [
      userId,
      parsedProductId,
      product.title,
      product.imageUrl,
      price,
      product.brand,
      parsedQuantity,
      size || null,
      customId || null,
      parsedQuantity,
    ];
    console.log("Executing query with data:", queryData);

    const query = `
      INSERT INTO carts (user_id, product_id, title, image_url, discounted_price, brand, quantity, size, custom_id, added_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE quantity = quantity + ?
    `;
    db.query(query, queryData, (err, result) => {
      if (err) {
        console.error("Database Error in INSERT:", err);
        return res
          .status(500)
          .json({ message: "Database error: " + err.message });
      }
      console.log(
        `Added to cart - Cart ID: ${result.insertId || "updated existing"}`
      );
      res
        .status(201)
        .json({ message: "Added to cart", cartId: result.insertId });
    });
  });
});

// Get cart items
app.get("/api/cart/:userId", (req, res) => {
  const { userId } = req.params;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    if (decoded.userId !== parseInt(userId))
      return res.status(403).json({ message: "Unauthorized" });

    const query = `
      SELECT 
        c.cart_id,
        c.user_id,
        c.product_id,
        c.title,
        c.image_url,
        c.discounted_price,
        c.brand,
        c.quantity,
        c.size,
        c.custom_id,
        cp.customization_details
      FROM carts c
      LEFT JOIN customized_products cp ON c.custom_id = cp.custom_id
      WHERE c.user_id = ?
    `;
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Database Error in SELECT:", err);
        return res
          .status(500)
          .json({ message: "Database error: " + err.message });
      }
      console.log("Raw query results for userId", userId, ":", results);
      const cartItems = results.map((item) => {
        let parsedDetails = null;
        if (item.customization_details) {
          // Check if customization_details is already an object
          if (
            typeof item.customization_details === "object" &&
            item.customization_details !== null
          ) {
            parsedDetails = item.customization_details;
          } else {
            // Only parse if it's a string
            try {
              parsedDetails =
                typeof item.customization_details === "string"
                  ? JSON.parse(item.customization_details)
                  : item.customization_details;
            } catch (parseError) {
              console.error(
                `Failed to parse customization_details for custom_id ${item.custom_id}:`,
                parseError
              );
              parsedDetails = { error: "Invalid customization details" };
            }
          }
        }
        return {
          ...item,
          customization_details: parsedDetails,
        };
      });
      console.log("Processed cart items for userId", userId, ":", cartItems);
      res.json(cartItems);
    });
  });
});

// Update cart item quantity
app.put("/api/cart/:cartId", (req, res) => {
  const { cartId } = req.params;
  const { quantity } = req.body;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  console.log("PUT /api/cart/:cartId - Received:", { cartId, quantity });

  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err.message);
      return res.status(401).json({ message: "Invalid token" });
    }

    console.log("Authenticated userId:", decoded.userId);

    const query =
      "UPDATE carts SET quantity = ? WHERE cart_id = ? AND user_id = ?";
    db.query(query, [quantity, cartId, decoded.userId], (err, result) => {
      if (err) {
        console.error("Database Error in UPDATE:", err);
        return res
          .status(500)
          .json({ message: "Database error: " + err.message });
      }
      if (result.affectedRows === 0) {
        console.log(
          "No rows updated for cartId:",
          cartId,
          "userId:",
          decoded.userId
        );
        return res
          .status(404)
          .json({ message: "Cart item not found or unauthorized" });
      }
      console.log("Quantity updated successfully for cartId:", cartId);
      res.json({ message: "Quantity updated" });
    });
  });
});

// Delete cart item
app.delete("/api/cart/:cartId", (req, res) => {
  const { cartId } = req.params;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    const query = "DELETE FROM carts WHERE cart_id = ? AND user_id = ?";
    db.query(query, [cartId, decoded.userId], (err, result) => {
      if (err) {
        console.error("Database Error in DELETE:", err);
        return res
          .status(500)
          .json({ message: "Database error: " + err.message });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Cart item not found or unauthorized" });
      }
      res.json({ message: "Item removed from cart" });
    });
  });
});

// Order endpoints
app.get("/api/orders/:userId", (req, res) => {
  const { userId } = req.params;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    if (decoded.userId !== parseInt(userId))
      return res.status(403).json({ message: "Unauthorized" });

    const query = `
      SELECT 
        o.order_id, 
        o.total_amount, 
        o.status, 
        o.created_at, 
        o.delivered_at,
        oi.order_item_id, 
        oi.product_id, 
        oi.quantity, 
        oi.price, 
        oi.custom_id,
        oi.size,
        a.address_line1, 
        a.address_line2, 
        a.city, 
        a.state, 
        a.postal_code, 
        a.country
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN addresses a ON o.address_id = a.address_id
      WHERE o.user_id = ?
    `;
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Database Error in SELECT:", err);
        return res
          .status(500)
          .json({ message: "Database error: " + err.message });
      }
      const orders = results.reduce((acc, row) => {
        if (!acc[row.order_id]) {
          acc[row.order_id] = {
            order_id: row.order_id,
            total_amount: row.total_amount,
            status: row.status,
            created_at: row.created_at,
            delivered_at: row.delivered_at, // Added delivered_at
            address: {
              address_line1: row.address_line1,
              address_line2: row.address_line2,
              city: row.city,
              state: row.state,
              postal_code: row.postal_code,
              country: row.country,
            },
            items: [],
          };
        }
        const product =
          allProducts.find((p) => p.product_id === row.product_id) || {};
        acc[row.order_id].items.push({
          order_item_id: row.order_item_id,
          product_id: row.product_id,
          quantity: row.quantity,
          price: row.price,
          title: product.title || "Unknown Product",
          image_url: product.imageUrl || "https://via.placeholder.com/150",
          size: row.size || product.size || "N/A",
          brand: product.brand || "N/A",
          custom_id: row.custom_id,
        });
        return acc;
      }, {});
      console.log("Orders fetched for userId:", userId, Object.values(orders));
      res.json(Object.values(orders));
    });
  });
});

// Address endpoints
app.post("/api/addresses", (req, res) => {
  const {
    userId,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
    is_default,
  } = req.body;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    if (decoded.userId !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    if (!address_line1 || !city || !state || !postal_code || !country) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const query =
      "INSERT INTO addresses (user_id, address_line1, address_line2, city, state, postal_code, country, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(
      query,
      [
        userId,
        address_line1,
        address_line2 || null,
        city,
        state,
        postal_code,
        country,
        is_default || 0,
      ],
      (err, result) => {
        if (err) {
          console.error("Database Error in INSERT:", err);
          return res
            .status(500)
            .json({ message: "Database error: " + err.message });
        }
        res.status(201).json({
          message: "Address added",
          address: { id: result.insertId, ...req.body },
        });
      }
    );
  });
});

// Cancel an order
app.put("/api/orders/:orderId/cancel", authenticateToken, async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.userId;

  console.log("Cancel request - orderId:", orderId, "userId:", userId);

  try {
    const connection = await db.promise().getConnection();
    try {
      // Check if the order exists and belongs to the user
      const [orderRows] = await connection.query(
        "SELECT status FROM orders WHERE order_id = ? AND user_id = ?",
        [orderId, userId]
      );

      console.log("Query result rows:", orderRows);

      if (!orderRows.length) {
        return res.status(404).json({ message: "Order not found or unauthorized" });
      }

      const currentStatus = orderRows[0].status;

      // Prevent cancellation if already delivered or cancelled
      if (currentStatus === "delivered") {
        return res.status(400).json({ message: "Cannot cancel a delivered order" });
      }
      if (currentStatus === "cancelled") {
        return res.status(400).json({ message: "Order is already cancelled" });
      }

      // Update the order status to 'cancelled'
      await connection.query(
        "UPDATE orders SET status = 'cancelled' WHERE order_id = ?",
        [orderId]
      );

      await connection.commit();
      res.json({ message: "Order cancelled successfully" });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error cancelling order:", error.message);
    res.status(500).json({ message: "Error cancelling order", error: error.message });
  }
});

app.get("/api/addresses/:userId", (req, res) => {
  const { userId } = req.params;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    if (decoded.userId !== parseInt(userId))
      return res.status(403).json({ message: "Unauthorized" });

    const query = "SELECT * FROM addresses WHERE user_id = ?";
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Database Error in SELECT:", err);
        return res
          .status(500)
          .json({ message: "Database error: " + err.message });
      }
      res.json(results);
    });
  });
});

// Create Razorpay order
app.post("/api/payment/orders", authenticateToken, async (req, res) => {
  const { userId, addressId } = req.body;

  if (req.user.userId !== parseInt(userId)) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const connection = await db.promise().getConnection();
    try {
      const [cartResults] = await connection.query(
        "SELECT cart_id, product_id, quantity, discounted_price, custom_id, size FROM carts WHERE user_id = ?",
        [userId]
      );

      if (!cartResults.length) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      const items = cartResults.map((item) => ({
        productId: item.product_id,
        quantity: item.quantity,
        price: parseFloat(item.discounted_price) || 0,
        customId: item.custom_id,
        size: item.size,
      }));

      const totalAmount =
        items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100;

      if (totalAmount <= 0) {
        return res.status(400).json({ message: "Invalid total amount" });
      }

      const options = {
        amount: totalAmount,
        currency: "INR",
        receipt: `order_rcptid_${userId}_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      res.json({
        orderId: order.id,
        totalAmount: totalAmount / 100,
        currency: "INR",
        items,
        addressId,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error in /api/payment/orders:", error.message);
    res
      .status(500)
      .json({ message: "Error creating payment order", error: error.message });
  }
});

// Verify Razorpay payment
app.post("/api/payment/verify", authenticateToken, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
    addressId,
    items,
  } = req.body;

  console.log("Received /api/payment/verify request:", {
    razorpay_order_id,
    razorpay_payment_id,
    userId,
    addressId,
    itemsCount: items?.length,
  });

  if (req.user.userId !== parseInt(userId)) {
    console.error("Unauthorized: userId mismatch", {
      reqUserId: req.user.userId,
      userId,
    });
    return res.status(403).json({ message: "Unauthorized" });
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    console.error("Signature mismatch:", {
      generatedSignature,
      razorpay_signature,
    });
    return res.status(400).json({ message: "Payment verification failed" });
  }

  let connection;
  try {
    connection = await db.promise().getConnection();
    console.log("Database connection acquired");

    await connection.beginTransaction();

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("Invalid or empty items array:", items);
      throw new Error("Invalid or empty items array");
    }

    const totalAmount = items.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      if (isNaN(price) || isNaN(quantity)) {
        console.error("Invalid price or quantity in item:", item);
        throw new Error(
          `Invalid price or quantity in item: ${JSON.stringify(item)}`
        );
      }
      return sum + price * quantity;
    }, 0);
    if (totalAmount <= 0) {
      console.error("Invalid total amount calculated:", totalAmount);
      throw new Error("Invalid total amount");
    }

    const [addressRows] = await connection.query(
      "SELECT address_id FROM addresses WHERE address_id = ? AND user_id = ?",
      [addressId, userId]
    );
    if (!addressRows.length) {
      console.error("Invalid address ID:", addressId);
      throw new Error("Invalid address ID");
    }

    // Set initial status to 'placed'
    console.log("Inserting into orders table with values:", {
      userId,
      addressId,
      totalAmount,
      status: "placed",
    });
    const [orderResult] = await connection.query(
      "INSERT INTO orders (user_id, address_id, total_amount, status, created_at) VALUES (?, ?, ?, ?, NOW())",
      [userId, addressId, totalAmount, "placed"]
    );
    const orderId = orderResult.insertId;
    console.log("Order inserted successfully, orderId:", orderId);

    const orderItems = items.map((item) => {
      const productId = parseInt(item.productId);
      const quantity = parseInt(item.quantity);
      const price = parseFloat(item.price);
      const customId = item.customId ? parseInt(item.customId) : null;
      const size = item.size || null;

      if (
        !productId ||
        !quantity ||
        !price ||
        isNaN(productId) ||
        isNaN(quantity) ||
        isNaN(price)
      ) {
        console.error("Invalid item data:", item);
        throw new Error(`Invalid item data: ${JSON.stringify(item)}`);
      }

      return [orderId, productId, customId, quantity, price, size];
    });
    console.log("Inserting into order_items table:", orderItems);
    await connection.query(
      "INSERT INTO order_items (order_id, product_id, custom_id, quantity, price, size) VALUES ?",
      [orderItems]
    );
    console.log("Order items inserted successfully");

    console.log("Clearing cart for userId:", userId);
    const [cartDeleteResult] = await connection.query(
      "DELETE FROM carts WHERE user_id = ?",
      [userId]
    );
    console.log("Cart cleared, rows affected:", cartDeleteResult.affectedRows);

    await connection.commit();
    console.log("Payment verified successfully, orderId:", orderId);
    res.json({
      success: true,
      message: "Payment verified and order placed successfully",
      orderId,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
      console.error("Transaction rolled back due to error");
    }
    console.error("Payment verification error:", {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
    });
    res
      .status(500)
      .json({ message: "Error processing payment", error: error.message });
  } finally {
    if (connection) {
      connection.release();
      console.log("Database connection released");
    }
  }
});

// Validate token endpoint
app.get("/api/validate-token", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    const query = "SELECT * FROM users WHERE user_id = ?";
    db.query(query, [decoded.userId], (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Database error: " + err.message });
      if (results.length === 0)
        return res.status(401).json({ message: "User not found" });

      const user = results[0];
      res.json({
        user: {
          userId: user.user_id,
          email: user.email,
          name: user.name,
          phone_number: user.phone_number,
          provider: user.provider,
          picture: user.picture,
        },
      });
    });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
