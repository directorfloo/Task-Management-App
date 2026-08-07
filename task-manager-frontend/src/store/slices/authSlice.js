import { createSlice } from "@reduxjs/toolkit";

const SESSION_KEY = "taskmanager_session";

// user shape mirrors the backend's AuthResponse DTO:
// { userId, username, accessToken, refreshToken, tokenType }
const loadSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: loadSession(),
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem(SESSION_KEY, JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem(SESSION_KEY);
    },
    setAvatar: (state, action) => {
      if (!state.user) return;
      state.user = { ...state.user, avatar: action.payload };
      localStorage.setItem(SESSION_KEY, JSON.stringify(state.user));
    },
  },
});

export const { setUser, logout, setAvatar } = authSlice.actions;
export default authSlice.reducer;
