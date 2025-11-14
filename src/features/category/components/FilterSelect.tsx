import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Filter } from "@/features/category/categoryApi";

interface FilterSelectProps {
  filter: Filter;
}

export default function FilterSelect({ filter }: FilterSelectProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        {filter.name}
      </Typography>
      <FormControl fullWidth size="small" sx={{ mt: 1 }}>
        <InputLabel disabled>{filter.name}</InputLabel>
        <Select
          label={filter.name}
          disabled
          value=""
        >
          <MenuItem value="">
            <em>No options available</em>
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

