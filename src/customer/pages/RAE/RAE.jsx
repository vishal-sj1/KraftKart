import React from "react";

const RAE = () => {
  // Dummy data for returns and exchange information
  const returnPolicy = {
    returnPeriod: "30 days",
    condition: "Items must be unused, in original packaging, and with tags.",
    refundMethod: "Refund to original payment method within 7-10 business days.",
    exchangeOption: "Exchange available for size or color (subject to stock).",
  };

  const eligibilityCriteria = [
    {
      item: "New and Unused Products",
      description: "Only items in original condition are eligible.",
    },
    {
      item: "Within 30 Days",
      description: "Returns must be initiated within 30 days of delivery.",
    },
    {
      item: "Original Packaging",
      description: "Items must be returned with all original packaging and tags.",
    },
    {
      item: "Non-Returnable Items",
      description: "Customized or personalized products are not eligible.",
    },
  ];

  const returnProcess = [
    {
      step: 1,
      description: "Log in to your account and navigate to 'My Orders'.",
    },
    {
      step: 2,
      description: "Select the item you wish to return or exchange and submit a request.",
    },
    {
      step: 3,
      description: "Print the provided return label and ship the item back.",
    },
    {
      step: 4,
      description: "Receive confirmation via email once your return is processed.",
    },
  ];

  const faq = [
    {
      question: "Can I return a damaged item?",
      answer:
        "Yes, contact us within 7 days of delivery with photos for a free return or replacement.",
    },
    {
      question: "What if the item is out of stock for exchange?",
      answer: "We’ll issue a refund or offer a store credit if the item is unavailable.",
    },
    {
      question: "How long does a refund take?",
      answer: "Refunds are processed within 7-10 business days after we receive the item.",
    },
    {
      question: "Can I exchange for a different product?",
      answer: "Exchanges are limited to size or color, subject to availability.",
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-[#F9FBFD] rounded-lg shadow-lg">
      {/* Header */}
      <h1 className="text-4xl font-bold text-[#1A202C] mb-8 text-center relative">
        Returns & Exchanges
        <span className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-20 h-1 bg-[#3B82F6] rounded-full"></span>
      </h1>

      {/* Return Policy Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1A202C] mb-6">
          Return & Exchange Policy
        </h2>
        <div className="p-6 bg-white rounded-lg border border-[#CBD5E0] hover:bg-[#E6F0FA] transition-colors duration-300">
          <p className="text-[#718096] mb-4">
            We want you to love your purchase! You can return or exchange items
            according to the following guidelines:
          </p>
          <ul className="list-disc list-inside space-y-2 text-[#718096]">
            <li>
              <span className="font-medium text-[#1A202C]">
                Return Period:
              </span>{" "}
              {returnPolicy.returnPeriod}
            </li>
            <li>
              <span className="font-medium text-[#1A202C]">Condition:</span>{" "}
              {returnPolicy.condition}
            </li>
            <li>
              <span className="font-medium text-[#1A202C]">Refund Method:</span>{" "}
              {returnPolicy.refundMethod}
            </li>
            <li>
              <span className="font-medium text-[#1A202C]">Exchange Option:</span>{" "}
              {returnPolicy.exchangeOption}
            </li>
          </ul>
        </div>
      </section>

      {/* Eligibility Criteria Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1A202C] mb-6">
          Eligibility Criteria
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {eligibilityCriteria.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg border border-[#CBD5E0] hover:bg-[#E6F0FA] transition-colors duration-300"
            >
              <h3 className="text-lg font-medium text-[#1A202C]">
                {item.item}
              </h3>
              <p className="text-[#718096] mt-2">
                {item.description}{" "}
                {item.item === "Non-Returnable Items" && (
                  <span className="text-[#F59E0B] font-medium">
                    (Please note this restriction)
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Return Process Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1A202C] mb-6">
          Return Process
        </h2>
        <div className="space-y-4">
          {returnProcess.map((step) => (
            <div
              key={step.step}
              className="p-6 bg-white rounded-lg border border-[#CBD5E0] hover:bg-[#E6F0FA] transition-colors duration-300"
            >
              <h3 className="text-lg font-medium text-[#1A202C]">
                Step {step.step}
              </h3>
              <p className="text-[#718096] mt-2">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-2xl font-semibold text-[#1A202C] mb-6">FAQ</h2>
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

export default RAE;