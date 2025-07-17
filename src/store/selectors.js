import { createSelector } from "@reduxjs/toolkit";

// Basic selectors
export const selectProducts = (state) => state.products.byId;
export const selectProductIds = (state) => state.products.allIds;
export const selectInventory = (state) => state.inventory.byProductId;

// Memoized selectors for performance
export const selectProductsWithInventory = createSelector(
  [selectProducts, selectProductIds, selectInventory],
  (products, productIds, inventory) => {
    return productIds.map((id) => {
      const product = products[id];
      return {
        ...product,
        inventory: inventory[id] || {
          quantity: 0,
          reserved: 0,
          available: 0,
          lowStockThreshold: 5,
        },
      };
    });
  }
);

export const selectInventoryMetrics = createSelector(
  [selectInventory],
  (inventory) => {
    let totalItems = 0;
    let lowStockItems = 0;
    let outOfStockItems = 0;

    Object.values(inventory).forEach((item) => {
      totalItems++;
      if (item.quantity === 0) {
        outOfStockItems++;
      } else if (item.quantity <= item.lowStockThreshold) {
        lowStockItems++;
      }
    });

    return {
      totalItems,
      lowStockItems,
      outOfStockItems,
      inStockItems: totalItems - outOfStockItems,
    };
  }
);

export const selectLowStockProducts = createSelector(
  [selectProductsWithInventory],
  (productsWithInventory) => {
    return productsWithInventory.filter((product) => {
      const { quantity, lowStockThreshold } = product.inventory;
      return quantity > 0 && quantity <= lowStockThreshold;
    });
  }
);

export const selectOutOfStockProducts = createSelector(
  [selectProductsWithInventory],
  (productsWithInventory) => {
    return productsWithInventory.filter(
      (product) => product.inventory.quantity === 0
    );
  }
);

export const selectPendingOfflineOperations = (state) =>
  state.offline.operations.filter((op) => op.status === "pending");
