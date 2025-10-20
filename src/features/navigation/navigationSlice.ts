import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

export interface NavigationState {
  currentPath: string;
  route: "category" | "product" | "default" | "cart";
  data: { [k: string]: string | number };
}

const initialState: NavigationState = {
  currentPath: "/",
  route: "default",
  data: {},
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setPath: (_state, action: PayloadAction<NavigationState>) => {
      return action.payload;
    },
  },
});

export const { setPath } = navigationSlice.actions;
export const selectNavigationData = (state: RootState) => state.navigation;
// export const selectnavigationCurrentPath = (state: RootState) =>
//   state.navigation.currentPath;
export default navigationSlice.reducer;
