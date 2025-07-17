import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/slices/productsSlice";
import { addToCart } from "../store/slices/cartSlice";
import ProductCard from "./ProductCard";
import { processBatch } from "../utils/performance";

const ProductGrid = () => {
  const dispatch = useDispatch();
  const { selectedTenantId } = useSelector((state) => state.auth);
  const { allIds, byId, loading, error, searchResults, searchTerm } =
    useSelector((state) => state.products);

  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 24;

  useEffect(() => {
    if (selectedTenantId && allIds.length === 0 && !loading) {
      dispatch(fetchProducts(selectedTenantId));
    }
  }, [dispatch, selectedTenantId, allIds.length, loading]);

  useEffect(() => {
    // Clear displayed products when search changes
    setDisplayedProducts([]);

    // Reset to page 1 when search term changes
    if (searchTerm) {
      setCurrentPage(1);
    }

    // Determine which product IDs to display
    const productIdsToDisplay =
      searchResults.length > 0
        ? searchResults // Use search results if available
        : allIds.slice(0, currentPage * productsPerPage); // Otherwise use paginated allIds

    // Process in batches for better performance
    const processProductBatch = (batch) => {
      const products = batch.map((id) => byId[id]).filter(Boolean);
      setDisplayedProducts((prev) => [...prev, ...products]);
    };

    // Only process if we have IDs
    if (productIdsToDisplay.length > 0) {
      // Process in batches of 50 for smooth rendering
      processBatch(productIdsToDisplay, 50, processProductBatch);
    }
  }, [allIds, byId, currentPage, searchResults, searchTerm]);

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  if (loading && allIds.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 p-4">Error: {error}</div>;
  }

  // Get total count for message display
  const totalCount =
    searchResults.length > 0 ? searchResults.length : allIds.length;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search results info */}
      {searchTerm && (
        <div className="mb-6 text-gray-700">
          <p className="text-lg">
            {searchResults.length > 0
              ? `Showing ${searchResults.length} results for "${searchTerm}"`
              : `No results found for "${searchTerm}"`}
          </p>
          {searchResults.length === 0 && (
            <button
              onClick={() => dispatch(searchProducts(""))}
              className="text-blue-600 hover:text-blue-800 mt-2"
            >
              Clear search and show all products
            </button>
          )}
        </div>
      )}

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>

      {/* Load more button */}
      {!searchResults.length && allIds.length > displayedProducts.length && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded"
          >
            Load More Products
          </button>
        </div>
      )}

      {/* No products message */}
      {displayedProducts.length === 0 && !loading && (
        <div className="text-center p-12">
          <h3 className="text-xl">No products found</h3>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
