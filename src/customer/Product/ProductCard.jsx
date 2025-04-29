import React from "react";
import "./ProductCard.css";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const productId = product.title.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link to={`/product/${productId}`} className="no-underline text-[#F5F5F5]">
      <div className="productCard w-[15rem] m-3 transition-all cursor-pointer bg-[#b6b4b4] h-[26rem] flex flex-col mb-10 border border-[#0F0F0F]/20 hover:shadow-xl">
        <div className="h-[20rem] flex-shrink-0">
          <img
            className="h-full w-full object-cover object-center"
            src={product.imageUrl}
            alt={product.title}
          />
        </div>

        <div className="textPart bg-[#4A4A4A] p-3 flex-grow flex flex-col justify-between">
          <div>
            <p className="font-bold text-[#F5F5F5] truncate">{product.title}</p>
            <p className="text-[#B0B0B0] line-clamp-2">{product.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="font-semibold text-[#FF6F61]">{product.discountedPrice}</p>
            <p className="line-through text-[#B0B0B0] opacity-50">{product.price}</p>
            <p className="text-[#39FF14] font-semibold">{product.percentage}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;