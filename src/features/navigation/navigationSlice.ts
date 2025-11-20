import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

export interface BreadcrumbItem {
  path?: string;
  label: string;
}

export interface AncestorItem {
  id: string | number;
  name: string;
}

export interface NavigationState {
  currentPath: string;
  route: "category" | "product" | "static" | "frontpage";
  data: { [k: string]: string | number };
  breadcrumbs: BreadcrumbItem[];
  ancestors: AncestorItem[];
}

const initialState: NavigationState = {
  currentPath: "/",
  route: "frontpage",
  data: {},
  breadcrumbs: [],
  ancestors: [],
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
export const isFront = (state: RootState) =>
  state.navigation.route === "frontpage";
export const selectActiveCategoryId = (state: RootState): number | null => {
  if (state.navigation.route === "category") {
    return state.navigation.data.categoryId as number;
  }
  if (state.navigation.route === "product") {
    return state.navigation.data.categoryId as number | null;
  }
  return null;
};
export const selectActiveProductId = (state: RootState): string | null => {
  if (state.navigation.route === "product") {
    return state.navigation.data.productId as string;
  }
  return null;
};
export const selectIsActive =
  (categoryId: number) =>
  (state: RootState): boolean => {
    const activeCategoryId = selectActiveCategoryId(state);
    return activeCategoryId !== null && activeCategoryId === categoryId;
  };
export default navigationSlice.reducer;
