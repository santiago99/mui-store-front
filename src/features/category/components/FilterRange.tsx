import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import type { Filter } from "@/features/category/categoryApi";

interface FilterRangeProps {
  filter: Filter;
}

export default function FilterRange({ filter }: FilterRangeProps) {
  const min = filter.min ?? 0;
  const max = filter.max ?? 100;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        {filter.name}
      </Typography>
      <Grid container spacing={1} sx={{ mt: 1 }}>
        <Grid size={{ xs: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Min"
            type="number"
            value={min}
            disabled
            inputProps={{ min, max }}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Max"
            type="number"
            value={max}
            disabled
            inputProps={{ min, max }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

