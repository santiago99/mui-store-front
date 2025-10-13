import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import ProductList from "@/features/product/components/ProductList";

export interface CategoryPageProps {
  categoryId?: string | number;
}

export default function CategoryPage(props: CategoryPageProps) {
  const { categoryId } = props;

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5">Category</Typography>
      </Box>
      <ProductList pageSize={12} categoryId={categoryId} />
    </Container>
  );
}
