import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import { useGetCategoryFiltersQuery } from "@/app/apiSlice";
import type { Filter } from "@/features/category/categoryApi";
import FilterTextField from "./FilterTextField";
import FilterRange from "./FilterRange";
import FilterSelect from "./FilterSelect";
import FilterCheckboxes from "./FilterCheckboxes";
import FilterSingleCheckbox from "./FilterSingleCheckbox";

interface FilterSidebarProps {
  categoryId: number | null;
}

function renderFilter(filter: Filter) {
  switch (filter.filterType) {
    case "textfield":
      return <FilterTextField key={filter.id} filter={filter} />;
    case "range":
      return <FilterRange key={filter.id} filter={filter} />;
    case "select":
      return <FilterSelect key={filter.id} filter={filter} />;
    case "checkboxes":
      return <FilterCheckboxes key={filter.id} filter={filter} />;
    case "single checkbox":
      return <FilterSingleCheckbox key={filter.id} filter={filter} />;
    default:
      return null;
  }
}

export default function FilterSidebar({ categoryId }: FilterSidebarProps) {
  const {
    data: filters,
    isLoading,
    isError,
  } = useGetCategoryFiltersQuery(categoryId!, {
    skip: !categoryId,
  });

  if (!categoryId) {
    return null;
  }

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="60%" height={24} />
        <Skeleton variant="rectangular" width="100%" height={40} sx={{ mt: 2 }} />
        <Skeleton variant="text" width="60%" height={24} sx={{ mt: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={40} sx={{ mt: 2 }} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" size="small">
          Failed to load filters
        </Alert>
      </Box>
    );
  }

  if (!filters || filters.length === 0) {
    return null;
  }

  // Sort filters by filterWeight (ascending)
  const sortedFilters = [...filters].sort(
    (a, b) => a.filterWeight - b.filterWeight
  );

  return (
    <Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ px: 2, pb: 1 }}>
        <Typography variant="h6" component="div">
          Filters
        </Typography>
      </Box>
      <Paper
        variant="outlined"
        sx={{
          mx: 2,
          mb: 2,
          p: 2,
          maxHeight: "calc(100vh - 400px)",
          overflow: "auto",
        }}
      >
        {sortedFilters.map(renderFilter)}
      </Paper>
    </Box>
  );
}

