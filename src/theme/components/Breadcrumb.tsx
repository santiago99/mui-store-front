import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import { Link as RouterLink } from "react-router-dom";

import { useAppSelector } from "@/app/hooks";

export default function Breadcrumb() {
  const navigation = useAppSelector((state) => state.navigation);

  // Don't show breadcrumb if there are no breadcrumbs or on frontpage
  if (!navigation.breadcrumbs || navigation.breadcrumbs.length === 0) {
    return null;
  }

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ my: 2 }}
    >
      {navigation.breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === navigation.breadcrumbs.length - 1;
        const isHome = breadcrumb.path === "/";

        if (breadcrumb.path) {
          return (
            <Link
              key={index}
              component={RouterLink}
              to={breadcrumb.path}
              sx={{
                display: isHome ? "flex" : "block",
                alignItems: isHome ? "center" : undefined,
                textDecoration: "none",
                color: isLast ? "text.primary" : "text.secondary",
                fontWeight: isLast ? 500 : undefined,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {isHome && <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />}
              {breadcrumb.label}
            </Link>
          );
        } else {
          return (
            <Typography
              key={index}
              color="text.primary"
              sx={{ fontWeight: 500 }}
            >
              {breadcrumb.label}
            </Typography>
          );
        }
      })}
    </Breadcrumbs>
  );
}
