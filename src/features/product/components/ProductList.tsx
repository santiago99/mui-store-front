import * as React from "react";
import { useTranslation } from "react-i18next";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetProductsQuery } from "@/app/apiSlice";
import { type Product } from "@/features/product/productApi";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

const PRODUCT_GRID_CLASS =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4";

export interface ProductListProps {
  pageSize?: number;
  categoryId?: string | number;
}

function PaginationControls({
  totalPages,
  page,
  onChange,
}: {
  totalPages: number;
  page: number;
  onChange: (value: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, idx) => idx + 1);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
      >
        Previous
      </Button>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onChange(pageNumber)}
            className={cn(
              "h-9 w-9 rounded-md border text-sm font-medium transition-colors",
              pageNumber === page
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            aria-current={pageNumber === page ? "page" : undefined}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </Button>
    </div>
  );
}

export default function ProductList(props: ProductListProps) {
  const { t } = useTranslation();
  const { pageSize = 12, categoryId } = props;
  const [page, setPage] = React.useState(1);
  const {
    data: products,
    isLoading,
    isError,
    isFetching,
  } = useGetProductsQuery({
    page,
    perPage: pageSize,
    category_id: categoryId,
  });

  const renderSkeletons = () => (
    <div className={PRODUCT_GRID_CLASS}>
      {Array.from({ length: pageSize }).map((_, idx) => (
        <div key={`skeleton-${idx}`} className="h-full">
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return <div className="space-y-6">{renderSkeletons()}</div>;
  }

  if (isError) {
    return (
      <div className="space-y-4 py-4">
        <Alert className="border-destructive/30 bg-destructive/10 text-destructive">
          <AlertDescription>
            {t("errors.failedToLoadProducts")}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalPages = products?.meta.last_page ?? 1;

  return (
    <div className="space-y-6">
      {isFetching ? (
        renderSkeletons()
      ) : (
        <div className={PRODUCT_GRID_CLASS}>
          {products?.data.map((p: Product) => (
            <div key={p.id}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
      {products && (
        <PaginationControls
          totalPages={totalPages}
          page={page}
          onChange={(value) =>
            setPage(Math.min(Math.max(value, 1), totalPages))
          }
        />
      )}
    </div>
  );
}
