import { createSlice } from "@reduxjs/toolkit";

const offlineSlice = createSlice({
  name: "offline",
  initialState: {
    operations: [],
    isOnline: navigator.onLine,
  },
  reducers: {
    addOperation: (state, action) => {
      state.operations.push(action.payload);
    },

    markOperationCompleted: (state, action) => {
      const { id } = action.payload;
      const operation = state.operations.find((op) => op.id === id);
      if (operation) {
        operation.status = "completed";
      }
    },

    markOperationFailed: (state, action) => {
      const { id, error } = action.payload;
      const operation = state.operations.find((op) => op.id === id);
      if (operation) {
        operation.status = "failed";
        operation.error = error;
      }
    },

    removeCompletedOperations: (state) => {
      state.operations = state.operations.filter(
        (op) => op.status !== "completed"
      );
    },

    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
  },
});

export const {
  addOperation,
  markOperationCompleted,
  markOperationFailed,
  removeCompletedOperations,
  setOnlineStatus,
} = offlineSlice.actions;

export default offlineSlice.reducer;
