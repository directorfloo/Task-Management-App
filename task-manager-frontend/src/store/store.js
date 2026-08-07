import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import { authApi } from "../api/auth.jsx";
import { taskApi } from "../api/task.jsx";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware).concat(taskApi.middleware),
});
