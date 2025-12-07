import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Loader2 } from "lucide-react";

import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { selectIsAuthenticated } from "@/features/auth/authSlice";
import { selectLocalCartItems } from "./cartSlice";
import { useMergeCartMutation } from "./cartApi";
import { clearLocalCart } from "./cartSlice";
import { formatCartItemsForMerge } from "./cartUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function MergeCartPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const localCartItems = useAppSelector(selectLocalCartItems);
  const [mergeCart, { isLoading, error }] = useMergeCartMutation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/user/login");
    }
  }, [isAuthenticated, navigate]);

  // Redirect if no local cart items
  useEffect(() => {
    if (isAuthenticated && localCartItems.length === 0) {
      navigate("/");
    }
  }, [isAuthenticated, localCartItems.length, navigate]);

  const handleMerge = async () => {
    try {
      const itemsToMerge = formatCartItemsForMerge(localCartItems);
      await mergeCart({ items: itemsToMerge }).unwrap();
      dispatch(clearLocalCart());
      navigate("/");
    } catch (error) {
      console.error("Failed to merge cart:", error);
    }
  };

  const handleKeepServerCart = () => {
    dispatch(clearLocalCart());
    navigate("/");
  };

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  // Show loading while checking local cart
  if (localCartItems.length === 0) {
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
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col gap-6 items-center text-center">
              <ShoppingCart
                className="h-20 w-20 text-primary"
              />

              <h1 className="text-3xl font-semibold">
                Merge Your Cart
              </h1>

              <p className="text-base text-muted-foreground">
                You have items in your cart from before you logged in. Would you
                like to merge them with your account's cart?
              </p>

              <div className="w-full py-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Items in your local cart:
                </p>
                <p className="text-lg font-semibold text-primary">
                  {localCartItems.length}{" "}
                  {localCartItems.length === 1 ? "item" : "items"}
                </p>
              </div>

              {error && (
                <Alert className="w-full border-destructive bg-destructive/10 text-destructive">
                  <AlertDescription>
                    Failed to merge cart. Please try again.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-row gap-4 w-full">
                <Button
                  variant="outline"
                  onClick={handleKeepServerCart}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Keep Server Cart
                </Button>
                <Button
                  variant="default"
                  onClick={handleMerge}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Merging...
                    </>
                  ) : (
                    "Merge Cart"
                  )}
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mt-4">
                <strong>Merge:</strong> Add your local cart items to your
                account's cart
                <br />
                <strong>Keep Server Cart:</strong> Discard local items and keep
                only your account's cart
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
