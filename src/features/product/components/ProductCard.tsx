import { Link as RouterLink } from "react-router-dom";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Product } from "@/features/product/productApi";
import { useCart } from "@/features/cart/useCart";
import { useTranslation } from "react-i18next";

function formatPriceRub(price: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
}

export interface ProductCardProps {
  product: Product;
}

export default function ProductCard(props: ProductCardProps) {
  const { t } = useTranslation();
  const { product } = props;
  const { addItem, isAddingToCart } = useCart();

  const handleAddToCart = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await addItem(product, 1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const imageSrc =
    product.imageUrl.length > 0 ? product.imageUrl : "/assets/no-photo.jpeg";

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <RouterLink
        to={`/product/${product.id}`}
        className="flex flex-1 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="relative h-52 w-full overflow-hidden bg-muted">
          <img
            src={imageSrc}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          {product.brand && (
            <p className="text-xs text-muted-foreground font-medium">
              {product.brand.name}
            </p>
          )}
          <p className="truncate text-base font-medium text-foreground">
            {product.title}
          </p>
          <p className="text-lg font-semibold text-foreground">
            {formatPriceRub(product.price)}
          </p>
        </div>
      </RouterLink>
      <div className="flex items-center justify-between border-t px-4 py-3">
        <RouterLink
          to={`/product/${product.id}`}
          className={cn(
            buttonVariants({ variant: "link", size: "sm" }),
            "px-0"
          )}
        >
          {t("product.learnMore")}
        </RouterLink>
        <Button
          size="sm"
          className="px-4"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? t("product.adding") : t("product.addToCartSmall")}
        </Button>
      </div>
    </Card>
  );
}
