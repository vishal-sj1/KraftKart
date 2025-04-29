"use client";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { tees } from "../data/tees";
import { hoodies } from "../data/hoodies";
import { caps } from "../data/cap";
import { mobilecover } from "../data/mobilecover";
import { mugs } from "../data/mugs";
import { keychain } from "../data/keychain";
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { color, filters, singleFilter } from "./filterData";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Product() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 3 rows of 4 products each (based on lg:grid-cols-4)
  const location = useLocation();
  const navigate = useNavigate();
  const { category } = useParams();

  // Load initial products based on category
  useEffect(() => {
    let categoryProducts = [];

    switch (category?.toLowerCase()) {
      case "t-shirts":
        categoryProducts = tees;
        break;
      case "hoodies":
        categoryProducts = hoodies;
        break;
      case "caps":
        categoryProducts = caps;
        break;
      case "mobile-covers":
        categoryProducts = mobilecover;
        break;
      case "coffee-mug":
        categoryProducts = mugs;
        break;
      case "keychains":
        categoryProducts = keychain;
        break;
      default:
        categoryProducts = [
          ...tees,
          ...hoodies,
          ...caps,
          ...mobilecover,
          ...mugs,
          ...keychain,
        ];
    }

    setProducts(categoryProducts);
    setFilteredProducts(categoryProducts);
    setCurrentPage(1); // Reset to page 1 when products change
  }, [category]);

  // Apply filters when URL search params change
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    let filtered = [...products];

    // Apply color filter
    const colors = searchParams.get("color")?.split(",") || [];
    if (colors.length > 0) {
      filtered = filtered.filter((product) =>
        colors.includes(product.colour.toLowerCase())
      );
    }

    // Apply category filter
    const categories = searchParams.get("category")?.split(",") || [];
    if (categories.length > 0) {
      filtered = filtered.filter((product) =>
        categories.includes(product.topLevelCategory)
      );
    }

    // Apply size filter
    const sizes = searchParams.get("size")?.split(",") || [];
    if (sizes.length > 0) {
      filtered = filtered.filter(
        (product) => product.size && product.size.some((s) => sizes.includes(s))
      );
    }

    // Apply price filter
    const priceRange = searchParams.get("price");
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter((product) => {
        const price = Number(product.discountedPrice.replace("₹", ""));
        return price >= min && price <= max;
      });
    }

    // Apply discount filter
    const discount = searchParams.get("discount");
    if (discount) {
      const minDiscount = Number(discount);
      filtered = filtered.filter((product) => {
        const productDiscount = Number(product.percentage.replace("%", ""));
        return productDiscount >= minDiscount;
      });
    }

    // Apply stock filter
    const stock = searchParams.get("stock");
    if (stock) {
      filtered = filtered.filter((product) =>
        stock === "in_stock" ? product.quantity > 0 : product.quantity === 0
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [location.search, products]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top on page change
  };

  const handleFilter = (value, sectionId) => {
    const searchParams = new URLSearchParams(location.search);
    let filterValue = searchParams.get(sectionId)?.split(",") || [];

    if (filterValue.includes(value)) {
      filterValue = filterValue.filter((item) => item !== value);
    } else {
      filterValue.push(value);
    }

    if (filterValue.length > 0) {
      searchParams.set(sectionId, filterValue.join(","));
    } else {
      searchParams.delete(sectionId);
    }

    navigate({ search: searchParams.toString() });
  };

  const handleRadioFilter = (value, sectionId) => {
    const searchParams = new URLSearchParams(location.search);

    if (value) {
      searchParams.set(sectionId, value);
    } else {
      searchParams.delete(sectionId);
    }

    navigate({ search: searchParams.toString() });
  };

  return (
    <div className="bg-[#E8ECEF]">
      <div>
        {/* Mobile filter dialog */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-[#4A4A4A] py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-[#F5F5F5]">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex size-10 items-center justify-center rounded-md bg-[#E8ECEF] p-2 text-[#000000] hover:text-[#FF6F61]"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-[#0F0F0F]/20">
                {filters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-t border-[#0F0F0F]/20 px-4 py-6"
                  >
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-[#4A4A4A] px-2 py-3 text-[#F5F5F5] hover:text-[#FF6F61]">
                        <span className="font-medium text-[#F5F5F5]">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="size-5 group-data-open:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="size-5 group-not-data-open:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-6">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex gap-3">
                            <div className="flex h-5 shrink-0 items-center">
                              <div className="group grid size-4 grid-cols-1">
                                <input
                                  onChange={() =>
                                    handleFilter(option.value, section.id)
                                  }
                                  defaultChecked={location.search.includes(
                                    `?${section.id}=${option.value}`
                                  )}
                                  id={`filter-mobile-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  type="checkbox"
                                  className="col-start-1 row-start-1 appearance-none rounded-sm border border-[#0F0F0F]/20 bg-[#E8ECEF] checked:border-[#00C4CC] checked:bg-[#00C4CC] indeterminate:border-[#00C4CC] indeterminate:bg-[#00C4CC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00C4CC] disabled:border-[#0F0F0F]/20 disabled:bg-[#E8ECEF] disabled:checked:bg-[#E8ECEF] forced-colors:appearance-auto"
                                />
                                <svg
                                  fill="none"
                                  viewBox="0 0 14 14"
                                  className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-[#F5F5F5] group-has-disabled:stroke-[#0F0F0F]/25"
                                >
                                  <path
                                    d="M3 8L6 11L11 3.5"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-checked:opacity-100"
                                  />
                                  <path
                                    d="M3 7H11"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-indeterminate:opacity-100"
                                  />
                                </svg>
                              </div>
                            </div>
                            <label
                              htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                              className="min-w-0 flex-1 text-[#B0B0B0]"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}

                {singleFilter.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-t border-[#0F0F0F]/20 px-4 py-6"
                  >
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-[#4A4A4A] px-2 py-3 text-[#F5F5F5] hover:text-[#FF6F61]">
                        <FormLabel
                          sx={{ color: "#F5F5F5" }}
                          id="demo-radio-buttons-group-label"
                        >
                          {section.name}
                        </FormLabel>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="size-5 group-data-open:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="size-5 group-not-data-open:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <FormControl>
                      <DisclosurePanel className="pt-6 space-y-6">
                        <div className="space-y-4">
                          <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue=""
                            name="radio-buttons-group"
                          >
                            {section.options.map((option, optionIdx) => (
                              <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={
                                  <Radio
                                    sx={{
                                      color: "#B0B0B0",
                                      "&.Mui-checked": { color: "#00C4CC" },
                                    }}
                                  />
                                }
                                label={option.label}
                                onChange={() =>
                                  handleRadioFilter(option.value, section.id)
                                }
                                checked={
                                  location.search.includes(
                                    `?${section.id}=${option.value}`
                                  ) ||
                                  location.search.includes(
                                    `&${section.id}=${option.value}`
                                  )
                                }
                                sx={{ color: "#B0B0B0" }}
                              />
                            ))}
                          </RadioGroup>
                        </div>
                      </DisclosurePanel>
                    </FormControl>
                  </Disclosure>
                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto px-4 sm:px-6 lg:px-20">
          <div className="flex items-baseline justify-between border-b border-[#0F0F0F]/20 pt-5 pb-6">
            <h2 id="products-heading" className="text-3xl text-[#1A1A1A]">
              Products
            </h2>
            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-[#4A4A4A] shadow-2xl ring-1 ring-[#0F0F0F]/20 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  
                </MenuItems>
              </Menu>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-[#B0B0B0] hover:text-[#FF6F61] sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
              {/* Filters */}
              <form className="hidden lg:block">
                {filters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-b border-[#0F0F0F]/20 py-6"
                  >
                    <h3 className="-my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-[#E8ECEF] py-3 text-sm text-[#B0B0B0] hover:text-[#FF6F61]">
                        <span className="font-medium text-[#1A1A1A]">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="size-5 group-data-open:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="size-5 group-not-data-open:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-4">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex gap-3">
                            <div className="flex h-5 shrink-0 items-center">
                              <div className="group grid size-4 grid-cols-1">
                                <input
                                  onChange={() =>
                                    handleFilter(option.value, section.id)
                                  }
                                  defaultChecked={location.search.includes(
                                    `?${section.id}=${option.value}`
                                  )}
                                  id={`filter-mobile-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  type="checkbox"
                                  className="col-start-1 row-start-1 appearance-none rounded-sm border border-[#0F0F0F]/20 bg-[#E8ECEF] checked:border-[#00C4CC] checked:bg-[#00C4CC] indeterminate:border-[#00C4CC] indeterminate:bg-[#00C4CC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00C4CC] disabled:border-[#0F0F0F]/20 disabled:bg-[#E8ECEF] disabled:checked:bg-[#E8ECEF] forced-colors:appearance-auto"
                                />
                                <svg
                                  fill="none"
                                  viewBox="0 0 14 14"
                                  className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-[#F5F5F5] group-has-disabled:stroke-[#0F0F0F]/25"
                                >
                                  <path
                                    d="M3 8L6 11L11 3.5"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-checked:opacity-100"
                                  />
                                  <path
                                    d="M3 7H11"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-indeterminate:opacity-100"
                                  />
                                </svg>
                              </div>
                            </div>
                            <label
                              htmlFor={`filter-${section.id}-${optionIdx}`}
                              className="text-sm text-[#1A1A1A]"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}

                {singleFilter.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-b border-[#0F0F0F]/20 py-6"
                  >
                    <h3 className="-my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-[#E8ECEF] py-3 text-sm text-[#B0B0B0] hover:text-[#FF6F61]">
                        <FormLabel
                          sx={{ color: "#1A1A1A" }}
                          id="demo-radio-buttons-group-label"
                        >
                          {section.name}
                        </FormLabel>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="size-5 group-data-open:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="size-5 group-not-data-open:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <FormControl>
                      <DisclosurePanel className="pt-6 space-y-6">
                        <div className="space-y-4">
                          <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue=""
                            name="radio-buttons-group"
                          >
                            {section.options.map((option, optionIdx) => (
                              <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={
                                  <Radio
                                    sx={{
                                      color: "#B0B0B0",
                                      "&.Mui-checked": { color: "#00C4CC" },
                                    }}
                                  />
                                }
                                label={option.label}
                                onChange={() =>
                                  handleRadioFilter(option.value, section.id)
                                }
                                checked={
                                  location.search.includes(
                                    `?${section.id}=${option.value}`
                                  ) ||
                                  location.search.includes(
                                    `&${section.id}=${option.value}`
                                  )
                                }
                                sx={{ color: "#1A1A1A" }}
                              />
                            ))}
                          </RadioGroup>
                        </div>
                      </DisclosurePanel>
                    </FormControl>
                  </Disclosure>
                ))}
              </form>

              {/* Product grid and Pagination */}
              <div className="lg:col-span-4 w-full ">
                <div className="flex flex-wrap justify-evenly bg-[#E8ECEF] py-5">
                  {currentProducts.map((item) => (
                    <ProductCard key={item.title} product={item} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6 space-x-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={classNames(
                          currentPage === index + 1
                            ? "bg-[#00C4CC] text-[#F5F5F5]"
                            : "bg-[#E8ECEF] text-[#1A1A1A] hover:bg-[#a5e5d5] hover:text-[#1A1A1A]",
                          "px-4 py-2 border border-[#0F0F0F]/20 rounded-md text-sm font-medium transition-all duration-300"
                        )}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}