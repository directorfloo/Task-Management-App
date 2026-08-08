import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = `${import.meta.env.VITE_API_URL}/tasks`;

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.user?.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    // TaskController returns raw List<TaskResponse> here, not wrapped in ApiResponse.
    // Note: TaskResponse has no `completed` field, so this list can't tell us
    // completion state — only /toggle-complete returns that (see toggleComplete below).
    getTasks: builder.query({
      query: () => "/all",
      providesTags: (result) =>
        result
          ? [
              ...result.map((t) => ({ type: "Task", id: t.taskId })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),

    searchTasks: builder.query({
      query: (title) => `/search?title=${encodeURIComponent(title)}`,
      providesTags: [{ type: "Task", id: "LIST" }],
    }),

    createTask: builder.mutation({
      query: ({ title, description, priority }) => ({
        url: "",
        method: "POST",
        body: { title, description, priority },
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),

    updateTask: builder.mutation({
      query: ({ taskId, title, description, priority }) => ({
        url: `/${taskId}`,
        method: "PATCH",
        body: { title, description, priority },
      }),
      invalidatesTags: (result, error, { taskId }) => [{ type: "Task", id: taskId }],
    }),

    // Returns the raw Task entity (includes `completed`), unlike getTasks/searchTasks.
    toggleComplete: builder.mutation({
      query: ({ taskId, title }) => ({
        url: `/${taskId}/toggle-complete?title=${encodeURIComponent(title)}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { taskId }) => [{ type: "Task", id: taskId }],
    }),

    deleteTask: builder.mutation({
      query: (taskId) => ({
        url: `/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useLazySearchTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useToggleCompleteMutation,
  useDeleteTaskMutation,
} = taskApi;
