import type { RootState } from "@/app/store";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import type { User } from "./authApi";

interface AuthState {
  status: "guest" | "pending" | "authorized" | "rejected";
  user: User | null;
  errors: object | string | null;
}

const initialState: AuthState = {
  status: "guest",
  user: null,
  errors: {},
};

// Removed old async thunks - now using RTK Query mutations

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.status = "authorized";
      state.errors = null;
    },
    clearUser(state) {
      state.user = null;
      state.status = "guest";
      state.errors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // RTK Query matchers for auth API endpoints
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.status = "guest";
        state.errors = null;
      })
      .addMatcher(
        authApi.endpoints.getCurrentUser.matchFulfilled,
        (state, action) => {
          state.user = action.payload;
          state.status = "authorized";
          state.errors = null;
        }
      )
      .addMatcher(
        authApi.endpoints.updateProfile.matchFulfilled,
        (state, action) => {
          state.user = action.payload.user;
        }
      )
      // Handle 401 errors for auto-logout
      .addMatcher(
        (action) =>
          action.type.endsWith("/rejected") && action.payload?.status === 401,
        (state) => {
          state.status = "guest";
          state.user = null;
          state.errors = null;
        }
      );
  },
});

export const { setUser, clearUser } = authSlice.actions;

export const selectAuthData = (state: RootState) => state.auth;
export const selectAuthState = (state: RootState) => state.auth.status;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.status === "authorized";

export default authSlice.reducer;
