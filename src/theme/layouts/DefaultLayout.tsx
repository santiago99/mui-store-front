// import React from "react";
import { Outlet } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import type {} from "@mui/material/themeCssVarsAugmentation";
import Stack from "@mui/material/Stack";
// import { styled, alpha } from "@mui/material/styles";
import AppTheme from "@/theme/AppTheme";
import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Toolbar from "@mui/material/Toolbar";
// import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
// import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

// import Sidebar from '@/theme/components/sidebar/Sidebar'
// import Navbar from '@/theme/components/Navbar/Navbar'

import { layoutMath } from "@/theme/themePrimitives";

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

export default function DefaultLayout(/* props: {
  children: React.ReactNode
} */) {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Stack
        spacing={0}
        sx={() => ({
          alignItems: "stretch",
          minHeight: "100vh",
          // mx: 3,
          // pb: 0,
          // mt: { xs: 8, md: 0 },
        })}
      >
        {/* <Navbar /> */}
        <Box>
          {/* <Sidebar /> */}
          {/* Main content */}
          <Box
            component="main"
            sx={{
              // flexGrow: 1,
              marginLeft: layoutMath.sidebarWidth + "px",
              backgroundColor: "transparent",
              overflow: "auto",
            }}
          >
            {/* <Toolbar /> */}
            <Box
              sx={{
                width: "100%",
                maxWidth: { sm: "100%", md: "1700px" },
              }}
            >
              {/* {props.children} */}
              <Outlet />
            </Box>
          </Box>
        </Box>
      </Stack>
    </AppTheme>
  );
}
