import React, { useEffect, useState } from "react";
import OrderCard from "./OrderCard";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const orderStatus = [
  { label: "Placed", value: "placed" },
  { label: "Order Confirmed", value: "Order Confirmed" },
  { label: "Shipped", value: "Shipped" },
  { label: "Out For Delivery", value: "Out For Delivery" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        console.log("No user logged in");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        console.log("Fetching orders for userId:", user.userId);
        const response = await axios.get(`http://localhost:5000/api/orders/${user.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Fetched orders:", response.data);
        setOrders(response.data);
        setFilteredOrders(response.data); // Initially show all orders
      } catch (error) {
        console.error("Error fetching orders:", error.message);
        setOrders([]);
        setFilteredOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  useEffect(() => {
    // Filter orders based on selected statuses
    if (selectedStatuses.length === 0) {
      setFilteredOrders(orders); // Show all if no filters selected
    } else {
      setFilteredOrders(
        orders.filter((order) =>
          selectedStatuses.includes(order.status)
        )
      );
    }
  }, [selectedStatuses, orders]);

  const handleStatusChange = (value) => {
    setSelectedStatuses((prev) =>
      prev.includes(value)
        ? prev.filter((status) => status !== value)
        : [...prev, value]
    );
  };

  if (loading) return <div className="text-center py-10 text-[#1E3A3A]">Loading orders...</div>;
  if (!user) return <div className="text-center py-10 text-[#1E3A3A]">Please log in to view your orders.</div>;

  console.log("Rendering filtered orders:", filteredOrders);

  return (
    <div className="bg-[#F7FAFA] min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 lg:p-12">
        {/* Filter Sidebar */}
        <div className="md:col-span-3 sticky top-6 h-auto">
          <div className="w-full shadow-lg bg-white p-6 rounded-lg border border-[#CBD5E1]">
            <h1 className="font-bold text-lg text-[#1E3A3A]">Filter</h1>
            <div className="space-y-4 mt-6">
              <h1 className="font-semibold text-[#1E3A3A]">ORDER STATUS</h1>
              {orderStatus.map((option) => (
                <div className="flex items-center" key={option.value}>
                  <input
                    type="checkbox"
                    id={option.value}
                    checked={selectedStatuses.includes(option.value)}
                    onChange={() => handleStatusChange(option.value)}
                    className="h-4 w-4 text-[#38A3A5] border-[#CBD5E1] focus:ring-[#7EDAD9] focus:ring-2 rounded"
                  />
                  <label
                    className="ml-3 text-sm text-[#64748B]"
                    htmlFor={option.value}
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Order List */}
        <div className="md:col-span-9 space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) =>
              order.items.map((item, index) => (
                <OrderCard key={`${order.order_id}-${index}`} order={order} item={item} />
              ))
            )
          ) : (
            <p className="font-semibold text-3xl text-[#D97706] text-center py-10">
              No orders found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;