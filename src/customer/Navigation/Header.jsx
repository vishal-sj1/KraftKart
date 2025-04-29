"use client";

import React, { useState, useEffect, Fragment } from "react";
import { Avatar, Button, Menu, MenuItem, Fade } from "@mui/material";
import { deepPurple, deepOrange } from "@mui/material/colors";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Badge } from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import axios from "axios";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navigation = {
  categories: [
    {
      id: "menu",
      name: "Menu",
      featured: [
        {
          name: "Artwork Tees",
          href: "/products/t-shirts",
          imageSrc:
            "https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-02-image-card-06.jpg",
          imageAlt:
            "Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.",
        },
        {
          name: "Basic Tees",
          href: "/products/t-shirts",
          imageSrc:
            "https://tailwindui.com/plus-assets/img/ecommerce-images/mega-menu-category-02.jpg",
          imageAlt:
            "Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.",
        },
      ],
      sections: [
        {
          id: "clothing",
          name: "Clothing",
          items: [
            { name: "Hoodies", href: "/products/hoodies" },
            { name: "T-Shirts", href: "/products/t-shirts" },
            { name: "Caps", href: "/products/caps" },
            { name: "Browse All", href: "/products" },
          ],
        },
        {
          id: "accessories",
          name: "Accessories",
          items: [
            { name: "Mobile Covers", href: "/products/mobile-covers" },
            { name: "KeyChains", href: "/products/keychains" },
          ],
        },
        {
          id: "drinkwares",
          name: "Drinkwares",
          items: [{ name: "Coffee Mug", href: "/products/coffee-mug" }],
        },
      ],
    },
  ],
  pages: [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
  ],
};

