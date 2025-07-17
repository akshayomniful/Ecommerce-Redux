import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../store/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const { items, total, isOpen } = useSelector((state) => state.cart);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => dispatch(toggleCart())}
      ></div>

      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">Your Cart ({items.length})</h2>
          <button
            onClick={() => dispatch(toggleCart())}
            className="text-gray-500 hover:text-gray-700"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400"
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
            <p className="mt-4 text-gray-600">Your cart is empty</p>
            <button
              onClick={() => dispatch(toggleCart())}
              className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-2 px-4 rounded-md"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex py-4 border-b border-gray-200"
                >
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/80x80?text=Product";
                      }}
                    />
                  </div>

                  <div className="ml-4 flex-1">
                    <h3 className="text-gray-800 font-medium">{item.name}</h3>
                    <div className="flex justify-between mt-2">
                      <div className="text-gray-900 font-bold">
                        Rs : {item.price.toFixed(2)}
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-md"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-md"
                          disabled={item.quantity >= item.maxQuantity}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart({ id: item.id }))}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold">Rs - {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="font-medium">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between mb-4 text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold">Rs - {total.toFixed(2)}</span>
              </div>

              <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-md mb-2">
                Proceed to Checkout
              </button>

              <button
                onClick={() => dispatch(clearCart())}
                className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-2 rounded-md hover:bg-gray-50"
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
