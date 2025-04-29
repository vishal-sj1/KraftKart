import React, { useState, useRef } from "react";
import AliceCarousel from "react-alice-carousel";
import ProductCard from "../HomeSectionCard/ProductCard";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Button } from "@headlessui/react";

const ProductCarousel = ({ data, sectionName }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  const responsive = {
    0: { items: 1 },
    720: { items: 3 },
    1024: { items: 5 },
  };

  const slidePrev = () => {
    if (activeIndex > 0) {
      carouselRef.current.slidePrev();
      setActiveIndex(activeIndex - 1);
    }
  };

  const slideNext = () => {
    if (activeIndex < items.length - 5) {
      carouselRef.current.slideNext();
      setActiveIndex(activeIndex + 1);
    }
  };

  const items = data.slice(0, 10).map((item, index) => (
    <ProductCard
      key={item.title}
      product={item}
      isMiddle={index === activeIndex + 2} // Middle item is at activeIndex + 2 (3rd position)
    />
  ));

  return (
    <div className="border mb-10 border-[#0F0F0F]/20 bg-[#bab6b6] rounded-lg shadow-md shadow-[#0F0F0F]/30 relative">
      {/* Section Header */}
      <div className="relative px-6 py-5 text-justify">
        <h2 className="text-2xl font-extrabold text-[#F5F5F5]">{sectionName}</h2>
        {/* Decorative Underline */}
        <div className="absolute bottom-3 left-15 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-[#FF6F61] to-[#FFC107] rounded-full"></div>
      </div>

      {/* Carousel */}
      <div className="relative px-5 pb-5">
        <AliceCarousel
          ref={carouselRef}
          items={items}
          disableButtonsControls
          disableDotsControls
          responsive={responsive}
          mouseTracking
          onSlideChanged={(e) => setActiveIndex(e.item)}
        />
        {/* Navigation Buttons */}
        {activeIndex > 0 && (
          <Button
            className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-[#00C4CC] hover:bg-[#8A8A8A] text-[#F5F5F5] rounded-full p-3 shadow-md shadow-[#0F0F0F]/30 transition-all duration-300"
            onClick={slidePrev}
            aria-label="previous"
          >
            <KeyboardArrowLeftIcon sx={{ color: "#F5F5F5", fontSize: 28 }} />
          </Button>
        )}
        {activeIndex < items.length - 5 && (
          <Button
            className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10 bg-[#00C4CC] hover:bg-[#8A8A8A] text-[#F5F5F5] rounded-full p-3 shadow-md shadow-[#0F0F0F]/30 transition-all duration-300"
            onClick={slideNext}
            aria-label="next"
          >
            <KeyboardArrowLeftIcon
              sx={{ transform: "rotate(180deg)", color: "#F5F5F5", fontSize: 28 }}
            />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductCarousel;