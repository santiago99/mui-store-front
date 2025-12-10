import { useLayoutEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import ProductList from "@/features/product/components/ProductList";
import { useGetBrandBySlugQuery } from "@/app/apiSlice";
import { useAppDispatch } from "@/app/hooks";
import { clearAllFilters } from "@/features/category/filtersSlice";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";

export default function BrandPage() {
  const { t } = useTranslation();
  const { brandSlug } = useParams();
  const {
    data: brand,
    isLoading,
    error,
  } = useGetBrandBySlugQuery(brandSlug ?? "", {
    skip: !brandSlug,
  });
  const dispatch = useAppDispatch();
  const prevBrandSlugRef = useRef<string | null>(null);

  // Clear filters synchronously when brand changes (before ProductList renders)
  // useLayoutEffect runs synchronously after DOM mutations but before paint,
  // ensuring filters are cleared before ProductList's useGetProductsQuery reads them
  useLayoutEffect(() => {
    // Only clear if brand actually changed (not on initial render)
    if (
      prevBrandSlugRef.current !== null &&
      prevBrandSlugRef.current !== brandSlug
    ) {
      dispatch(clearAllFilters());
    }
    prevBrandSlugRef.current = brandSlug ?? null;
  }, [brandSlug, dispatch]);

  // Handle missing brandSlug parameter
  if (!brandSlug) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="border-destructive/30 bg-destructive/10 text-destructive">
          <AlertDescription>
            {t("errors.failedToLoadBrand") || "Brand not found"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Handle API error
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="border-destructive/30 bg-destructive/10 text-destructive">
          <AlertDescription>
            {t("errors.failedToLoadBrand") || "Failed to load brand"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <h2>
          {isLoading ? (
            <div className="h-6 w-full rounded bg-muted animate-pulse" />
          ) : (
            brand?.name
          )}
        </h2>
      </div>
      {brand && (
        <ProductList key={brandSlug} pageSize={12} brandId={brand.id} />
      )}
    </div>
  );
}
