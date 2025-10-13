import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import ProductList from "@/features/product/components/ProductList";

export interface ProductsPageProps {
  categoryId?: string | number;
}

export default function ProductsPage(props: ProductsPageProps) {
  const { categoryId } = props;

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5">Каталог</Typography>
      </Box>
      <ProductList pageSize={12} categoryId={categoryId} />
    </Container>
  );
}
