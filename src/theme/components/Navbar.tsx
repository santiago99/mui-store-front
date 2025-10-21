import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Badge from "@mui/material/Badge";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import { AccountCircle, ShoppingCart } from "@mui/icons-material";

import { useAppSelector, useAppDispatch } from "@/app/hooks";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/features/auth/authSlice";
import { useLogoutMutation } from "@/features/auth/authApi";
import {
  selectAnimationTrigger,
  toggleDrawer,
} from "@/features/cart/cartSlice";
import { useCart } from "@/features/cart/useCart";
import { getCartIconAnimationStyles } from "@/features/cart/cartAnimations";
import CartDrawer from "@/features/cart/CartDrawer";

interface NavbarProps {
  // drawerWidth: number;
  onMenuClick: () => void;
}

export default function Navbar({
  /* drawerWidth,  */ onMenuClick,
}: NavbarProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentUser = useAppSelector(selectCurrentUser);
  const animationTrigger = useAppSelector(selectAnimationTrigger);
  const [logout] = useLogoutMutation();
  const { count } = useCart();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      handleMenuClose();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate("/user/profile");
  };

  const handleLoginClick = () => {
    handleMenuClose();
    navigate("/user/login");
  };

  const handleRegisterClick = () => {
    handleMenuClose();
    navigate("/user/register");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

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

        <Box sx={{ flexGrow: 1 }} />

        {/* Cart Icon */}
        <IconButton
          size="large"
          aria-label="shopping cart"
          onClick={() => dispatch(toggleDrawer())}
          color="inherit"
          sx={getCartIconAnimationStyles(animationTrigger)}
        >
          <Badge badgeContent={count} color="secondary">
            <ShoppingCart />
          </Badge>
        </IconButton>

        {/* User Menu */}
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="user-menu"
          aria-haspopup="true"
          onClick={handleMenuOpen}
          color="inherit"
        >
          {isAuthenticated && currentUser ? (
            <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}>
              {currentUser.name.charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <AccountCircle />
          )}
        </IconButton>
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 0,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 23,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          }}
        >
          {isAuthenticated && currentUser
            ? [
                <MenuItem key="username" disabled>
                  <Typography variant="body2" color="text.secondary">
                    {currentUser.name}
                  </Typography>
                </MenuItem>,
                <Divider key="divider" />,
                <MenuItem key="profile" onClick={handleProfileClick}>
                  Profile
                </MenuItem>,
                <MenuItem key="logout" onClick={handleLogout}>
                  Logout
                </MenuItem>,
              ]
            : [
                <MenuItem key="login" onClick={handleLoginClick}>
                  Login
                </MenuItem>,
                <MenuItem key="register" onClick={handleRegisterClick}>
                  Register
                </MenuItem>,
              ]}
        </Menu>
      </Toolbar>

      {/* Cart Drawer */}
      <CartDrawer onNavigateToCart={handleCartClick} />
    </AppBar>
  );
}
