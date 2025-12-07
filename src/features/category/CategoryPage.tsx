import { useLayoutEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import ProductList from "@/features/product/components/ProductList";
import { useGetCategoryQuery } from "@/app/apiSlice";
import { useAppDispatch } from "@/app/hooks";
import { clearAllFilters } from "./filtersSlice";

// export interface CategoryPageProps {
//   categoryId?: string | number;
// }

export default function CategoryPage(/* props: CategoryPageProps */) {
  const { categoryId } = useParams();
  //const { categoryId } = props;
  const categoryIdNumber = parseInt(categoryId!, 10);
  const { data: category, isLoading } = useGetCategoryQuery(categoryIdNumber);
  const dispatch = useAppDispatch();
  const prevCategoryIdRef = useRef<number | null>(null);

  // Clear filters synchronously when category changes (before ProductList renders)
  // useLayoutEffect runs synchronously after DOM mutations but before paint,
  // ensuring filters are cleared before ProductList's useGetProductsQuery reads them
  useLayoutEffect(() => {
    // Only clear if category actually changed (not on initial render)
    if (
      prevCategoryIdRef.current !== null &&
      prevCategoryIdRef.current !== categoryIdNumber
    ) {
      dispatch(clearAllFilters());
    }
    prevCategoryIdRef.current = categoryIdNumber;
  }, [categoryIdNumber, dispatch]);

  /* console.log({
    categoryId,
    categoryIdNumber,
    category,
    isLoading,
  }); */

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">
          {isLoading ? (
            <div className="h-6 w-full rounded bg-muted animate-pulse" />
          ) : (
            category?.name
          )}
        </h2>
      </div>
      <ProductList
        key={categoryIdNumber}
        pageSize={12}
        categoryId={categoryIdNumber}
      />
    </div>
  );
}
