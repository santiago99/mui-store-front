import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Filter } from "@/features/category/categoryApi";

interface FilterTextFieldProps {
  filter: Filter;
}

export default function FilterTextField({ filter }: FilterTextFieldProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        {filter.name}
      </Typography>
      <TextField
        fullWidth
        size="small"
        disabled
        placeholder={filter.name}
        sx={{ mt: 1 }}
      />
    </Box>
  );
}

