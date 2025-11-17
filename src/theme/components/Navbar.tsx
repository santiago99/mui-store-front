import { Link as RouterLink, useNavigate } from "react-router-dom";
import { UserCircle, ShoppingCart, Menu as MenuIcon } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/features/auth/authSlice";
import { useLogoutMutation } from "@/features/auth/authApi";
import { useTranslation } from "react-i18next";
import {
  selectAnimationTrigger,
  toggleDrawer,
} from "@/features/cart/cartSlice";
import { useCart } from "@/features/cart/useCart";
import CartDrawer from "@/features/cart/CartDrawer";
import LanguageSwitcher from "@/features/language/LanguageSwitcher";
import CategoriesMegamenu from "./CategoriesMegamenu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentUser = useAppSelector(selectCurrentUser);
  const animationTrigger = useAppSelector(selectAnimationTrigger);
  const [logout] = useLogoutMutation();
  const { count } = useCart();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleProfileClick = () => {
    navigate("/user/profile");
  };

  const handleLoginClick = () => {
    navigate("/user/login");
  };

  const handleRegisterClick = () => {
    navigate("/user/register");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border bg-background text-foreground shadow-sm"
        style={{
          backgroundColor: "#ffffff",
          color: "#09090b",
          borderBottom: "1px solid hsl(214.3, 31.8%, 91.4%)",
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 50,
        }}
      >
        <div
          className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4"
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            display: "flex",
            height: "4rem",
            maxWidth: "1536px",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          }}
        >
          {/* Left side: Burger (mobile) + Logo + Categories (desktop) */}
          <div
            className="flex items-center gap-4"
            style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            {/* Mobile burger button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMenuClick}
              aria-label={t("navbar.openDrawer")}
            >
              <MenuIcon className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <RouterLink
              to="/"
              className="flex items-center space-x-2 no-underline"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
              }}
            >
              <span
                className="text-xl font-bold text-foreground"
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#09090b",
                }}
              >
                MUI Store
              </span>
            </RouterLink>

            {/* Categories Megamenu - Desktop only */}
            <div className="hidden md:block">
              <CategoriesMegamenu />
            </div>
          </div>

          {/* Right side: Language + Cart + User Menu */}
          <div
            className="flex items-center gap-2"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(toggleDrawer())}
              aria-label={t("navbar.shoppingCart")}
              className={cn(
                "relative",
                animationTrigger > 0 && "animate-[bounce_0.3s_ease-in-out]"
              )}
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -right-1 -top-1 h-5 min-w-[20px] rounded-full p-0 flex items-center justify-center text-xs px-1"
                >
                  {count > 99 ? "99+" : count}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("navbar.accountOfCurrentUser")}
                >
                  {isAuthenticated && currentUser ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <UserCircle className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAuthenticated && currentUser ? (
                  <>
                    <DropdownMenuLabel>{currentUser.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleProfileClick}>
                      {t("common.profile")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      {t("common.logout")}
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={handleLoginClick}>
                      {t("common.login")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleRegisterClick}>
                      {t("common.register")}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" style={{ height: "4rem" }} />

      {/* Cart Drawer */}
      <CartDrawer onNavigateToCart={handleCartClick} />
    </>
  );
}
