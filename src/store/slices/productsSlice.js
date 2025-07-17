import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { generateMockProducts, tenantBrandMap } from "../../utils/mockData";

// Generate mock data
const MOCK_PRODUCTS = generateMockProducts(50000);

// Async thunks
export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (tenantId, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Get all products
      const allProducts = MOCK_PRODUCTS;

      console.log("Fetching products for tenant:", tenantId);
      console.log("Available tenant mappings:", tenantBrandMap);

      // If a specific tenant is selected, filter products
      if (tenantId && tenantId !== "all") {
        // Get brands associated with this tenant
        const tenantBrands = tenantBrandMap[tenantId] || [];

        console.log(
          `Filtering for tenant ${tenantId} with brands:`,
          tenantBrands
        );

        // If no brands found for this tenant, log an error
        if (tenantBrands.length === 0) {
          console.error(`No brands found for tenant: ${tenantId}`);
          return allProducts;
        }

        // Filter products by brand
        const filteredProducts = allProducts.filter((product) =>
          tenantBrands.includes(product.brand)
        );

        console.log(
          `Filtered from ${allProducts.length} to ${filteredProducts.length} products`
        );

        return filteredProducts;
      }

      // Return all products if no tenant is specified
      return allProducts;
    } catch (error) {
      return rejectWithValue("Failed to fetch products");
    }
  }
);

// Slice
const productsSlice = createSlice({
  name: "products",
  initialState: {
    byId: {},
    allIds: [],
    featuredIds: [],
    searchResults: [],
    searchTerm: "",
    loading: false,
    error: null,
    filters: {
      priceRange: [0, 1000],
      categories: [],
      ratings: null,
    },
  },
  reducers: {
    searchProducts: (state, action) => {
      const searchTerm = action.payload.toLowerCase();
      state.searchTerm = searchTerm;

      if (!searchTerm) {
        state.searchResults = [];
        return;
      }

      // Search products by name and description
      state.searchResults = state.allIds.filter((id) => {
        const product = state.byId[id];
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm)
        );
      });
    },

    filterProducts: (state, action) => {
      const { priceRange, categories, ratings } = action.payload;
      state.filters = { priceRange, categories, ratings };

      // Apply filters (results will be computed by selector)
    },

    updateProductData: (state, action) => {
      const product = action.payload;
      state.byId[product.id] = {
        ...state.byId[product.id],
        ...product,
        lastUpdated: Date.now(),
      };
    },

    clearProducts: (state) => {
      state.byId = {};
      state.allIds = [];
      state.featuredIds = [];
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;

        // Reset state
        state.byId = {};
        state.allIds = [];
        state.featuredIds = [];

        // Normalize products
        action.payload.forEach((product) => {
          state.byId[product.id] = {
            ...product,
            lastUpdated: Date.now(),
          };
          state.allIds.push(product.id);

          if (product.isFeatured) {
            state.featuredIds.push(product.id);
          }
        });
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  searchProducts,
  filterProducts,
  updateProductData,
  clearProducts,
} = productsSlice.actions;

export default productsSlice.reducer;
