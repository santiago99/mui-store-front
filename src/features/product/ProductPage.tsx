import { useParams, Link as RouterLink } from "react-router-dom";

import { useGetProductQuery } from "@/app/apiSlice";
import { AddToCartForm } from "@/features/cart/AddToCartForm";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

function formatPriceRub(price: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductPage() {
  const { t } = useTranslation();
  const { productId } = useParams();
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductQuery(productId! as string);

  if (error) {
    return (
      <div className="container mx-auto py-16">
        <Alert className="border-destructive/30 bg-destructive/10 text-destructive">
          <AlertDescription>
            {t("product.failedToLoadProduct")}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Product Image - No border */}
        <div className="flex items-start">
          <div className="w-full">
            {isLoading ? (
              <div className="w-full h-[400px] md:h-[600px] bg-muted animate-pulse" />
            ) : (
              <img
                src={
                  product?.imageUrl && product.imageUrl.length > 0
                    ? product.imageUrl
                    : "/assets/no-photo.jpeg"
                }
                alt={product?.title || "Product image"}
                className="w-full h-[400px] md:h-[600px] object-contain"
              />
            )}
          </div>
        </div>

        {/* Product Details and Add to Cart */}
        <div className="flex flex-col">
          <div className="flex flex-col gap-2">
            {/* Product Title Section */}
            <div className="space-y-3">
              {/* Brand Name */}
              {isLoading ? (
                <div className="h-5 w-32 bg-muted animate-pulse" />
              ) : product?.brand ? (
                <RouterLink
                  to={`/brands/${product.brand.slug}`}
                  className="font-brand text-sm text-muted-foreground hover:text-primary hover:underline transition-colors inline-block"
                >
                  {product.brand.name}
                </RouterLink>
              ) : null}

              {/* Product Title */}
              <h1 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight">
                {isLoading ? (
                  <div className="h-10 w-full bg-muted animate-pulse" />
                ) : (
                  product?.title
                )}
              </h1>
            </div>

            {/* Price Section */}
            <div className="pt-2">
              <p className="font-price text-3xl md:text-4xl text-primary font-semibold">
                {isLoading ? (
                  <div className="h-16 w-56 bg-muted animate-pulse" />
                ) : product?.price ? (
                  formatPriceRub(product.price)
                ) : (
                  ""
                )}
              </p>
            </div>

            <hr className="border-border my-2" />
            {/* Add to Cart Form - With border */}
            <div className="pt-2">
              <AddToCartForm product={product} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>

      {/* Product Description and Properties - Full Width */}
      <div className="space-y-6">
        {/* Product Description - With border */}
        {(!isLoading && product?.description) || isLoading ? (
          <Card className="border-none">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-6">
                {t("common.description")}
              </h2>
              <div className="text-base text-muted-foreground leading-relaxed">
                {isLoading ? (
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-muted animate-pulse" />
                    <div className="h-4 w-full bg-muted animate-pulse" />
                    <div className="h-4 w-3/4 bg-muted animate-pulse" />
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">
                    {product?.description || ""}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Additional Information */}
        <Card className="border-none">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-6">
              {t("product.additionalInformation")}
            </h2>
            <div className="flex flex-col">
              <div className="flex justify-between items-center py-1">
                <span className="text-sm font-medium text-muted-foreground">
                  SKU:
                </span>
                <span className="text-sm font-medium">
                  {isLoading ? (
                    <div className="h-4 w-20 rounded bg-muted animate-pulse" />
                  ) : (
                    product?.sku || "—"
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Brand:
                </span>
                <span className="text-sm font-medium">
                  {isLoading ? (
                    <div className="h-4 w-28 rounded bg-muted animate-pulse" />
                  ) : product?.brand ? (
                    <RouterLink
                      to={`/brands/${product.brand.slug}`}
                      className="text-primary hover:underline transition-colors"
                    >
                      {product.brand.name}
                    </RouterLink>
                  ) : (
                    "—"
                  )}
                </span>
              </div>
              {product?.fields && product.fields.length > 0 && (
                <>
                  <hr className="border-border my-2" />
                  {product.fields.map((field) => (
                    <div
                      key={field.id}
                      className="flex justify-between items-center py-1"
                    >
                      <span className="text-sm font-medium text-muted-foreground">
                        {field.name}:
                      </span>
                      <span className="text-sm font-medium">
                        {field.options?.prefix && (
                          <span>{field.options.prefix}</span>
                        )}
                        {field.type === "integer"
                          ? typeof field.value === "number"
                            ? field.value
                            : parseInt(field.value as string, 10)
                          : String(field.value)}
                        {field.options?.suffix && (
                          <span>{field.options.suffix}</span>
                        )}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
