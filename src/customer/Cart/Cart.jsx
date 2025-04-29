import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid as Grid2 } from "@mui/material";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CartItem from "./CartItem";

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user?.userId) {
        setIsLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get(
          `http://localhost:5000/api/cart/${user.userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Fetched cart items:", response.data);
        setCartItems(response.data);
      } catch (error) {
        console.error(
          "Error fetching cart items:",
          error.response?.data?.message || error.message
        );
        alert("Failed to load cart items. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();

    // Listen for cart updates
    const handleCartUpdate = () => {
      fetchCartItems();
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [user?.userId]);

  const handleRemoveFromCart = async (cartId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.delete(
        `http://localhost:5000/api/cart/${cartId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Remove response:", response.data);
      setCartItems(cartItems.filter((item) => item.cart_id !== cartId));
      window.dispatchEvent(new Event("cartUpdated"));
      return Promise.resolve();
    } catch (error) {
      console.error(
        "Error removing from cart:",
        error.response?.data?.message || error.message
      );
      throw new Error("Failed to remove item from cart");
    }
  };

  const handleUpdateQuantity = async (cartId, newQuantity) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      console.log(`Updating quantity for cartId ${cartId} to ${newQuantity}`);
      const response = await axios.put(
        `http://localhost:5000/api/cart/${cartId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Update response:", response.data);
      const refreshResponse = await axios.get(
        `http://localhost:5000/api/cart/${user.userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCartItems(refreshResponse.data);
      window.dispatchEvent(new Event("cartUpdated"));
      return Promise.resolve();
    } catch (error) {
      console.error(
        "Error updating quantity:",
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to update quantity"
      );
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout?step=1");
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 6 }}>
        <Typography variant="h5" className="text-[#1C2526] text-center">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!cartItems.length) {
    return (
      <Box sx={{ p: 6 }}>
        <Typography variant="h5" className="text-[#1C2526] text-center">
          Your Cart is Empty
        </Typography>
      </Box>
    );
  }

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        const price =
          typeof item.discounted_price === "string"
            ? parseFloat(item.discounted_price.replace(/[^0-9.-]+/g, ""))
            : item.discounted_price;
        return total + price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  return (
    <Box className="bg-[#F8FAFC] p-6">
      <Typography variant="h4" gutterBottom className="text-[#1C2526] font-bold">
        Shopping Cart
      </Typography>
      <Grid2 container spacing={3}>
        {cartItems.map((item) => (
          <Grid2 item xs={12} key={item.cart_id}>
            <CartItem
              item={item}
              onRemove={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
            />
          </Grid2>
        ))}
      </Grid2>
      <Box sx={{ mt: 6, textAlign: "right" }}>
        <Typography variant="h6" className="text-[#1C2526]">
          Total: ₹{calculateTotal()}
        </Typography>
        <Button
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: "#2B6CB0",
            "&:hover": { backgroundColor: "#60A5FA" },
          }}
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </Button>
      </Box>
    </Box>
  );
};

export default Cart;