import React from "react";
import MainCarousel from "../../HomeCarousel/MainCarousel";
import ProductCarousel from "../../ProductCarousel/ProductCarousel";
import About from "../About/About";
import { tees } from "../../data/tees";
import { hoodies } from "../../data/hoodies";

export default function HomePage() {
  return (
    <div className="w-full bg-[#E8ECEF]">
      <MainCarousel />
      <div className="space-y-12 py-20 flex flex-col justify-start px-5 lg:px-10">
        <h1
          style={{ fontFamily: "Winky sans" }}
          className="text-center text-5xl font-medium text-[#0F0F0F]"
        >
          Featured Products
        </h1>
        <ProductCarousel data={tees} sectionName="T-shirts" />
        <ProductCarousel data={hoodies} sectionName="Hoodies" />
      </div>

      <div className="">
        <About/>
      </div>
    </div>
  );
}
