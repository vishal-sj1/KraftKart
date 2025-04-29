const mysql = require("mysql2");
// Adjust the paths to point to your data files in E:\KraftKart-FrontEnd\src\customer\data
const { tees } = require("../src/customer/data/tees");
const { hoodies } = require("../src/customer/data/hoodies");
const { caps } = require("../src/customer/data/cap");
const { mobilecover } = require("../src/customer/data/mobilecover");
const { mugs } = require("../src/customer/data/mugs");
const { keychain } = require("../src/customer/data/keychain");
require("dotenv").config();

// Combine all product data into a single array
const allProducts = [
  ...tees,
  ...hoodies,
  ...caps,
  ...mobilecover,
  ...mugs,
  ...keychain,
];

// Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: "kraftkart",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to MySQL database");

  // Clear the products table (optional, remove if you don't want to clear existing data)
  db.query((err) => {
    console.log("Products table cleared");

    // Prepare the SQL query for inserting products
    const query = `
      INSERT INTO products (
        image_url, brand, title, colour, discounted_price, price, percentage_discount,
        size, stock, top_level_category, second_level_category, third_level_category,
        description, slug
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Insert each product into the database
    allProducts.forEach((product) => {
      const values = [
        product.imageUrl,
        product.brand,
        product.title,
        product.colour,
        parseFloat(product.discountedPrice.replace("₹", "")), // Remove ₹ and convert to number
        parseFloat(product.price.replace("₹", "")), // Remove ₹ and convert to number
        parseFloat(product.percentage.replace("%", "")), // Remove % and convert to number
        JSON.stringify(Array.isArray(product.size) ? product.size : [product.size]), // Ensure size is a JSON array
        product.quantity,
        product.topLevelCategory,
        product.secondLevelCategory,
        product.thirdLevelCategory,
        product.description,
        product.title.toLowerCase().replace(/\s+/g, "-"), // Generate slug
      ];

      db.query(query, values, (err, result) => {
        if (err) {
          console.error("Error inserting product:", product.title, err);
          return;
        }
        console.log(`Inserted product: ${product.title}`);
      });
    });

    // Close the database connection after all inserts
    setTimeout(() => {
      db.end();
      console.log("Database connection closed. Migration complete!");
    }, 2000); // Delay to ensure all queries are executed
  });
});