import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api";

// Async thunks
export const fetchInventory = createAsyncThunk(
  "inventory/fetch",
  async (tenantId, { rejectWithValue }) => {
    try {
      const response = await api.inventory.getAll(tenantId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch inventory"
      );
    }
  }
);

export const updateInventoryItem = createAsyncThunk(
  "inventory/updateItem",
  async (
    { tenantId, productId, changes },
    { dispatch, getState, rejectWithValue }
  ) => {
    try {
      const response = await api.inventory.update(tenantId, productId, changes);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update inventory"
      );
    }
  },
  {
    meta: { offlineable: true, optimistic: true },
  }
);

// Slice
const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    byProductId: {},
    loading: false,
    error: null,
    lastSynced: null,
  },
  reducers: {
    updateInventory: (state, action) => {
      const { productId, changes } = action.payload;
      state.byProductId[productId] = {
        ...state.byProductId[productId],
        ...changes,
        lastUpdated: Date.now(),
      };
    },

    bulkUpdateInventory: (state, action) => {
      const updates = action.payload;
      updates.forEach((update) => {
        const { productId, ...changes } = update;
        state.byProductId[productId] = {
          ...state.byProductId[productId],
          ...changes,
          lastUpdated: Date.now(),
        };
      });
      state.lastSynced = Date.now();
    },

    clearInventory: (state) => {
      state.byProductId = {};
      state.lastSynced = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;

        // Normalize the inventory data
        action.payload.forEach((item) => {
          state.byProductId[item.productId] = {
            ...state.byProductId[item.productId],
            ...item,
            lastUpdated: Date.now(),
          };
        });

        state.lastSynced = Date.now();
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        const { productId, ...changes } = action.payload;
        state.byProductId[productId] = {
          ...state.byProductId[productId],
          ...changes,
          lastUpdated: Date.now(),
        };
      });
  },
});

export const { updateInventory, bulkUpdateInventory, clearInventory } =
  inventorySlice.actions;

export default inventorySlice.reducer;
