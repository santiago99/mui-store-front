import {
  type Action,
  type ThunkAction,
  configureStore,
} from "@reduxjs/toolkit";

//import { apiSlice } from '@/features/api/apiSlice'

import authReducer from "@/features/auth/authSlice";
import { apiSlice } from "@/app/apiSlice";
// import notificationsReducer from '@/features/notifications/notificationsSlice'

// import { listenerMiddleware } from './listenerMiddleware'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
