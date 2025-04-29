import { useState, useEffect } from "react";
import { Radio, RadioGroup } from "@headlessui/react";
import { Box, Grid2, LinearProgress, Rating } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ProductReviewCard from "./ProductReviewCard";
import ProductCard from "../Product/ProductCard";
import { useAuth } from "../../context/AuthContext"; // Import AuthContext
import axios from "axios"; // Import axios for API calls
import { Link } from "react-router-dom";

// Import static product data
import { tees } from "../data/tees";
import { hoodies } from "../data/hoodies";
import { caps } from "../data/cap";
import { mobilecover } from "../data/mobilecover";
import { mugs } from "../data/mugs";
import { keychain } from "../data/keychain";

export default function ProductDetails() {
  const { id } = useParams(); // URL parameter (slug), e.g., "blue-round-neck-tee"
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth(); // Authentication state from context
  const [product, setProduct] = useState(null); // Current product details
  const [selectedSize, setSelectedSize] = useState(null); // Selected size state
  const [relatedProducts, setRelatedProducts] = useState([]); // Related products array
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch product data on component mount or when id changes
  useEffect(() => {
    const loadProductData = async () => {
      try {
        // Combine all static product data into a single array
        const allProducts = [
          ...tees,
          ...hoodies,
          ...caps,
          ...mobilecover,
          ...mugs,
          ...keychain,
        ];

        // Find the product by matching slugified title with id
        const foundProduct = allProducts.find(
          (p) => p.title.toLowerCase().replace(/\s+/g, "-") === id
        );

        if (!foundProduct) {
          console.error(`Product with slug ${id} not found`);
          setError("Product not found");
          navigate("/products"); // Redirect to products page if not found
          return;
        }

        console.log(`Loaded product: ${foundProduct.title}, ID: ${foundProduct.product_id}`);

        // Set product and default size
        setProduct(foundProduct);
        setSelectedSize(foundProduct.size?.[0] || null); // Set first size as default if available

        // Filter related products from the same top-level category, excluding current product
        const related = allProducts
          .filter(
            (p) =>
              p.topLevelCategory === foundProduct.topLevelCategory &&
              p.product_id !== foundProduct.product_id // Use product_id for uniqueness
          )
          .slice(0, 4); // Limit to 4 items

        setRelatedProducts(related);
      } catch (err) {
        console.error("Error loading product data:", err);
        setError("Failed to load product details");
        navigate("/products"); // Redirect on error
      } finally {
        setLoading(false); // Always stop loading
      }
    };

    loadProductData();
  }, [id, navigate]); // Dependencies: id and navigate

  // Loading state UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LinearProgress sx={{ width: "50%", color: "#5A9E9F" }} />
      </div>
    );
  }

  // Error or no product state UI
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">{error || "Product not available"}</p>
      </div>
    );
  }

  // Handler to add product to cart
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }

    if (product.size?.length > 0 && !selectedSize) {
      alert("Please select a size");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No authentication token found. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/cart",
        {
          userId: user.userId,
          productId: product.product_id, // Use integer product_id
          quantity: 1,
          size: selectedSize || null, // Ensure null if no size
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Add to cart response:", response.data);
      alert("Product added to cart!");
      window.dispatchEvent(new Event("cartUpdated")); // Trigger cart update event
      navigate("/cart"); // Redirect to cart page
    } catch (error) {
      console.error(
        "Error adding to cart:",
        error.response?.data?.message || error.message
      );
      alert(`Failed to add to cart: ${error.response?.data?.message || "Please try again."}`);
    }
  };

  // Handler to navigate to customization page
  const handleCustomizeClick = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }

    if (product.size?.length > 0 && !selectedSize) {
      alert("Please select a size before customizing");
      return;
    }

    navigate(`/customize/${id}`, {
      state: {
        productId: product.product_id, // Integer product_id
        productImage: product.imageUrl,
        productTitle: product.title,
        productPrice: product.discountedPrice,
        productSize: selectedSize || null, // Ensure null if no size
        productBrand: product.brand,
      },
    });

    console.log("Navigating to customize with state:", {
      productId: product.product_id,
      productImage: product.imageUrl,
      productTitle: product.title,
      productPrice: product.discountedPrice,
      productSize: selectedSize,
      productBrand: product.brand,
    });
  };

  // Main UI
  return (
    <div className="bg-[#F5F5F0] lg:px-20">
      <div className="pt-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <li>
              <div className="flex items-center">
                <a href="/products" className="mr-2 text-sm font-medium text-[#2D2D2D]">
                  Products
                </a>
                <svg
                  fill="currentColor"
                  width={16}
                  height={20}
                  viewBox="0 0 16 20"
                  aria-hidden="true"
                  className="h-5 w-4 text-[#8A8A8A]"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <a
                  href={`/products/${product.topLevelCategory.toLowerCase()}`}
                  className="mr-2 text-sm font-medium text-[#2D2D2D]"
                >
                  {product.topLevelCategory}
                </a>
                <svg
                  fill="currentColor"
                  width={16}
                  height={20}
                  viewBox="0 0 16 20"
                  aria-hidden="true"
                  className="h-5 w-4 text-[#8A8A8A]"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>
            <li className="text-sm">
              <span className="font-medium text-[#8A8A8A]">{product.title}</span>
            </li>
          </ol>
        </nav>

        {/* Product Section */}
        <section className="grid sm:grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10 px-4 pt-10">
          {/* Image Gallery */}
          <div className="flex flex-col items-center">
            <div className="overflow-hidden rounded-lg max-w-[30rem] max-h-[35rem] shadow-2xl border border-[#D4D4D4]">
              <img
                alt={product.title}
                src={`http://localhost:5000${product.imageUrl}`} // Prepend server URL
                className="h-full w-full object-cover object-center"
                onError={(e) => (e.target.src = "/placeholder-image.jpg")} // Fallback image
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-1 max-w-2xl px-4 pb-16 sm:px-6 lg:max-w-7xl lg:px-8 lg:pb-24">
            <div className="lg:col-span-2">
              <h1 className="text-lg lg:text-xl font-semibold text-[#2D2D2D]">
                {product.brand}
              </h1>
              <h1 className="text-lg lg:text-xl text-[#2D2D2D] opacity-50 pt-1">
                {product.title}
              </h1>
            </div>

            {/* Options */}
            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <div className="flex space-x-5 items-center text-lg lg:text-xl text-[#2D2D2D] mt-6">
                <p className="font-semibold">{product.discountedPrice}</p>
                <p className="opacity-50 line-through">{product.price}</p>
                <p className="text-[#8DB596] font-semibold">{product.percentage} Off</p>
              </div>

              {/* Reviews */}
              <div className="mt-6">
                <div className="flex items-center space-x-3">
                  <Rating
                    name="read-only"
                    value={4.5}
                    readOnly
                    precision={0.5}
                    sx={{ color: "#E8B923" }} // Golden yellow for stars
                  />
                  <p className="opacity-50 text-sm text-[#8A8A8A]">106 Ratings</p>
                  <p className="ml-3 text-sm font-medium text-[#5A9E9F] hover:text-[#F28C82]">
                    110 Reviews
                  </p>
                </div>
              </div>

              {/* Form with Size Selection and Buttons */}
              <form className="mt-10" onSubmit={(e) => e.preventDefault()}>
                {product.size && product.size.length > 0 && (
                  <div className="mt-10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-[#2D2D2D]">Size</h3>
                      <Link
                        to="/size-guide"
                        className="text-sm font-medium text-[#5A9E9F] hover:text-[#F28C82]"
                      >
                        Size guide
                      </Link>
                    </div>

                    <RadioGroup
                      value={selectedSize}
                      onChange={setSelectedSize}
                      className="mt-4"
                    >
                      <div className="grid grid-cols-4 gap-4 sm:grid-cols-4">
                        {product.size.map((size) => (
                          <Radio
                            key={size}
                            value={size}
                            className={({ checked }) =>
                              `${
                                checked
                                  ? "bg-[#5A9E9F] text-white hover:bg-[#F28C82]"
                                  : "bg-white text-[#2D2D2D] hover:bg-[#F5F5F0]"
                              } cursor-pointer rounded-lg border border-[#D4D4D4] px-6 py-3 text-sm font-medium uppercase focus:outline-none focus:ring-2 focus:ring-[#5A9E9F] focus:ring-offset-2`
                            }
                          >
                            {size}
                          </Radio>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                )}

                <div className="mt-10 flex flex-row justify-evenly w-full space-x-4">
                  <button
                    type="button"
                    onClick={handleCustomizeClick}
                    className="flex-1 rounded-md border border-transparent bg-[#5A9E9F] px-8 py-3 text-base font-medium text-white hover:bg-[#F28C82] focus:outline-none focus:ring-2 focus:ring-[#5A9E9F] focus:ring-offset-2"
                  >
                    Customize Design
                  </button>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 rounded-md border border-transparent bg-[#5A9E9F] px-8 py-3 text-base font-medium text-white hover:bg-[#F28C82] focus:outline-none focus:ring-2 focus:ring-[#5A9E9F] focus:ring-offset-2"
                  >
                    Add to Bag
                  </button>
                </div>
              </form>
            </div>

            {/* Description */}
            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:pt-6 lg:pr-8 lg:pb-16">
              <div>
                <h3 className="text-sm font-medium text-[#2D2D2D]">Description</h3>
                <div className="mt-4">
                  <p className="text-base text-[#2D2D2D]">{product.description}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews & Ratings */}
        <section>
          <h1 className="ml-3 font-semibold text-lg text-[#2D2D2D] pb-4">Recent Reviews & Ratings</h1>
          <div className="border border-b border-[#D4D4D4] p-5">
            <Grid2 container spacing={7}>
              <Grid2 size={{ xs: 12, md: 7 }}>
                <div className="space-y-5">
                  {[1, 1, 1].map((_, index) => (
                    <ProductReviewCard key={index} />
                  ))}
                </div>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 5 }}>
                <h1 className="text-xl font-semibold text-[#2D2D2D] pb-1">Product Ratings</h1>
                <div className="flex items-center space-x-3">
                  <Rating
                    value={4.6}
                    precision={0.5}
                    readOnly
                    sx={{ color: "#E8B923" }} // Golden yellow for stars
                  />
                  <p className="opacity-60 text-[#8A8A8A]">10204 Ratings</p>
                </div>

                <Box className="mt-5">
                  <Grid2 container alignItems="center" gap={2}>
                    <Grid2 size={{ xs: 2 }}><p className="text-[#2D2D2D]">Excellent</p></Grid2>
                    <Grid2 size={{ xs: 7 }}>
                      <LinearProgress
                        sx={{ bgcolor: "#D4D4D4", borderRadius: 4, height: 5 }}
                        color="success"
                        variant="determinate"
                        value={80}
                      />
                    </Grid2>
                  </Grid2>
                  <Grid2 container alignItems="center" gap={2}>
                    <Grid2 size={{ xs: 2 }}><p className="text-[#2D2D2D]">Very Good</p></Grid2>
                    <Grid2 size={{ xs: 7 }}>
                      <LinearProgress
                        sx={{ bgcolor: "#D4D4D4", borderRadius: 4, height: 5 }}
                        color="success"
                        variant="determinate"
                        value={60}
                      />
                    </Grid2>
                  </Grid2>
                  <Grid2 container alignItems="center" gap={2}>
                    <Grid2 size={{ xs: 2 }}><p className="text-[#2D2D2D]">Good</p></Grid2>
                    <Grid2 size={{ xs: 7 }}>
                      <LinearProgress
                        sx={{ bgcolor: "#D4D4D4", borderRadius: 4, height: 5 }}
                        color="secondary"
                        variant="determinate"
                        value={40}
                      />
                    </Grid2>
                  </Grid2>
                  <Grid2 container alignItems="center" gap={2}>
                    <Grid2 size={{ xs: 2 }}><p className="text-[#2D2D2D]">Average</p></Grid2>
                    <Grid2 size={{ xs: 7 }}>
                      <LinearProgress
                        sx={{ bgcolor: "#D4D4D4", borderRadius: 4, height: 5 }}
                        color="warning"
                        variant="determinate"
                        value={50}
                      />
                    </Grid2>
                  </Grid2>
                  <Grid2 container alignItems="center" gap={2}>
                    <Grid2 size={{ xs: 2 }}><p className="text-[#2D2D2D]">Poor</p></Grid2>
                    <Grid2 size={{ xs: 7 }}>
                      <LinearProgress
                        sx={{ bgcolor: "#D4D4D4", borderRadius: 4, height: 5 }}
                        color="error"
                        variant="determinate"
                        value={20}
                      />
                    </Grid2>
                  </Grid2>
                </Box>
              </Grid2>
            </Grid2>
          </div>
        </section>

        {/* Similar Products */}
        <section className="pt-10">
          <h1 className="py-5 ml-3 text-xl font-bold text-[#2D2D2D]">Similar Products</h1>
          <div className="flex flex-wrap space-y-5 gap-x-5">
            {relatedProducts.map((item) => (
              <ProductCard key={item.product_id} product={item} /> // Use product_id as key
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};