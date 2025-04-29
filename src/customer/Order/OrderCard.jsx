import React from "react";
import AdjustIcon from "@mui/icons-material/Adjust";
import { useNavigate } from "react-router-dom";

const OrderCard = ({ order, item }) => {
  const navigate = useNavigate();

  const itemIndex = order.items.findIndex(
    (i) => i.order_item_id === item.order_item_id
  );

  const navigateToDetails = () => {
    console.log(
      "Navigating to order:",
      order.order_id,
      "Item Index:",
      itemIndex
    );
    navigate(`/orders/${encodeURIComponent(order.order_id)}/${itemIndex}`);
  };

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate expected delivery (e.g., 7 days from created_at)
  const expectedDelivery = order.created_at
    ? formatDate(
        new Date(new Date(order.created_at).getTime() + 7 * 24 * 60 * 60 * 1000)
      )
    : "N/A";

  return (
    <div
      onClick={navigateToDetails}
      className="p-5 shadow-md shadow-[#5A9E9F] hover:shadow-2xl mb-3 mr-5 border border-[#dcdbdb] cursor-pointer"
    >
      <div className="grid md:grid-cols-3 grid-cols-1 gap-2 justify-items-normal">
        <div className="flex cursor-pointer md:flex-row flex-col">
          <img
            className="mt-1 w-[5rem] h-[5rem] object-cover object-top"
            src={item.image_url}
            alt={item.title}
            onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
          />
          <div className="lg:ml-5 mt-5 space-y-2 md:mt-0 md:ml-5 sm:ml-0">
            <p className="font-semibold">{item.title}</p>
            <p className="opacity-50 text-xs font-semibold">
              Order ID: {order.order_id}
            </p>
            <p className="opacity-50 text-xs font-semibold">
              Size: {item.size || "N/A"}
            </p>
            <p className="opacity-50 text-xs font-semibold">
              Quantity: {item.quantity}
            </p>
            <p className="opacity-50 text-xs font-semibold">
              Brand: {item.brand || "N/A"}
            </p>
            <p className="opacity-50 text-xs font-semibold">
              Placed On: {formatDate(order.created_at)}
            </p>
          </div>
        </div>
        <div className="text-lg font-bold md:mt-0 mt-5">₹{item.price}</div>
        <div className="text-lg opacity-70 md:mt-0 mt-5">
          <p className="font-semibold">Status: {order.status}</p>
          {order.status === "delivered" ? (
            <div>
              <p>
                <AdjustIcon
                  sx={{ width: "15px", height: "15px" }}
                  className="text-green-600 mr-2 text-sm"
                />
                <span>Delivered On {formatDate(order.delivered_at)}</span>
              </p>
              <p className="text-sm">Your Item Has Been Delivered</p>
            </div>
          ) : order.status === "cancelled" ? (
            <p className="text-red-600">Order Cancelled</p>
          ) : (
            <p>
              <span>Expected Delivery on {expectedDelivery}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;