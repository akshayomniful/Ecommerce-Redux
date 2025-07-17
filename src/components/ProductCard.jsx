import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
import { toast } from "react-toastify";

// Reliable placeholder images by category
const categoryImages = {
  Electronics: "https://placehold.co/300x300/2563eb/FFFFFF?text=Electronics",
  Clothing: "https://placehold.co/300x300/dc2626/FFFFFF?text=Clothing",
  "Home & Kitchen":
    "https://placehold.co/300x300/15803d/FFFFFF?text=Home+%26+Kitchen",
  Books: "https://placehold.co/300x300/7c3aed/FFFFFF?text=Books",
  Toys: "https://placehold.co/300x300/f59e0b/FFFFFF?text=Toys",
  Beauty: "https://placehold.co/300x300/db2777/FFFFFF?text=Beauty",
  Sports: "https://placehold.co/300x300/0e7490/FFFFFF?text=Sports",
  default: "https://placehold.co/300x300/64748b/FFFFFF?text=Product",
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const {
    id,
    name,
    price,
    originalPrice,
    image,
    category,
    rating,
    reviewCount,
    isPrime,
    inventory,
  } = product;

  // Get cart items to check if product is already in cart
  const cartItems = useSelector((state) => state.cart.items);
  const [isInCart, setIsInCart] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);

  // Check if product is in cart on component mount or when cart changes
  useEffect(() => {
    const cartItem = cartItems.find((item) => item.id === id);
    if (cartItem) {
      setIsInCart(true);
      setCartQuantity(cartItem.quantity);
    } else {
      setIsInCart(false);
      setCartQuantity(0);
    }
  }, [cartItems, id]);

  // Get fallback image based on category
  const fallbackImage = categoryImages[category] || categoryImages.default;

  const isOnSale = originalPrice > price;
  const discount = isOnSale ? Math.round((1 - price / originalPrice) * 100) : 0;
  const isOutOfStock = inventory.quantity <= 0;
  const isLowStock = inventory.quantity <= inventory.lowStockThreshold;

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));

    // Show toast notification
    if (isInCart) {
      toast.info(`Added another ${name} to your cart!`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.success(`${name} has been added to your cart!`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="bg-white rounded-md overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-200">
      {/* Image section with sale badge */}
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-56 object-contain bg-gray-50 p-4"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImage;
          }}
        />

        {isOnSale && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-sm font-bold shadow-md">
            {discount}% OFF
          </div>
        )}

        {isPrime && (
          <div className="absolute bottom-2 left-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-3 py-1 rounded-sm text-xs font-bold flex items-center">
            <span className="mr-1">PRIME</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>

          <h3
            className="text-lg font-medium text-gray-800 line-clamp-2 min-h-[3rem]"
            title={name}
          >
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center mt-2">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill={i < Math.floor(rating) ? "currentColor" : "none"}
                  stroke="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-gray-600 text-sm">
                {rating} <span className="text-gray-400">({reviewCount})</span>
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="mt-3">
            {isOnSale ? (
              <div className="flex items-baseline">
                <span className="text-gray-800 text-2xl font-bold">
                  ₹{price.toFixed(2)}
                </span>
                <span className="ml-2 text-gray-500 text-sm line-through">
                  ₹{originalPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-gray-800 text-2xl font-bold">
                ₹{price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock status */}
          <div className="mt-2">
            {isOutOfStock ? (
              <div className="text-red-600 text-sm font-medium flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Out of stock
              </div>
            ) : isLowStock ? (
              <div className="text-orange-600 text-sm font-medium flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Only {inventory.quantity} left
              </div>
            ) : (
              <div className="text-green-600 text-sm font-medium flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                In Stock
              </div>
            )}
          </div>
        </div>

        {/* Button at bottom */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-2.5 rounded-md font-medium transition-colors duration-200 ${
              isOutOfStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : isInCart
                ? "bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow"
                : "bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-sm hover:shadow"
            }`}
          >
            {isOutOfStock ? (
              "Out of Stock"
            ) : isInCart ? (
              <span className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Added ({cartQuantity}) • Add More
              </span>
            ) : (
              "Add to Cart"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
