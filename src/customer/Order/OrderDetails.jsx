import React, { useEffect, useState } from "react";
import AddressCard from "../AddressCard/AddressCard";
import OrderTracker from "./OrderTracker";
import { Box, Grid as Grid2, Button } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const OrderDetails = () => {
  const { id, itemIndex } = useParams();
  const [order, setOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user) {
        console.log("No user logged in");
        setLoading(false);
        return;
      }

      if (!id || id === "undefined") {
        console.log("Invalid order ID:", id);
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        console.log(
          "Fetching order details for userId:",
          user.userId,
          "orderId:",
          id
        );
        const response = await axios.get(
          `http://localhost:5000/api/orders/${user.userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Order details response:", response.data);
        const formattedId = parseInt(decodeURIComponent(id), 10);
        const foundOrder = response.data.find(
          (o) => o.order_id === formattedId
        );

        if (foundOrder && itemIndex !== undefined) {
          const index = parseInt(itemIndex, 10);
          if (index >= 0 && index < foundOrder.items.length) {
            setSelectedItem(foundOrder.items[index]);
            setOrder(foundOrder);
            console.log(
              "Found order:",
              foundOrder,
              "Selected item:",
              foundOrder.items[index]
            );
          } else {
            console.log("Invalid item index:", index);
            setSelectedItem(null);
          }
        } else {
          console.log("Order not found for ID:", formattedId);
          setSelectedItem(null);
        }
      } catch (error) {
        console.error("Error fetching order details:", error.message);
        setOrder(null);
        setSelectedItem(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, itemIndex, user]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }
  
    console.log("Attempting to cancel order - id:", id, "userId:", user.userId);
  
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
  
      const response = await axios.put(
        `http://localhost:5000/api/orders/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Cancel order response:", response.data);
  
      // Refresh order data after cancellation
      const updatedResponse = await axios.get(
        `http://localhost:5000/api/orders/${user.userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const formattedId = parseInt(decodeURIComponent(id), 10);
      const foundOrder = updatedResponse.data.find(
        (o) => o.order_id === formattedId
      );
  
      if (foundOrder && itemIndex !== undefined) {
        const index = parseInt(itemIndex, 10);
        if (index >= 0 && index < foundOrder.items.length) {
          setSelectedItem(foundOrder.items[index]);
          setOrder(foundOrder);
          console.log("Updated order after cancellation:", foundOrder);
        }
      }
  
      alert("Order cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling order:", error.message);
      let errorMessage = error.response?.data?.message || error.message;
      if (error.response?.status === 404) {
        errorMessage = "Order not found or you are not authorized to cancel it.";
      }
      alert(`Failed to cancel order: ${errorMessage}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading)
    return (
      <div className="text-center py-10 text-[#1E3A3A]">
        Loading order details...
      </div>
    );
  if (!user)
    return (
      <div className="text-center py-10 text-[#1E3A3A]">
        Please log in to view order details.
      </div>
    );
  if (!id || id === "undefined")
    return (
      <div className="text-center py-10 text-[#1E3A3A]">Invalid order ID.</div>
    );
  if (!order || !selectedItem)
    return (
      <div className="text-center py-10 text-[#1E3A3A]">
        No order or item found for ID: {id}, Item Index: {itemIndex}
      </div>
    );

  const expectedDelivery = order.created_at
    ? formatDate(
        new Date(new Date(order.created_at).getTime() + 7 * 24 * 60 * 60 * 1000)
      )
    : "N/A";

  return (
    <div className="bg-[#F7FAFA] px-5 lg:px-20 py-5">
      <div className="space-y-6">
        <h1 className="font-semibold text-lg text-[#1E3A3A] py-4">
          Order Details
        </h1>
        <div className="space-y-2">
          <p className="text-[#1E3A3A]">Order ID: {order.order_id}</p>
          <p className="text-[#1E3A3A]">Status: {order.status}</p>
          <p className="text-[#64748B]">
            Placed On: {formatDate(order.created_at)}
          </p>
          {order.status === "delivered" && (
            <p className="text-[#64748B]">
              Delivered On: {formatDate(order.delivered_at)}
            </p>
          )}
          {order.status === "cancelled" && (
            <p className="text-[#EF4444]">Order Cancelled</p>
          )}
          {order.status !== "delivered" && order.status !== "cancelled" && (
            <p className="text-[#64748B]">
              Expected Delivery: {expectedDelivery}
            </p>
          )}
        </div>
        <div>
          <h1 className="font-semibold text-lg text-[#1E3A3A] py-4">
            Delivery Address
          </h1>
          <AddressCard address={order.address} />
        </div>
        <div className="py-10">
          <OrderTracker status={order.status} />
        </div>
        <Grid2 container spacing={2} className="space-y-5">
          <Grid2
            item
            xs={12}
            className="shadow-lg rounded-md p-5 border border-[#CBD5E1]"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Grid2 item xs={8}>
              <div className="flex items-center space-x-4">
                <img
                  className="ml-5 w-[5rem] h-auto object-cover object-top rounded"
                  src={selectedItem.image_url}
                  alt={selectedItem.title}
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/150")
                  }
                />
                <div className="space-y-2 ml-5">
                  <p className="font-semibold text-[#1E3A3A]">
                    {selectedItem.title}
                  </p>
                  <p className="space-x-5 opacity-50 text-xs font-semibold text-[#64748B]">
                    <span>Size: {selectedItem.size || "N/A"}</span>
                    <span>Quantity: {selectedItem.quantity}</span>
                  </p>
                  <p className="text-[#64748B]">
                    Seller: {selectedItem.brand || "N/A"}
                  </p>
                  <p className="text-[#1E3A3A]">₹{selectedItem.price}</p>
                </div>
              </div>
            </Grid2>
            <Grid2 item>
              <Box sx={{ color: "#38A3A5" }}>
                <StarBorderIcon sx={{ fontSize: "2rem" }} className="px-2" />
                <span className="text-sm">Rate & Review Product</span>
              </Box>
            </Grid2>
          </Grid2>
        </Grid2>
        <div className="mt-5">
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelOrder}
            sx={{
              mt: 2,
              backgroundColor: "#EF4444",
              "&:hover": { backgroundColor: "#F87171" },
            }}
            disabled={
              order.status === "delivered" || order.status === "cancelled"
            }
          >
            Cancel Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;