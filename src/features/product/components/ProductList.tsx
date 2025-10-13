import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { useGetProductsQuery } from "@/app/apiSlice";
import { type Product } from "@/features/product/productApi";

export interface ProductListProps {
  pageSize?: number;
  categoryId?: string | number;
}

export default function ProductList(props: ProductListProps) {
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
    <Grid container spacing={2}>
      {Array.from({ length: pageSize }).map((_, idx) => (
        <Grid key={`skeleton-${idx}`} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <ProductCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );

  if (isLoading) {
    return <Stack spacing={3}>{renderSkeletons()}</Stack>;
  }

  if (isError) {
    return (
      <Stack spacing={2} sx={{ py: 2 }}>
        <Alert severity="error">Не удалось загрузить товары</Alert>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      {/* <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <li>IS FETCHING: {isFetching ? "YES" : "NO"}</li>
        <li>TOTAL PAGES: {products?.meta.last_page}</li>
      </Box> */}
      {isFetching ? (
        renderSkeletons()
      ) : (
        <Grid container spacing={2}>
          {products?.data.map((p: Product) => (
            <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <ProductCard product={p} />
            </Grid>
          ))}
        </Grid>
      )}
      {products && products.meta.last_page > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <Pagination
            count={products?.meta.last_page}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Stack>
  );
}
