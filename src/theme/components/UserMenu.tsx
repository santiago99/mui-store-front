import { useNavigate } from "react-router-dom";
import { UserCircle } from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/features/auth/authSlice";
import { useLogoutMutation } from "@/features/auth/authApi";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentUser = useAppSelector(selectCurrentUser);
  const [logout] = useLogoutMutation();

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

  return (
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
  );
}
