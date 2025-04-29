import React from "react";

const ShippingInfo = () => {
  // Dummy data for shipping information
  const shippingDetails = {
    standardShipping: {
      method: "Standard Shipping",
      description: "Delivered via local courier services.",
      cost: "₹300.99",
      estimatedDelivery: "5-7 business days",
    },
    expressShipping: {
      method: "Express Shipping",
      description: "Fast delivery with premium courier services.",
      cost: "₹1200.99",
      estimatedDelivery: "1-3 business days",
    },
    freeShipping: {
      threshold: "₹450.00",
      description: "Free shipping on orders over ₹450!",
      estimatedDelivery: "5-7 business days",
    },
  };

  const shippingPolicy = {
    processingTime: "1-2 business days",
    tracking: "Tracking numbers provided via email after shipment.",
    returns: "Free returns within 30 days of delivery.",
    international: "Shipping available to select countries (contact support).",
  };

  const faq = [
    {
      question: "How long does shipping take?",
      answer: "Shipping times vary by method: Standard (5-7 days), Express (1-3 days).",
    },
    {
      question: "Is there free shipping?",
      answer: "Yes, free shipping is available on orders over ₹450.",
    },
    {
      question: "Can I track my order?",
      answer: "Yes, a tracking number will be emailed to you after shipment.",
    },
    {
      question: "What if my item arrives damaged?",
      answer: "Contact us within 30 days for a free return or replacement.",
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-[#F9FBFD] rounded-lg shadow-lg">
      {/* Header */}
      <h1 className="text-4xl font-bold text-[#1A202C] mb-8 text-center relative">
        Shipping Information
        <span className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-20 h-1 bg-[#3B82F6] rounded-full"></span>
      </h1>

      {/* Shipping Options Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1A202C] mb-6">
          Shipping Options
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-lg border border-[#CBD5E0] hover:bg-[#E6F0FA] transition-colors duration-300">
            <h3 className="text-lg font-medium text-[#1A202C]">
              {shippingDetails.standardShipping.method}
            </h3>
            <p className="text-[#718096] mt-2">
              {shippingDetails.standardShipping.description}
            </p>
            <p className="text-[#1A202C] font-semibold mt-2">
              Cost: {shippingDetails.standardShipping.cost}
            </p>
            <p className="text-[#718096] mt-1">
              Estimated Delivery: {shippingDetails.standardShipping.estimatedDelivery}
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg border border-[#CBD5E0] hover:bg-[#E6F0FA] transition-colors duration-300">
            <h3 className="text-lg font-medium text-[#1A202C]">
              {shippingDetails.expressShipping.method}
            </h3>
            <p className="text-[#718096] mt-2">
              {shippingDetails.expressShipping.description}
            </p>
            <p className="text-[#1A202C] font-semibold mt-2">
              Cost: {shippingDetails.expressShipping.cost}
            </p>
            <p className="text-[#718096] mt-1">
              Estimated Delivery: {shippingDetails.expressShipping.estimatedDelivery}
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg border border-[#CBD5E0] hover:bg-[#E6F0FA] transition-colors duration-300 md:col-span-2">
            <h3 className="text-lg font-medium text-[#1A202C]">
              Free Shipping
            </h3>
            <p className="text-[#718096] mt-2">
              {shippingDetails.freeShipping.description}
            </p>
            <p className="text-[#1A202C] font-semibold mt-2">
              Minimum Order: {shippingDetails.freeShipping.threshold}
            </p>
            <p className="text-[#718096] mt-1">
              Estimated Delivery: {shippingDetails.freeShipping.estimatedDelivery}
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Policy Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1A202C] mb-6">
          Shipping Policy
        </h2>
        <ul className="list-disc list-inside space-y-3 text-[#718096] bg-white p-6 rounded-lg border border-[#CBD5E0] hover:bg-[#E6F0FA] transition-colors duration-300">
          <li>
            <span className="font-medium text-[#1A202C]">Processing Time:</span>{" "}
            {shippingPolicy.processingTime}
          </li>
          <li>
            <span className="font-medium text-[#1A202C]">Tracking:</span>{" "}
            {shippingPolicy.tracking}
          </li>
          <li>
            <span className="font-medium text-[#1A202C]">Returns:</span>{" "}
            {shippingPolicy.returns}
          </li>
          <li>
            <span className="font-medium text-[#1A202C]">International Shipping:</span>{" "}
            <span className="text-[#3B82F6] hover:underline cursor-pointer">
              {shippingPolicy.international}
            </span>
          </li>
        </ul>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-2xl font-semibold text-[#1A202C] mb-6">
          FAQ
        </h2>
        <div className="space-y-6">
          {faq.map((item, index) => (
            <div
              key={index}
              className="border-b border-[#CBD5E0] pb-4 hover:bg-[#E6F0FA] transition-colors duration-300 rounded-lg px-4 py-2"
            >
              <h3 className="text-lg font-medium text-[#1A202C]">
                {item.question}
              </h3>
              <p className="text-[#718096] mt-2">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ShippingInfo;