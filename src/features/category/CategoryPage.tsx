import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import ProductList from "@/features/product/components/ProductList";
import { useGetCategoryQuery } from "@/app/apiSlice";

// export interface CategoryPageProps {
//   categoryId?: string | number;
// }

export default function CategoryPage(/* props: CategoryPageProps */) {
  const { categoryId } = useParams();
  //const { categoryId } = props;
  const categoryIdNumber = parseInt(categoryId!, 10);
  const { data: category, isLoading

  } = useGetCategoryQuery(categoryIdNumber);

  console.log({
    categoryId,
    categoryIdNumber,
    category,
    isLoading,
  });

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5">
          {isLoading ?
            <Skeleton variant="text" width="100%" height={24} />
            : category?.name} 111
        </Typography>
      </Box>
      <ProductList pageSize={12} categoryId={categoryId} />
    </Container>
  );
}
