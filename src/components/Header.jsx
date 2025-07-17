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

    // Reset products view (re-fetch products)
    if (selectedTenantId) {
      dispatch(fetchProducts(selectedTenantId));
    }
  };

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        {/* Main header row */}
        <div className="flex items-center justify-between">
          {/* Logo and tenant (always visible) */}
          <div className="flex items-center">
            <h1
              onClick={handleHomeClick}
              className="text-xl md:text-2xl font-bold text-yellow-400 mr-2 md:mr-8 cursor-pointer hover:text-yellow-300 transition-colors"
            >
              Omniful
            </h1>
            <div className="hidden md:block">
              <TenantSelector />
            </div>
          </div>

          {/* Search bar - hidden on mobile */}
          <form
            onSubmit={handleSearch}
            className="hidden md:block flex-1 max-w-2xl mx-4"
          >
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

          {/* User info - hidden on mobile */}
          <div className="hidden md:block mr-6">
            <div className="text-sm">Hello, {userName || "Guest"}</div>
            <div className="font-bold">Account & Lists</div>
          </div>

          {/* Mobile: search button + tenant + cart */}
          <div className="flex items-center">
            {/* Mobile search toggle button */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden mr-3 text-white hover:text-yellow-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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

            {/* Mobile tenant selector */}
            <div className="md:hidden mr-3">
              <TenantSelector />
            </div>

            {/* Cart button (always visible) */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="flex items-center text-yellow-400 hover:text-yellow-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 md:h-8 md:w-8"
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
              <span className="ml-1 text-lg md:text-xl font-bold">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile search bar - conditionally shown */}
        {showMobileSearch && (
          <div className="pt-2 pb-3 md:hidden">
            <form onSubmit={handleSearch} className="flex w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="flex-1 p-2 rounded-l-md border-none text-gray-800"
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
      </div>
    </header>
  );
};

export default Header;
