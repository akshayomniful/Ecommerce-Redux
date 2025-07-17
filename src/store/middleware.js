import { io } from "socket.io-client";
import { addOperation, setOnlineStatus } from "./slices/offlineSlice";
import { bulkUpdateInventory } from "./slices/inventorySlice";
import { updateProductData } from "./slices/productsSlice";
import { addAuditEntry } from "./slices/auditSlice";
import { api } from "../api";

// Offline middleware
export const offlineMiddleware = (store) => (next) => (action) => {

  const isOffline = !navigator.onLine;
  const shouldQueue = isOffline && action.meta?.offlineable;

  if (!shouldQueue) {
    return next(action);
  }

  store.dispatch(
    addOperation({
      id: Date.now().toString(),
      timestamp: Date.now(),
      action,
      status: "pending",
    })
  );

  // For optimistic updates, still process the action
  if (action.meta?.optimistic) {
    return next(action);
  }

  return action;
};

// Real-time updates middleware
export const realTimeMiddleware = (() => {
  let socket = null;

  return (store) => (next) => (action) => {
    const result = next(action);

    // Initialize socket when app is ready
    if (action.type === "@@INIT" || action.type === "persist/REHYDRATE") {
      if (!socket) {
        socket = io(import.meta.env.VITE_WS_URL, {
          transports: ["websocket"],
          reconnection: true,
        });

        // Listen for connection changes
        socket.on("connect", () => {
          store.dispatch(setOnlineStatus(true));

          // Re-subscribe to current tenant
          const state = store.getState();
          if (state.auth.selectedTenantId) {
            socket.emit("subscribe", {
              channel: `tenant:${state.auth.selectedTenantId}`,
            });
          }
        });

        socket.on("disconnect", () => {
          store.dispatch(setOnlineStatus(false));
        });

        // Set up inventory update listeners
        socket.on("inventory_update", (updates) => {
          store.dispatch(bulkUpdateInventory(updates));
        });

        // Set up product update listeners
        socket.on("product_update", (product) => {
          store.dispatch(updateProductData(product));
        });

        // Set up window online/offline listeners
        window.addEventListener("online", () => {
          store.dispatch(setOnlineStatus(true));
        });

        window.addEventListener("offline", () => {
          store.dispatch(setOnlineStatus(false));
        });
      }
    }

    // Handle tenant switching
    if (action.type === "auth/switchTenant/fulfilled") {
      const { tenantId } = action.payload;
      if (socket && socket.connected) {
        socket.emit("subscribe", { channel: `tenant:${tenantId}` });
      }
    }

    // Handle logout
    if (action.type === "auth/logout") {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    }

    return result;
  };
})();

// Audit logging middleware
export const auditMiddleware = (store) => (next) => (action) => {
  // Process the action first
  const result = next(action);

  // Determine if action should be audited
  const auditableActionTypes = [
    "inventory/updateItem/fulfilled",
    "products/update/fulfilled",
    "products/create/fulfilled",
    "products/delete/fulfilled",
  ];

  if (auditableActionTypes.some((type) => action.type === type)) {
    const state = store.getState();
    const { userId } = state.auth;
    const tenantId = state.auth.selectedTenantId;

    // Extract entity info
    let entityId, entityType, changes;

    if (action.type.startsWith("inventory")) {
      entityType = "inventory";
      entityId = action.payload.productId;
      changes = { ...action.payload };
      delete changes.productId;
    } else if (action.type.startsWith("products")) {
      entityType = "product";
      entityId = action.payload.id;
      changes = { ...action.payload };
    }

    // Create audit entry
    const auditEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      userId,
      tenantId,
      actionType: action.type,
      entityId,
      entityType,
      changes,
    };

    // Add to audit log
    store.dispatch(addAuditEntry(auditEntry));

    // Sync with server if online
    if (navigator.onLine) {
      api.audit.recordEntry(tenantId, auditEntry).catch((error) => {
        console.error("Failed to sync audit log:", error);
      });
    }
  }

  return result;
};
