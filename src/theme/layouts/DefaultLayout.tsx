import * as React from "react";
import { Outlet } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import type {} from "@mui/material/themeCssVarsAugmentation";
import AppTheme from "@/theme/AppTheme";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

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

  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDrawerClose = () => {
    setSidebarOpen(false);
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <Navbar
          /* layoutMath.sidebarWidth={layoutMath.sidebarWidth} */ onMenuClick={
            handleDrawerToggle
          }
        />

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
          <Toolbar />
          <Sidebar open={sidebarOpen} onClose={handleDrawerClose} />
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
