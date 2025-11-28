import {
  createEntityAdapter,
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { Category } from "./categoryApi";

// Create entity adapter - category.id is always number
const categoriesAdapter = createEntityAdapter<Category>({
  // Sort by id for consistent ordering
  sortComparer: (a, b) => a.id - b.id,
});

const initialState = categoriesAdapter.getInitialState();

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    upsertCategories: (state, action: PayloadAction<Category[]>) => {
      categoriesAdapter.upsertMany(state, action.payload);
    },
    upsertCategory: (state, action: PayloadAction<Category>) => {
      categoriesAdapter.upsertOne(state, action.payload);
    },
  },
});

export const { upsertCategories, upsertCategory } = categoriesSlice.actions;

// Export adapter selectors
export const categoriesSelectors = categoriesAdapter.getSelectors(
  (state: RootState) => state.categories
);

// Constant empty array to prevent unnecessary re-renders
// const EMPTY_CATEGORY_ARRAY: Category[] = [];

// Base selector to get all categories
const selectAllCategories = categoriesSelectors.selectAll;

// Selector to get category ancestors (memoized)
export const selectCategoryAncestors = createSelector(
  [
    (state: RootState) => state.categories.entities,
    (_state: RootState, id: number | null) => id,
  ],
  (entities, id): Category[] => {
    if (!id) return [];

    const result: Category[] = [];
    let current = entities[id];

    while (current?.parentId) {
      const parent = entities[current.parentId];
      if (!parent) break;
      result.push(parent);
      current = parent;
    }

    return result.reverse();
  }
);

// export const selectCategoryAncestors = createSelector(
//   [selectAllCategories, (_state: RootState, id: number | null) => id],
//   (categories, id): Category[] => {
//     // Create a map for O(1) lookups
//     const categoryMap = new Map(categories.map((c) => [c.id, c]));

//     const result: Category[] = [];
//     let current = id ? categoryMap.get(id) : null;

//     while (current?.parentId) {
//       const parent = categoryMap.get(current.parentId);
//       if (!parent) break;
//       result.push(parent);
//       current = parent;
//     }

//     return result.reverse();
//   }
// );

// Selector to get category children by parentId
export const selectCategoryChildren = createSelector(
  [
    selectAllCategories,
    (_state: RootState, parentId: number | null) => parentId,
  ],
  (categories, parentId): Category[] => {
    return categories.filter((c) => c.parentId === parentId);
  }
);

export const selectCategoryFromCache = createSelector(
  [
    (state: RootState) => state.categories.entities,
    (_state: RootState, id: number | null) => id,
  ],
  (entities, id): Category | null => {
    return id ? entities[id] : null;
  }
);

export default categoriesSlice.reducer;
