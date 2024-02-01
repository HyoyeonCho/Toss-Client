import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import RootReducer from "./features/RootReducer";

export const store = configureStore({
  reducer: RootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(logger),
});
