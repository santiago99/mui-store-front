import { ShoppingCart } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { useTranslation } from "react-i18next";
import {
  selectAnimationTrigger,
  toggleDrawer,
} from "@/features/cart/cartSlice";
import { useCart } from "@/features/cart/useCart";
import { getCartIconAnimationStyles } from "@/features/cart/cartAnimations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CartButton() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const animationTrigger = useAppSelector(selectAnimationTrigger);
  const { count } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => dispatch(toggleDrawer())}
      aria-label={t("navbar.shoppingCart")}
      className="relative"
      style={getCartIconAnimationStyles(animationTrigger)}
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <Badge
          variant="default"
          className="absolute -right-1 -top-1 h-5 min-w-[20px] rounded-full p-0 flex items-center justify-center text-xs px-1"
        >
          {count > 99 ? "99+" : count}
        </Badge>
      )}
    </Button>
  );
}
