import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Menu as MenuIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import CartDrawer from "@/features/cart/CartDrawer";
import CartButton from "@/features/cart/CartButton";
import LanguageSwitcher from "@/features/language/LanguageSwitcher";
import CategoriesMegamenu from "./CategoriesMegamenu";
import UserMenu from "./UserMenu";
import MobileSidebarDrawer from "./MobileSidebarDrawer";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDrawerClose = () => {
    setSidebarOpen(false);
  };
  const { t } = useTranslation();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border bg-background text-foreground shadow-sm">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
          {/* Left side: Burger (mobile) + Logo + Categories (desktop) */}
          <div className="flex items-center gap-4">
            {/* Mobile burger button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={handleDrawerToggle}
              aria-label={t("navbar.openDrawer")}
            >
              <MenuIcon className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <RouterLink to="/" className="flex items-center gap-2 no-underline">
              <span className="text-xl font-bold text-foreground">
                MUI Store
              </span>
            </RouterLink>

            {/* Categories Megamenu - Desktop only */}
            <div className="hidden md:block">
              <CategoriesMegamenu />
            </div>
          </div>

          {/* Right side: Language + Cart + User Menu */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <CartButton />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Mobile sidebar drawer */}
      <MobileSidebarDrawer open={sidebarOpen} onClose={handleDrawerClose} />

      <CartDrawer />
    </>
  );
}
