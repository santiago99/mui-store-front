import {
  Container,
  Typography,
  // Stack,
  // Card,
  // Typography,
  // CardContent,
  // CardMedia,
  // Button,
  // CardActions,
  Box,
} from "@mui/material";
// import { NewsTimeline } from '@/features/news/NewsTimeline'
import ProductList from "@/features/product/components/ProductList";

export const Frontpage = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5">Каталог</Typography>
      </Box>
      <ProductList pageSize={12} />
    </Container>
  );
};
