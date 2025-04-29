import React from "react";

const SizeGuide = () => {
  // Dummy data for size guide (US, UK, India) for clothing and mugs
  const clothingSizeGuide = {
    tShirt: [
      {
        size: "S",
        us: "4-6",
        uk: "8-10",
        india: "36-38",
        chest: "34-36 in",
        length: "26-27 in",
      },
      {
        size: "M",
        us: "8-10",
        uk: "12-14",
        india: "38-40",
        chest: "38-40 in",
        length: "27-28 in",
      },
      {
        size: "L",
        us: "12-14",
        uk: "16-18",
        india: "40-42",
        chest: "42-44 in",
        length: "28-29 in",
      },
      {
        size: "XL",
        us: "16-18",
        uk: "20-22",
        india: "42-44",
        chest: "46-48 in",
        length: "29-30 in",
      },
    ],
    hoodie: [
      {
        size: "S",
        us: "4-6",
        uk: "8-10",
        india: "36-38",
        chest: "36-38 in",
        length: "25-26 in",
      },
      {
        size: "M",
        us: "8-10",
        uk: "12-14",
        india: "38-40",
        chest: "40-42 in",
        length: "26-27 in",
      },
      {
        size: "L",
        us: "12-14",
        uk: "16-18",
        india: "40-42",
        chest: "44-46 in",
        length: "27-28 in",
      },
      {
        size: "XL",
        us: "16-18",
        uk: "20-22",
        india: "42-44",
        chest: "48-50 in",
        length: "28-29 in",
      },
    ],
    sweatshirt: [
      {
        size: "S",
        us: "4-6",
        uk: "8-10",
        india: "36-38",
        chest: "36-38 in",
        length: "25-26 in",
      },
      {
        size: "M",
        us: "8-10",
        uk: "12-14",
        india: "38-40",
        chest: "40-42 in",
        length: "26-27 in",
      },
      {
        size: "L",
        us: "12-14",
        uk: "16-18",
        india: "40-42",
        chest: "44-46 in",
        length: "27-28 in",
      },
      {
        size: "XL",
        us: "16-18",
        uk: "20-22",
        india: "42-44",
        chest: "48-50 in",
        length: "28-29 in",
      },
    ],
  };

  const mugSizeGuide = [
    {
      size: "Small",
      capacity: "8 oz",
      description: "Perfect for a quick coffee or tea break.",
    },
    {
      size: "Medium",
      capacity: "12 oz",
      description: "Ideal for a standard coffee or latte.",
    },
    {
      size: "Large",
      capacity: "16 oz",
      description: "Great for those who love a big cup of their favorite drink.",
    },
    {
      size: "Extra Large",
      capacity: "20 oz",
      description: "For those who need an extra-large serving.",
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-[#F9FBFD] rounded-lg shadow-lg">
      {/* Header */}
      <h1 className="text-4xl font-bold text-[#1A202C] mb-8 text-center relative">
        Size Guide
        <span className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-20 h-1 bg-[#3B82F6] rounded-full"></span>
      </h1>

      {/* Introduction */}
      <section className="mb-12">
        <p className="text-[#718096] text-center max-w-2xl mx-auto">
          Find the perfect fit for your t-shirts, hoodies, sweatshirts, and mugs with our size guide. Compare sizes across US, UK, and India standards, and check mug capacities in ounces (oz).
        </p>
      </section>

      {/* T-Shirt Size Guide */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1A202C] mb-6">
          T-Shirts
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-[#CBD5E0] rounded-lg">
            <thead>
              <tr className="bg-[#3B82F6] text-white">
                <th className="p-4 text-left">Size</th>
                <th className="p-4 text-left">US</th>
                <th className="p-4 text-left">UK</th>
                <th className="p-4 text-left">India</th>
                <th className="p-4 text-left">Chest</th>
                <th className="p-4 text-left">Length</th>
              </tr>
            </thead>
            <tbody>
              {clothingSizeGuide.tShirt.map((size, index) => (
                <tr
                  key={index}
                  className="border-b border-[#CBD5E0] hover:bg-[#E6F0FA] transition-colors duration-300"
                >
                  <td className="p-4 text-[#1A202C] font-medium">{size.size}</td>
                  <td className="p-4 text-[#718096]">{size.us}</td>
                  <td className="p-4 text-[#718096]">{size.uk}</td>
                  <td className="p-4 text-[#718096]">{size.india}</td>
                  <td className="p-4 text-[#718096]">{size.chest}</td>
                  <td className="p-4 text-[#718096]">{size.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Hoodie Size Guide */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1A202C] mb-6">
          Hoodies
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-[#CBD5E0] rounded-lg">
            <thead>
              <tr className="bg-[#3B82F6] text-white">
                <th className="p-4 text-left">Size</th>
                <th className="p-4 text-left">US</th>
                <th className="p-4 text-left">UK</th>
                <th className="p-4 text-left">India</th>
                <th className="p-4 text-left">Chest</th>
                <th className="p-4 text-left">Length</th>
              </tr>
            </thead>
            <tbody>
              {clothingSizeGuide.hoodie.map((size, index) => (
                <tr
                  key={index}
                  className="border-b border-[#CBD5E0] hover:bg-[#E6F0FA] transition-colors duration-300"
                >
                  <td className="p-4 text-[#1A202C] font-medium">{size.size}</td>
                  <td className="p-4 text-[#718096]">{size.us}</td>
                  <td className="p-4 text-[#718096]">{size.uk}</td>
                  <td className="p-4 text-[#718096]">{size.india}</td>
                  <td className="p-4 text-[#718096]">{size.chest}</td>
                  <td className="p-4 text-[#718096]">{size.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sweatshirt Size Guide */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1A202C] mb-6">
          Sweatshirts
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-[#CBD5E0] rounded-lg">
            <thead>
              <tr className="bg-[#3B82F6] text-white">
                <th className="p-4 text-left">Size</th>
                <th className="p-4 text-left">US</th>
                <th className="p-4 text-left">UK</th>
                <th className="p-4 text-left">India</th>
                <th className="p-4 text-left">Chest</th>
                <th className="p-4 text-left">Length</th>
              </tr>
            </thead>
            <tbody>
              {clothingSizeGuide.sweatshirt.map((size, index) => (
                <tr
                  key={index}
                  className="border-b border-[#CBD5E0] hover:bg-[#E6F0FA] transition-colors duration-300"
                >
                  <td className="p-4 text-[#1A202C] font-medium">{size.size}</td>
                  <td className="p-4 text-[#718096]">{size.us}</td>
                  <td className="p-4 text-[#718096]">{size.uk}</td>
                  <td className="p-4 text-[#718096]">{size.india}</td>
                  <td className="p-4 text-[#718096]">{size.chest}</td>
                  <td className="p-4 text-[#718096]">{size.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Mug Size Guide */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1A202C] mb-6">
          Mugs
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-[#CBD5E0] rounded-lg">
            <thead>
              <tr className="bg-[#3B82F6] text-white">
                <th className="p-4 text-left">Size</th>
                <th className="p-4 text-left">Capacity (oz)</th>
                <th className="p-4 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {mugSizeGuide.map((mug, index) => (
                <tr
                  key={index}
                  className="border-b border-[#CBD5E0] hover:bg-[#E6F0FA] transition-colors duration-300"
                >
                  <td className="p-4 text-[#1A202C] font-medium">{mug.size}</td>
                  <td className="p-4 text-[#718096]">{mug.capacity}</td>
                  <td className="p-4 text-[#718096]">{mug.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sizing Tips */}
      <section>
        <h2 className="text-2xl font-semibold text-[#1A202C] mb-6">
          Sizing Tips
        </h2>
        <div className="p-6 bg-white rounded-lg border border-[#CBD5E0] hover:bg-[#E6F0FA] transition-colors duration-300">
          <ul className="list-disc list-inside space-y-2 text-[#718096]">
            <li>
              Measure your chest and length to find the best fit for clothing items.
            </li>
            <li>
              If you’re between sizes, we recommend sizing up for a more comfortable fit.
            </li>
            <li>
              For mugs, consider your daily beverage needs—larger sizes are great for longer sessions!
            </li>
            <li className="text-[#F59E0B] font-medium">
              Note: Sizes may vary slightly due to manufacturing tolerances.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default SizeGuide;