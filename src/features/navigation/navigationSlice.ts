import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

interface NavigationState {
  currentPath: string;
  route: "category" | "product" | "frontpage" | "cart";
  data: { [k: string]: string | number };
}

const initialState: NavigationState = {
  currentPath: "/",
  route: "frontpage",
  data: {},
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setPath: (state, action: PayloadAction<NavigationState>) => {
      return action.payload;
    },
  },
});

export const { setPath } = navigationSlice.actions;
export const selectNavigationData = (state: RootState) => state.navigation;
// export const selectnavigationCurrentPath = (state: RootState) =>
//   state.navigation.currentPath;
export default navigationSlice.reducer;
