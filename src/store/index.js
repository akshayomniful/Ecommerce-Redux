import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

// Import reducers
import inventoryReducer from "./slices/inventorySlice";
import productsReducer from "./slices/productsSlice";
import authReducer from "./slices/authSlice";
import offlineReducer from "./slices/offlineSlice";
import auditReducer from "./slices/auditSlice";
import cartReducer from "./slices/cartSlice";

// Import middleware
import {
  offlineMiddleware,
  auditMiddleware,
  realTimeMiddleware,
} from "./middleware";

// Combine reducers
const rootReducer = combineReducers({
  inventory: inventoryReducer,
  products: productsReducer,
  auth: authReducer,
  offline: offlineReducer,
  audit: auditReducer,
  cart: cartReducer,
});

// Configure persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "offline", "cart"], // Also persist cart
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(offlineMiddleware)
      .concat(auditMiddleware)
      .concat(realTimeMiddleware),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);

// Export store and persistor
export default { store, persistor };
