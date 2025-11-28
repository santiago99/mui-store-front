import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectIsDrawerOpen, closeDrawer } from "./cartSlice";
import { useCart } from "./useCart";
import { formatPriceRub } from "./cartUtils";
import { useTranslation } from "react-i18next";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Plus, Minus, Trash2, ShoppingCart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CartDrawer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsDrawerOpen);
  const { items, count, total, isLoading, updateItemQuantity, removeItem } =
    useCart();

  const handleClose = () => {
    dispatch(closeDrawer());
  };

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

  const handleViewCart = () => {
    handleClose();
    navigate("/cart");
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open: boolean) => !open && handleClose()}
      side="right"
    >
      <DrawerContent
        side="right"
        className="w-full sm:w-[400px] p-0 flex flex-col"
      >
        {/* Header */}
        <DrawerHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-lg font-semibold">
              {t("cart.shoppingCart")} ({count})
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t("cart.yourCartIsEmpty")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("cart.addSomeItems")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.product_id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <img
                        src={
                          item.product.imageUrl &&
                          item.product.imageUrl.length > 0
                            ? item.product.imageUrl
                            : "/assets/no-photo.jpeg"
                        }
                        alt={item.product.title}
                        className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                      />

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className={cn(
                            "text-sm font-semibold mb-1",
                            "overflow-hidden text-ellipsis whitespace-nowrap"
                          )}
                        >
                          {item.product.title}
                        </h3>

                        <p className="text-sm font-bold text-primary mb-2">
                          {formatPriceRub(item.product.price)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
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
                            className="w-16 h-8 text-center"
                            min={1}
                          />

                          <Button
                            variant="outline"
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
                            className="h-8 w-8 ml-auto text-destructive hover:text-destructive hover:bg-destructive/10"
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
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <>
            <div className="border-t" />
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{t("common.total")}:</h3>
                <h3 className="text-lg font-bold text-primary">
                  {formatPriceRub(total)}
                </h3>
              </div>

              <Button
                variant="default"
                size="lg"
                className="w-full py-6"
                disabled
              >
                {t("cart.checkoutComingSoon")}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full py-6"
                onClick={handleViewCart}
              >
                {t("cart.viewCart")}
              </Button>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
