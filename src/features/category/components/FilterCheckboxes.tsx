import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Filter } from "@/features/category/categoryApi";

interface FilterCheckboxesProps {
  filter: Filter;
}

export default function FilterCheckboxes({ filter }: FilterCheckboxesProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        {filter.name}
      </Typography>
      <FormGroup sx={{ mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          No options available
        </Typography>
      </FormGroup>
    </Box>
  );
}

