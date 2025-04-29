import { Button } from "@headlessui/react";
import { useState, useEffect } from "react";

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  console.log("Rendering CartItem with item:", item);
  const {
    cart_id,
    title: productTitle,
    image_url: productImage,
    discounted_price: productPrice,
    brand: productBrand,
    size: productSize,
    quantity: initialQuantity,
    custom_id,
    customization_details,
  } = item;

  // Debug logs for data verification
  console.log("cart_id:", cart_id);
  console.log("custom_id:", custom_id);
  console.log("customization_details (raw):", customization_details);

  let customization = null;
  if (custom_id && customization_details) {
    try {
      console.log("Attempting to parse customization_details...");
      customization = typeof customization_details === "string"
        ? JSON.parse(customization_details)
        : customization_details;
      console.log("Parsed customization:", customization);
    } catch (error) {
      console.error("Failed to parse customization_details:", error);
      customization = null;
    }
  } else {
    console.log("No customization_details or custom_id is missing:", { custom_id, customization_details });
  }

  console.log("fullDesignPath:", customization?.fullDesignPath);
  console.log("Custom image URL:", customization?.fullDesignPath ? `http://localhost:5000${customization.fullDesignPath}` : "N/A");

  const price = typeof productPrice === "string"
    ? parseFloat(productPrice.replace(/[^0-9.-]+/g, ""))
    : productPrice;

  const [quantity, setQuantity] = useState(initialQuantity);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const handleRemove = async () => {
    try {
      await onRemove(cart_id);
    } catch (error) {
      console.error("Failed to remove item:", error.message);
      alert("Failed to remove item from cart. Please try again.");
    }
  };

  const handleQuantityChange = async (newQuantity) => {
    const validQuantity = Math.max(1, parseInt(newQuantity));
    if (validQuantity === quantity || isUpdating) return;

    setIsUpdating(true);
    setQuantity(validQuantity);

    try {
      await onUpdateQuantity(cart_id, validQuantity);
      console.log(`Quantity updated to ${validQuantity} for cart_id ${cart_id}`);
    } catch (error) {
      console.error("Failed to update quantity:", error.message);
      setQuantity(initialQuantity);
      alert(`Failed to update quantity: ${error.message || "Please try again."}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 shadow-md border border-[#D1D5DB] rounded-lg mb-4 bg-white hover:bg-[#EBF5FF] transition-colors">
      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        <div className="w-[7rem] h-[7rem] sm:w-[9rem] sm:h-[9rem] rounded-md overflow-hidden">
          <img
            className="h-full w-full object-cover object-top"
            src={`http://localhost:5000${productImage}`}
            alt={productTitle || "Product Image"}
            onError={(e) => {
              console.error("Failed to load original image:", productImage);
              e.target.src = "/placeholder-image.jpg";
            }}
            onLoad={() => console.log("Original image loaded successfully:", productImage)}
          />
        </div>
        {custom_id && (
          <div className="w-[7rem] h-[7rem] sm:w-[9rem] sm:h-[9rem] rounded-md overflow-hidden ml-0 sm:ml-4 mt-4 sm:mt-0 border border-[#A7F3D0]">
            {customization?.fullDesignPath ? (
              <img
                className="h-full w-full object-cover object-top"
                src={`http://localhost:5000${customization.fullDesignPath}`}
                alt="Customized Design"
                onError={(e) => {
                  console.error("Failed to load custom image:", customization.fullDesignPath);
                  e.target.src = "/placeholder-custom.jpg";
                }}
                onLoad={() => console.log("Custom image loaded successfully:", customization.fullDesignPath)}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-[#D1D5DB]">
                <span className="text-sm text-[#6B7280]">Custom Image Missing</span>
              </div>
            )}
          </div>
        )}
        <div className="mt-4 sm:mt-0 sm:ml-6 flex-1 text-center sm:text-left">
          <h3 className="text-lg font-semibold no-underline text-[#1C2526]">
            {productTitle || "Untitled Product"}
          </h3>
          <p className="text-sm text-[#6B7280]">Size: {productSize || "N/A"}</p>
          <p className="text-sm text-[#6B7280] mt-1">Brand: {productBrand || "N/A"}</p>
          {customization?.description && (
            <p className="text-sm text-[#6B7280] mt-1">
              Design Notes: {customization.description}
            </p>
          )}
          <div className="flex justify-center sm:justify-start items-center text-[#1C2526] pt-3 sm:pt-4 space-x-3">
            <p className="text-lg font-bold">₹{price.toFixed(2)}</p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="px-2 py-1 bg-[#D1D5DB] rounded hover:bg-[#60A5FA] text-[#1C2526] disabled:bg-[#E5E7EB] disabled:cursor-not-allowed"
                disabled={quantity <= 1 || isUpdating}
              >
                -
              </button>
              <span className="text-sm text-[#1C2526]">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="px-2 py-1 bg-[#D1D5DB] rounded hover:bg-[#60A5FA] text-[#1C2526] disabled:bg-[#E5E7EB] disabled:cursor-not-allowed"
                disabled={isUpdating}
              >
                +
              </button>
            </div>
            <p className="text-sm text-[#6B7280]">
              Subtotal: ₹{(price * quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 sm:mt-0 text-right">
        <Button
          onClick={handleRemove}
          className="text-[#34D399] font-semibold hover:text-[#1C2526] transition-colors"
        >
          REMOVE
        </Button>
      </div>
    </div>
  );
};

export default CartItem;