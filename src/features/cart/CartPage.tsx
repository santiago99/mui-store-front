import { Link as RouterLink } from "react-router-dom";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import { useCart } from "./useCart";
import { formatPriceRub } from "./cartUtils";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CartPage() {
  const { t } = useTranslation();
  const {
    items,
    count,
    total,
    isLoading,
    updateItemQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const handleQuantityChange = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;
    try {
      await updateItemQuantity(productId, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeItem(productId);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-row items-center gap-4 mb-4">
          <Button asChild variant="outline" size="sm">
            <RouterLink to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("cart.continueShopping")}
            </RouterLink>
          </Button>
          <h1 className="text-3xl font-semibold">{t("cart.shoppingCart")}</h1>
        </div>

        {items.length > 0 && (
          <p className="text-base text-muted-foreground">
            {t("cart.itemsInCart", { count })}
          </p>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart
            className="h-30 w-30 text-muted-foreground mb-6 mx-auto"
            style={{ fontSize: 120 }}
          />
          <h2 className="text-2xl text-muted-foreground mb-4">
            {t("cart.yourCartIsEmpty")}
          </h2>
          <p className="text-base text-muted-foreground mb-6">
            {t("cart.looksLikeEmpty")}
          </p>
          <Button asChild variant="default" size="lg">
            <RouterLink to="/">{t("cart.startShopping")}</RouterLink>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <Card key={item.product_id}>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                      {/* Product Image */}
                      <div className="sm:col-span-3 md:col-span-3">
                        <img
                          src={
                            item.product.imageUrl &&
                            item.product.imageUrl.length > 0
                              ? item.product.imageUrl
                              : "/assets/no-photo.jpeg"
                          }
                          alt={item.product.title}
                          className="h-30 w-full object-cover rounded-md"
                          style={{ height: 120 }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="sm:col-span-6 md:col-span-5 xl:col-span-6">
                        <h3 className="text-lg font-semibold mb-2">
                          {item.product.title}
                        </h3>
                        <p className="text-base text-primary font-bold">
                          {formatPriceRub(item.product.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="sm:col-span-3 md:col-span-4 xl:col-span-3">
                        <div className="flex flex-row items-center gap-2 justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleQuantityChange(
                                item.product_id,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10);
                              if (!isNaN(value) && value > 0) {
                                handleQuantityChange(item.product_id, value);
                              }
                            }}
                            className="w-20 h-8 text-center"
                            min={1}
                          />

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleQuantityChange(
                                item.product_id,
                                item.quantity + 1
                              )
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 ml-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveItem(item.product_id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Clear Cart Button */}
            <div className="mt-6">
              <Button
                variant="outline"
                onClick={handleClearCart}
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t("cart.clearCart")}
              </Button>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-4">
            <Card className="sticky top-5">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">
                  {t("cart.orderSummary")}
                </h2>

                <div className="border-t my-4" />

                <div className="flex justify-between items-center mb-4">
                  <p className="text-base">
                    {t("common.items")} ({count}):
                  </p>
                  <p className="text-base">{formatPriceRub(total)}</p>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <p className="text-base">{t("cart.shipping")}:</p>
                  <p className="text-base text-muted-foreground">
                    {t("cart.calculatedAtCheckout")}
                  </p>
                </div>

                <div className="border-t my-4" />

                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">
                    {t("common.total")}:
                  </h3>
                  <h3 className="text-lg text-primary font-bold">
                    {formatPriceRub(total)}
                  </h3>
                </div>

                <Button
                  variant="default"
                  size="lg"
                  className="w-full py-6 mb-4"
                  disabled
                >
                  {t("cart.checkoutComingSoon")}
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full py-6"
                >
                  <RouterLink to="/">{t("cart.continueShopping")}</RouterLink>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