// Custom transition component
const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Fade
      ref={ref}
      {...props}
      timeout={300}
      style={{
        transformOrigin: "top right",
        transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
      }}
    />
  );
});

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const openUserMenu = Boolean(anchorEl);
  const { user, logout, isAuthenticated } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const handleUserClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/account/profile");
    handleCloseUserMenu();
  };

  const handleOrdersClick = () => {
    navigate("/orders");
    handleCloseUserMenu();
  };

  const handleCartClick = () => {
    if (isAuthenticated) {
      navigate("/cart");
    } else {
      navigate("/login", { state: { from: location } });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const fetchCartCount = async () => {
    if (isAuthenticated && user?.userId) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/cart/${user.userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCartCount(response.data.length);
      } catch (error) {
        console.error("Error fetching cart count:", error.message);
        setCartCount(0);
      }
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [isAuthenticated, user?.userId]);

  useEffect(() => {
    const handleCartUpdated = () => {
      fetchCartCount();
    };
    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, []);

  return (
    <div className="z-50">
      {/* Mobile menu */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-40 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />

        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-[#4A4A4A] pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-[#F5F5F5] hover:text-[#FFC107]"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            {/* Links */}
            <TabGroup className="mt-2">
              <div className="border-b border-[#0F0F0F]/20">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {navigation.categories.map((category) => (
                    <Tab
                      key={category.name}
                      className="flex-1 px-1 py-4 text-base font-medium text-[#F5F5F5] hover:text-[#FF6F61] data-selected:text-[#FF6F61]"
                    >
                      {category.name}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                {navigation.categories.map((category) => (
                  <TabPanel
                    key={category.name}
                    className="space-y-10 px-4 pt-10 pb-8"
                  >
                    <div className="grid grid-cols-2 gap-x-4">
                      {category.featured.map((item) => (
                        <div key={item.name} className="group relative text-sm">
                          <img
                            alt={item.imageAlt}
                            src={item.imageSrc}
                            className="aspect-square w-full rounded-lg bg-[#E8ECEF] object-cover group-hover:opacity-75"
                          />
                          <Link
                            to={item.href}
                            className="mt-6 block font-medium text-[#F5F5F5] hover:text-[#FFC107]"
                            onClick={() => setOpen(false)}
                          >
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 z-10"
                            />
                            {item.name}
                          </Link>
                          <p aria-hidden="true" className="mt-1 text-[#B0B0B0]">
                            Shop now
                          </p>
                        </div>
                      ))}
                    </div>
                    {category.sections.map((section) => (
                      <div key={section.name}>
                        <p
                          id={`${category.id}-${section.id}-heading-mobile`}
                          className="font-medium text-[#F5F5F5]"
                        >
                          {section.name}
                        </p>
                        <ul
                          role="list"
                          aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                          className="mt-6 flex flex-col space-y-6"
                        >
                          {section.items.map((item) => (
                            <li key={item.name} className="flow-root">
                              <Link
                                to={item.href}
                                className="-m-2 block p-2 text-[#B0B0B0] hover:text-[#FF6F61]"
                                onClick={() => setOpen(false)}
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            <div className="space-y-6 border-t border-[#0F0F0F]/20 px-4 py-6">
              {navigation.pages.map((page) => (
                <div key={page.name} className="flow-root">
                  <Link
                    to={page.href}
                    className="-m-2 block p-2 font-medium text-[#F5F5F5] hover:text-[#FF6F61]"
                    onClick={() => setOpen(false)}
                  >
                    {page.name}
                  </Link>
                </div>
              ))}
            </div>

            <div className="space-y-6 border-t border-[#0F0F0F]/20 px-4 py-6">
              {!isAuthenticated ? (
                <>
                  <div className="flow-root">
                    <Link
                      to="/login"
                      className="-m-2 block p-2 font-medium text-[#F5F5F5] hover:text-[#FF6F61]"
                      onClick={() => setOpen(false)}
                    >
                      Sign in
                    </Link>
                  </div>
                  <div className="flow-root">
                    <Link
                      to="/signup"
                      className="-m-2 block p-2 font-medium text-[#F5F5F5] hover:text-[#FF6F61]"
                      onClick={() => setOpen(false)}
                    >
                      Create account
                    </Link>
                  </div>
                </>
              ) : (
                <div className="flow-root">
                  <Link
                    to="/account/profile"
                    className="-m-2 block p-2 font-medium text-[#F5F5F5] hover:text-[#FF6F61]"
                    onClick={() => setOpen(false)}
                  >
                    My Account
                  </Link>
                </div>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <header className="relative bg-[#1A1A1A] text-[#F5F5F5]">
        <nav aria-label="Top" className="w-full px-4 sm:px-6 lg:px-8">
          <div className="border-b border-[#0F0F0F]/20">
            <div className="flex h-17 items-center justify-between">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative rounded-md bg-[#E8ECEF] p-2 text-[#00C4CC] hover:text-[#39FF14] lg:hidden"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link to="/">
                  <span className="sr-only">KraftKart</span>
                  <img alt="" scale="1rem" src="/logok.png" className="h-15 w-auto" />
                </Link>
              </div> 

              {/* Flyout menus */}
              <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      <div className="relative flex">
                        <PopoverButton className="relative z-10 -mb-px flex items-center pt-px text-lg font-medium text-[#F5F5F5] hover:text-[#FF6F61] transition-colors duration-200 ease-out data-open:text-[#FF6F61]">
                          {category.name}
                        </PopoverButton>
                      </div>

                      <PopoverPanel
                        transition
                        className="absolute inset-x-0 top-full text-sm text-[#B0B0B0] transition data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                      >
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 top-1/2 bg-[#4A4A4A] shadow-[#0F0F0F]/30"
                        />
                        <div className="relative bg-[#4A4A4A]">
                          <div className="mx-auto max-w-7xl px-8">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                              <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                {category.featured.map((item) => (
                                  <div
                                    key={item.name}
                                    className="group relative text-base sm:text-sm"
                                  >
                                    <img
                                      alt={item.imageAlt}
                                      src={item.imageSrc}
                                      className="aspect-square w-full rounded-lg bg-[#E8ECEF] object-cover group-hover:opacity-75"
                                    />
                                    <Link
                                      to={item.href}
                                      className="mt-6 block font-medium text-[#F5F5F5] hover:text-[#FFC107]"
                                    >
                                      <span
                                        aria-hidden="true"
                                        className="absolute inset-0 z-10"
                                      />
                                      {item.name}
                                    </Link>
                                    <p
                                      aria-hidden="true"
                                      className="mt-1 text-[#B0B0B0]"
                                    >
                                      Shop now
                                    </p>
                                  </div>
                                ))}
                              </div>
                              <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-lg">
                                {category.sections.map((section) => (
                                  <div key={section.name}>
                                    <p
                                      id={`${section.name}-heading`}
                                      className="font-medium text-[#F5F5F5]"
                                    >
                                      {section.name}
                                    </p>
                                    <ul
                                      role="list"
                                      aria-labelledby={`${section.name}-heading`}
                                      className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                    >
                                      {section.items.map((item) => (
                                        <li key={item.name} className="flex">
                                          <Link
                                            to={item.href}
                                            className="cursor-pointer text-[#FFC107] hover:text-[#FFFFFF]"
                                          >
                                            {item.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </PopoverPanel>
                    </Popover>
                  ))}

                  {navigation.pages.map((page) => (
                    <Link
                      key={page.name}
                      to={page.href}
                      className="flex items-center text-lg font-medium text-[#F5F5F5] hover:text-[#FF6F61]"
                    >
                      {page.name}
                    </Link>
                  ))}
                </div>
              </PopoverGroup>

              {/* Application Name */}
              <div className="ml-auto lg:ml-76 items-center">
                <h1 className="font-semibold text-5xl text-[#F5F5F5]">
                  KraftKart
                </h1>
              </div>

              <div className="ml-auto flex items-center">
                {/* Search */}
                <div className="relative flex items-center mr-5">
                  {searchOpen ? (
                    <form
                      onSubmit={handleSearch}
                      className="relative flex items-center"
                    >
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-48 rounded-md bg-[#E8ECEF] text-[#000000] border border-[#0F0F0F]/20 px-3 py-1 focus:border-[#00C4CC] focus:outline-none transition-all duration-300"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 text-[#00C4CC] hover:text-[#000000]"
                      >
                        <MagnifyingGlassIcon
                          aria-hidden="true"
                          className="size-5"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSearchOpen(false)}
                        className="absolute right-8 text-[#000000] hover:text-[#00C4CC]"
                      >
                        <XMarkIcon
                          aria-hidden="true"
                          className="size-5"
                        />
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => setSearchOpen(true)}
                      className="p-2 text-[#00C4CC] hover:text-[#39FF14]"
                    >
                      <span className="sr-only">Search</span>
                      <MagnifyingGlassIcon
                        aria-hidden="true"
                        className="size-6"
                      />
                    </button>
                  )}
                </div>

                {isAuthenticated ? (
                  <>
                    <Avatar
                      sx={{
                        bgcolor: deepOrange[400],
                        cursor: "pointer",
                      }}
                      onClick={handleUserClick}
                    >
                      {user?.name?.charAt(0) || "U"}
                    </Avatar>
                    <Menu
                      anchorEl={anchorEl}
                      open={openUserMenu}
                      onClose={handleCloseUserMenu}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                      TransitionComponent={Transition}
                      PaperProps={{
                        sx: {
                          borderRadius: "10px",
                          backgroundColor: "#4A4A4A",
                          color: "#F5F5F5",
                          boxShadow: "0 4px 12px rgba(15, 15, 15, 0.3)", // #0F0F0F/30
                          border: "1px solid #0F0F0F/20",
                          "& .MuiMenuItem-root": {
                            "&:hover": {
                              backgroundColor: "#FFC107",
                              color: "#1A1A1A",
                              borderRadius: "10px",
                            },
                          },
                        },
                      }}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                      <MenuItem onClick={handleOrdersClick}>My Orders</MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </>
                ) : (
                  <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                    <Link
                      to="/login"
                      className="text-lg font-medium text-[#FFFFFF] hover:text-[#FF6F61]"
                    >
                      Sign in
                    </Link>
                    <span
                      aria-hidden="true"
                      className="h-6 w-px bg-[#0F0F0F]/20"
                    />
                    <Link
                      to="/signup"
                      className="text-lg font-medium text-[#FFFFFF] hover:text-[#FF6F61]"
                    >
                      Create account
                    </Link>
                  </div>
                )}

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <button
                    onClick={handleCartClick}
                    className="group -m-2 flex items-center p-2"
                  >
                    <Badge badgeContent={cartCount} color="error">
                      <ShoppingBagIcon
                        sx={{ scale: 1.4 }}
                        aria-hidden="true"
                        className="size-6 shrink-0 text-[#FFFFFF] group-hover:text-[#FF6F61]"
                      />
                    </Badge>
                    <span className="ml-2 text-sm font-medium text-[#F5F5F5] group-hover:text-[#FF6F61] sr-only">
                      {cartCount} items in cart, view bag
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};