import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleCart } from "../store/slices/cartSlice";
import { searchProducts } from "../store/slices/productsSlice";
import { fetchProducts } from "../store/slices/productsSlice";
import TenantSelector from "./TenantSelector";

const Header = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const cartCount = useSelector((state) => state.cart.count);
  const { userName, selectedTenantId } = useSelector((state) => state.auth);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(searchProducts(searchTerm));
    setShowMobileSearch(false);
  };

  // Function to handle home navigation
  const handleHomeClick = () => {
    // Clear search
    setSearchTerm("");
    dispatch(searchProducts(""));
    // Close mobile menu if open
    setShowMobileMenu(false);

    // Reset products view (re-fetch products)
    if (selectedTenantId) {
      dispatch(fetchProducts(selectedTenantId));
    }
  };

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-md">
      <div className="w-full px-2 sm:px-4 py-2 md:py-3">
        {/* Main header row */}
        <div className="flex items-center justify-between">
          {/* Logo - always visible */}
          <div className="flex items-center">
            <h1
              onClick={handleHomeClick}
              className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400 cursor-pointer hover:text-yellow-300 transition-colors"
            >
              Omniful
            </h1>
          </div>

          {/* Desktop: Search bar + user info */}
          <div className="hidden md:flex flex-1 max-w-3xl mx-4">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full p-2 rounded-md border-none text-gray-800"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 bg-yellow-400 text-gray-800 rounded-r-md hover:bg-yellow-500"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Right side controls */}
          <div className="flex items-center">
            {/* Desktop: Tenant selector */}
            <div className="hidden md:block mr-4">
              <TenantSelector />
            </div>

            {/* Desktop: User info */}
            <div className="hidden md:block mr-6">
              <div className="text-sm">Hello, {userName || "Guest"}</div>
              <div className="font-bold">Account & Lists</div>
            </div>

            {/* Mobile: Search toggle */}
            <button
              onClick={() => {
                setShowMobileSearch(!showMobileSearch);
                setShowMobileMenu(false);
              }}
              className="md:hidden p-2 text-white hover:text-yellow-300"
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Mobile: Menu toggle */}
            <button
              onClick={() => {
                setShowMobileMenu(!showMobileMenu);
                setShowMobileSearch(false);
              }}
              className="md:hidden p-2 text-white hover:text-yellow-300"
              aria-label="Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    showMobileMenu
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>

            {/* Cart button (always visible) */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="flex items-center p-2 text-yellow-400 hover:text-yellow-300"
              aria-label="Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="ml-1 font-bold">{cartCount}</span>
            </button>
          </div>
        </div>

        {/* Mobile search bar - conditionally shown */}
        {showMobileSearch && (
          <div className="pt-2 pb-2 md:hidden">
            <form onSubmit={handleSearch} className="flex w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="flex-1 p-2 rounded-l-md border-none text-gray-800"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 bg-yellow-400 text-gray-800 rounded-r-md hover:bg-yellow-500"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile menu - conditionally shown */}
        {showMobileMenu && (
          <div className="md:hidden pt-2 pb-3 bg-gray-800 rounded-b-md shadow-md">
            <div className="px-4 py-2 border-b border-gray-700">
              <div className="text-yellow-400 font-medium">Store</div>
              <div className="mt-1">
                <TenantSelector />
              </div>
            </div>
            <div className="px-4 py-2">
              <div className="text-yellow-400 font-medium">Account</div>
              <div className="mt-1 text-sm">Hello, {userName || "Guest"}</div>
              <div className="mt-1 font-medium">My Orders</div>
              <div className="mt-1 font-medium">Settings</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
