import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Filter } from "@/features/category/categoryApi";

interface FilterSingleCheckboxProps {
  filter: Filter;
}

export default function FilterSingleCheckbox({
  filter,
}: FilterSingleCheckboxProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <FormControlLabel
        control={<Checkbox disabled />}
        label={filter.name}
      />
    </Box>
  );
}

