import { Outlet } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import type {} from "@mui/material/themeCssVarsAugmentation";
import AppTheme from "@/theme/AppTheme";
import Box from "@mui/material/Box";

import Sidebar from "@/theme/components/Sidebar";
import Navbar from "@/theme/components/Navbar";
import Breadcrumb from "@/theme/components/Breadcrumb";
import { useRouteChange } from "@/features/navigation/useRouteChange";

import { layoutMath } from "../themePrimitives";

// const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
//   margin: theme.spacing(1, 0),
//   [`& .${breadcrumbsClasses.separator}`]: {
//     color: (theme.vars || theme).palette.action.disabled,
//     margin: 1,
//   },
//   [`& .${breadcrumbsClasses.ol}`]: {
//     alignItems: 'center',
//   },
// }))

export default function DefaultLayout() {
  useRouteChange();

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", mt: "4rem" }}>
        <Navbar />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${layoutMath.sidebarWidth}px)` },
            maxWidth: layoutMath.maxWidth,
            mx: "auto",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Sidebar />
          <Box
            sx={{
              width: "100%",
              px: 2,
            }}
          >
            <Breadcrumb />
            <Outlet />
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}
