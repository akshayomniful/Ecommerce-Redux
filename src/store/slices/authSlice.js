import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api";
import { clearProducts } from "./productsSlice";
import { clearInventory } from "./inventorySlice";
import { generateMockTenants } from "../../utils/mockData";

// Get tenants directly from mockData.js to ensure consistency
const mockTenants = generateMockTenants();

// Mock data for development
const MOCK_USER = {
  userId: "user-123",
  userName: "Demo User",
  userEmail: "demo@example.com",
  token: "mock-jwt-token",
  tenants: mockTenants, // Use the same tenants from mockData.js
};

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    // For development - use mock data instead of API call
    if (import.meta.env.DEV || import.meta.env.VITE_USE_MOCK_DATA === "true") {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Simple credential check
      if (credentials.username === "demo" || credentials.token) {
        localStorage.setItem("auth_token", MOCK_USER.token);
        return MOCK_USER;
      }

      return rejectWithValue("Invalid credentials");
    }

    // Production code - calls real API
    try {
      const response = await api.auth.login(credentials);
      localStorage.setItem("auth_token", response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export const fetchTenants = createAsyncThunk(
  "auth/fetchTenants",
  async (_, { rejectWithValue }) => {
    // For development - use mock data
    if (import.meta.env.DEV || import.meta.env.VITE_USE_MOCK_DATA === "true") {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_USER.tenants;
    }

    // Production code
    try {
      const response = await api.auth.getTenants();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch tenants");
    }
  }
);

export const switchTenant = createAsyncThunk(
  "auth/switchTenant",
  async (tenantId, { dispatch }) => {
    // Clear existing tenant data
    dispatch(clearProducts());
    dispatch(clearInventory());

    return { tenantId };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userId: null,
    userName: null,
    userEmail: null,
    selectedTenantId: null,
    availableTenants: [],
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("auth_token");
      state.userId = null;
      state.userName = null;
      state.userEmail = null;
      state.isAuthenticated = false;
      state.selectedTenantId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.userId = action.payload.userId;
        state.userName = action.payload.userName;
        state.userEmail = action.payload.userEmail;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.availableTenants = action.payload;

        // If there's only one tenant, select it automatically
        if (action.payload.length === 1 && !state.selectedTenantId) {
          state.selectedTenantId = action.payload[0].id;
        } else if (action.payload.length > 0 && !state.selectedTenantId) {
          // Default to the first tenant (Amazon Basics Store) when loading the app
          state.selectedTenantId = action.payload[0].id;
        }
      })
      .addCase(switchTenant.fulfilled, (state, action) => {
        state.selectedTenantId = action.payload.tenantId;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
