import React from "react";
import AddressCard from "../AddressCard/AddressCard";
import Cart from "../Cart/Cart";

const OrderSummary = ({ selectedAddress }) => {
  return (
    <div className="bg-[#F9FBFD]">
      <div className="p-5 sm:ml-7 lg:ml-15 mr-9 mb-10 shadow-lg rounded-md border border-[#CBD5E0] bg-white hover:bg-[#E6F0FA] transition-colors">
        <AddressCard address={selectedAddress} />
      </div>
      <Cart />
    </div>
  );
};

export default OrderSummary;