import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

export type FilterValue = string | string[] | { min: number; max: number };

export interface FiltersState {
  filters: {
    [filterId: string]: FilterValue;
  };
}

const initialState: FiltersState = {
  filters: {},
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<{
        filterId: number;
        value: FilterValue;
      }>
    ) => {
      const { filterId, value } = action.payload;

      const filterKey = filterId.toString();
      if (
        value === "" ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "object" &&
          !Array.isArray(value) &&
          value.min === undefined &&
          value.max === undefined)
      ) {
        // Remove filter if empty
        delete state.filters[filterKey];
      } else {
        state.filters[filterKey] = value;
      }
    },
    clearFilter: (state, action: PayloadAction<number>) => {
      const filterId = action.payload;
      const filterKey = filterId.toString();
      delete state.filters[filterKey];
    },
    clearAllFilters: (state) => {
      state.filters = {};
    },
  },
});

export const { setFilter, clearFilter, clearAllFilters } = filtersSlice.actions;

// Selectors
export const selectFilters = (state: RootState) => state.filters.filters;
export const selectFilterValue = (filterId: number) => (state: RootState) => {
  return state.filters.filters[filterId.toString()];
};

export default filtersSlice.reducer;
