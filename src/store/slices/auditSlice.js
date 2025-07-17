import { createSlice } from "@reduxjs/toolkit";

const auditSlice = createSlice({
  name: "audit",
  initialState: {
    logs: [],
    pendingLogs: [],
  },
  reducers: {
    addAuditEntry: (state, action) => {
      const entry = {
        ...action.payload,
        id: action.payload.id || Date.now().toString(),
        timestamp: action.payload.timestamp || Date.now(),
      };

      // Add to local log immediately
      state.logs.unshift(entry);

      // Trim logs to prevent memory issues (keep last 100)
      if (state.logs.length > 100) {
        state.logs = state.logs.slice(0, 100);
      }

      // Add to pending logs for server sync
      state.pendingLogs.push(entry);
    },

    markLogsSynced: (state, action) => {
      const { logIds } = action.payload;
      state.pendingLogs = state.pendingLogs.filter(
        (log) => !logIds.includes(log.id)
      );
    },

    clearAuditLog: (state) => {
      state.logs = [];
      // Keep pending logs to ensure they get synced
    },
  },
});

export const { addAuditEntry, markLogsSynced, clearAuditLog } =
  auditSlice.actions;

export default auditSlice.reducer;
