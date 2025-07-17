import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, fetchTenants } from "./store/slices/authSlice";
import Header from "./components/Header";
import ProductGrid from "./components/ProductGrid";
import Cart from "./components/Cart";
import { storage } from "./utils/storage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Check if user is already authenticated
    const token = storage.get("auth_token");
    if (token && !isAuthenticated) {
      dispatch(loginUser({ token }));
    }

    // Initialize online/offline event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Fetch tenants when app loads
    if (isAuthenticated) {
      dispatch(fetchTenants());
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [dispatch, isAuthenticated]);

  const handleOnline = () => {
    console.log("App is online, syncing data...");
    // Could dispatch an action to sync offline operations
  };

  const handleOffline = () => {
    console.log("App is offline, operations will be queued");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Simplified login for demo purposes
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Omniful E-commerce
          </h1>
          <div className="mb-4">
            <p className="text-gray-600 text-center mb-6">
              Experience our high-performance e-commerce platform with 50,000+
              products
            </p>
            <button
              onClick={() =>
                dispatch(loginUser({ username: "demo", password: "demo" }))
              }
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-md"
            >
              Login as Demo User
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <ProductGrid />
      <Cart />
      <ToastContainer />
    </div>
  );
}

export default App;
