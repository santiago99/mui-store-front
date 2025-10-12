import type { RootState } from "@/app/store";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { createAppAsyncThunk } from "@/app/withTypes";
import { client } from "@/app/client";
//import { apiSlice } from "../api/apiSlice";

interface AuthState {
  status: "guest" | "pending" | "authorized" | "rejected";
  email: string | null;
  errors: object | string | null;
}

interface AuthCredentials {
  email: string;
  password: string;
}

const initialState: AuthState = {
  status: "guest",
  email: null,
  errors: {},
};

export const login = createAppAsyncThunk(
  "auth/login",
  async (credentials: AuthCredentials, { rejectWithValue }) => {
    //await csrf()
    try {
      await client.getXsrfToken(true);
      await client.post("/login", credentials, {
        credentials: "include",
      });
    } catch (error: unknown) {
      console.log(error);
      let errMessage = null;
      if (typeof error === "string") {
        errMessage = error;
      } else if (error instanceof Error) {
        errMessage = error.message;
        // } else if (error instanceof Object) {
        //   errMessage = "data" in error && "errors" in error.data ? error.data.errors : '';
      }
      return rejectWithValue(errMessage);
    }

    return credentials.email;
  }
);

export const logout = createAppAsyncThunk("auth/logout", async () => {
  await client.post("/logout", {});
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /* userLoggedIn(state, action: PayloadAction<string>) {
      state.user = { id: '', name: action.payload, email: '' }
    },
    userLoggedOut(state) {
      state.user = null
    }, */
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.status = "authorized";
        state.email = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "rejected";
        state.email = null;
        state.errors = action.payload as object | string | null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "guest";
        state.email = null;
        state.errors = {};
      })
      .addCase("api/executeQuery/rejected", (state, action) => {
        console.log("api/executeQuery/rejected");
        console.log(action);
        const a = action as PayloadAction<{ status?: number }>;
        if (a.payload?.status === 401) {
          state.status = "guest";
          state.email = null;
          state.errors = {};
        }
      });
    // .addMatcher(
    //   apiSlice.endpoints.getCurrentUser.matchFulfilled,
    //   (state, action) => {
    //     state.status = "authorized";
    //     state.email = action.payload.email;
    //     state.errors = {};
    //   }
    // );
  },
});

//export const { userLoggedIn, userLoggedOut } = authSlice.actions

export const selectAuthData = (state: RootState) => state.auth;
export const selectAuthState = (state: RootState) => state.auth.status;

export default authSlice.reducer;
