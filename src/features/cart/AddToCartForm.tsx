import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toast } from "@/components/ui/toast";
import { useCart } from "./useCart";
import type { Product } from "@/features/product/productApi";

export interface AddToCartFormProps {
  product: Product | undefined;
  isLoading?: boolean;
}

export function AddToCartForm({
  product,
  isLoading = false,
}: AddToCartFormProps) {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const { addItem, isAddingToCart } = useCart();

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addItem(product, quantity);
      setShowSuccessSnackbar(true);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  return (
    <Card className="border">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">{t("product.addToCart")}</h3>

        <div className="flex flex-col gap-4 mt-4">
          {/* Quantity Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t("common.quantity")}
            </label>
            <Input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min={1}
              className="w-32"
              disabled={isLoading}
            />
          </div>

          {/* Add to Cart Button */}
          <Button
            variant="default"
            size="lg"
            className="w-full py-6"
            onClick={handleAddToCart}
            disabled={isLoading || isAddingToCart || !product}
          >
            {isAddingToCart ? t("product.adding") : t("product.addToCart")}
          </Button>

          {/* Buy Now Button */}
          <Button
            variant="outline"
            size="lg"
            className="w-full py-6"
            disabled={isLoading || !product}
          >
            {t("product.buyNow")}
          </Button>
        </div>
      </CardContent>

      {/* Success Toast */}
      <Toast
        open={showSuccessSnackbar}
        onOpenChange={setShowSuccessSnackbar}
        duration={3000}
      >
        {t("product.productAddedToCart")}
      </Toast>
    </Card>
  );
}
