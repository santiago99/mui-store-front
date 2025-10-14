import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

interface NavbarProps {
  // drawerWidth: number;
  onMenuClick: () => void;
}

export default function Navbar({
  /* drawerWidth,  */ onMenuClick,
}: NavbarProps) {
  return (
    <AppBar
      position="fixed"
      sx={{
        // width: { sm: `calc(100% - ${drawerWidth}px)` },
        // ml: { sm: `${drawerWidth}px` },
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          ☰
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          MUI Store
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
