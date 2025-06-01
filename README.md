# React + Vite

KraftKart Admin & Customer Dashboard

Project Overview
KraftKart consists of two separate web applications: an Admin Dashboard for managing sales and order data, and a Customer Dashboard for user interactions. Both are built using modern web technologies, with the Admin Dashboard focusing on sales visualization and order statistics, and the Customer Dashboard handling user-specific features. The projects share a common MySQL database.

Features
Admin Dashboard:
Sales visualization with line charts.
User filtering for sales data.
Display of total and pending orders (status: Placed).
Responsive design.

Customer Dashboard:
User-specific features (to be defined based on your implementation).
Responsive interface.

Technologies Used
Frontend: Vite + React, Chart.js (Admin), Axios, Tailwind CSS
Backend: Node.js, Express.js
Database: MySQL
Version Control: Git

Project Structure

/admin/: Contains the Admin Dashboard.
admin/backend/: Node.js/Express server for admin APIs.
admin/frontend/: Vite + React frontend for the admin interface.


../customer/: Contains the Customer Dashboard.
../customer/backend/: Node.js/Express server for customer APIs.
../customer/frontend/: Vite + React frontend for the customer interface.



Prerequisites
Before setting up the project, ensure you have the following installed on your machine:

Node.js (v16 or higher)
MySQL (v8 or higher)
Git
A code editor (e.g., VS Code)

Setup Instructions
1. Clone the Repository
Clone the project to your local machine using Git:
git clone <repository-url>
cd Project-Name

2. Set Up the Database

Run the following command to create the database:CREATE DATABASE kraftkart;

Create the Tables:
Use the database:USE kraftkart;

Create the tables using the SQL schema provided below in the Database Schema section.

Note: Make purchase after the project is finished with setting  it up OR Insert sample data into the users or and orders tables to see the dashboards in action. For example:INSERT INTO users (email, name, password, provider) VALUES ('user@example.com', 'ABC XYZ', 'password123', 'manual');
INSERT INTO orders (user_id, address_id, total_amount, status, created_at) VALUES (1, 1, 1470.00, 'placed', '2025-03-16 18:30:00');

3. Admin Dashboard Setup

Navigate to the Admin Backend:
cd admin/backend

Install Backend Dependencies:
npm install

Configure the Database Connection:

Open server.js and update the MySQL connection details:const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your-mysql-password', // Replace with your MySQL password
  database: 'kraftkart'
});

Start the Admin Backend Server:
node server.js

The server should run on http://localhost:5001.

Navigate to the Admin Frontend:
cd into the main project folder

Install Frontend Dependencies:
npm install

Start the Admin Frontend Development Server:
npm run dev

The frontend should run on http://localhost:5174 (or another port; check the terminal output).

4. Customer Dashboard Setup

Navigate to the Customer Backend:
cd kraftkart-frontend/backend

Install Backend Dependencies:
npm install

Configure the Database Connection:
Open server.js and update the MySQL connection details (similar to the admin setup).

Start the Customer Backend Server:
node server.js

The server should run on a different port (e.g., http://localhost:5002; adjust if needed).

Navigate to the Customer Frontend:
cd ../kraftkart-frontend

Install Frontend Dependencies:
npm install

Start the Customer Frontend Development Server:
npm run dev

The frontend should run on http://localhost:5173 (or another port; check the terminal output).

5. Access the Dashboards

Admin Dashboard: Open your browser and navigate to http://localhost:5174.
Customer Dashboard: Open your browser and navigate to http://localhost:5173.
Use the "Filter by User" dropdown on the Admin Dashboard to view sales data for specific users.

Database Schema
The project uses a MySQL database named kraftkart with the following tables:
Tables Overview

addresses: Stores user addresses.
carts: Manages user cart items.
customized_products: Stores details of customized products.
order_items: Contains items within each order.
orders: Tracks order details.
users: Stores user information.

SQL to Create Tables
Run the following SQL commands to create the tables:
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255),
  provider ENUM('manual', 'google') DEFAULT 'manual',
  picture VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  phone_number VARCHAR(15)
);

CREATE TABLE addresses (
  address_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  is_default TINYINT(1) DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  address_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'placed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivered_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (address_id) REFERENCES addresses(address_id)
);

CREATE TABLE customized_products (
  custom_id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  customization_details JSON,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE order_items (
  order_item_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT,
  custom_id INT,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  size VARCHAR(10),
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (custom_id) REFERENCES customized_products(custom_id)
);

CREATE TABLE carts (
  cart_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  image_url VARCHAR(255),
  discounted_price DECIMAL(10,2) NOT NULL,
  brand VARCHAR(100),
  custom_id INT,
  quantity INT NOT NULL,
  size VARCHAR(10),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (custom_id) REFERENCES customized_products(custom_id)
);

Troubleshooting

Server Not Running: If you see "Failed to load stats/data," ensure the backend servers are running on ports 5001 (Admin) and 5002 (Customer).
Empty Chart: Verify that the orders table has data. Insert sample orders if needed.
CORS Issues: Ensure the cors middleware in both admin/backend/server.js and customer/backend/server.js includes the respective frontend ports (e.g., http://localhost:5174 for Admin, http://localhost:5173 for Customer).
Port Conflicts: If ports 5001, 5002, 5173, or 5174 are in use, adjust them in the respective server.js files and Vite configuration.

Future Enhancements

Add real-time data updates using WebSockets.
Implement order status updates in the Admin Dashboard.
Enhance the Customer Dashboard with cart and order management features.
Optimize UI for mobile devices.

Contributing
Feel free to fork this repository, make improvements, and submit a pull request. For major changes, please open an issue first to discuss your ideas.
