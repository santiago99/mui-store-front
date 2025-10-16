import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";

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
        <Link component={RouterLink} to="/">
          <Typography
            variant="h6"
            noWrap
            component="span"
            sx={{ color: "white" }}
          >
            MUI Store
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
}
