import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// UserController is mounted at /api/tasks/Authentication
const BASE_URL = `${import.meta.env.VITE_API_URL}/tasks/Authentication`;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    // Backend requires username, password, confirmedPassword
    register: builder.mutation({
      query: (data) => ({
        url: "/register/user",
        method: "POST",
        body: data,
      }),
      // responses are wrapped in ApiResponse<AuthResponse>: { success, message, data, timestamp }
      transformResponse: (response) => response.data,
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response.data,
    }),
    refresh: builder.mutation({
      query: (refreshToken) => ({
        url: "/refresh",
        method: "POST",
        body: { refreshToken },
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useRefreshMutation } = authApi;
