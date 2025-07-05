import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "../reducers/index.js";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Add this if you're using Firebase objects
    }),
});

export default store;