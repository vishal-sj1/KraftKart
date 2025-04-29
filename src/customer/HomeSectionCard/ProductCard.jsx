import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, isMiddle }) => {
  const productId = product.title.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link to={`/product/${productId}`} className="no-underline text-inherit">
      <div
        className={`cursor-pointer flex flex-col items-center bg-[#E8ECEF] rounded-lg shadow-md overflow-hidden w-[15rem] mx-4 border border-[#0F0F0F]/20 hover:shadow-xl transition-all duration-500 ${
          isMiddle ? "scale-110 z-10 shadow-lg" : "scale-100"
        }`}
      >
        <div className="h-[13rem] w-[10rem] relative">
          <img
            className={`object-cover object-top w-full h-full transition-opacity duration-300 ${
              isMiddle ? "opacity-100" : "opacity-80"
            }`}
            src={product.imageUrl}
            alt={product.title}
          />
          {/* Overlay on Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-[#baf0f0]/30">
            <span className="text-[#ebb687] text-sm font-semibold">View Details</span>
          </div>
        </div>
        <div className="p-4 text-center">
          <h3 className="text-lg font-semibold text-[#1A1A1A]">{product.brand}</h3>
          <p className="mt-2 text-sm text-[#4A4A4A] line-clamp-2">{product.title}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;