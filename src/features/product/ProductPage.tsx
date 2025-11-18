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
    <div className="container mx-auto py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <Card className="overflow-hidden">
            <img
              src={
                product?.imageUrl && product.imageUrl.length > 0
                  ? product.imageUrl
                  : "/assets/no-photo.jpeg"
              }
              alt={product?.title || "Product image"}
              className="w-full h-[300px] md:h-[500px] object-cover"
            />
          </Card>
        </div>

        {/* Product Details and Add to Cart */}
        <div>
          <div className="flex flex-col gap-6">
            {/* Product Title */}
            <div>
              {/* Brand Name */}
              {isLoading ? (
                <div className="h-4 w-24 rounded bg-muted animate-pulse mb-2" />
              ) : product?.brand ? (
                <RouterLink
                  to={`/brands/${product.brand.slug}`}
                  className="text-sm text-muted-foreground font-medium hover:text-primary hover:underline block mb-2"
                >
                  {product.brand.name}
                </RouterLink>
              ) : null}
              <h1 className="text-3xl font-semibold mb-4">
                {isLoading ? (
                  <div className="h-12 w-full rounded bg-muted animate-pulse" />
                ) : (
                  product?.title
                )}
              </h1>

              {/* Category Chip */}
              {/* {product?.category && (
                <Chip
                  label={product.category.name}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
              )} */}
            </div>

            {/* Price */}
            <div>
              <h2 className="text-4xl font-bold text-primary">
                {isLoading ? (
                  <div className="h-12 w-48 rounded bg-muted animate-pulse" />
                ) : product?.price ? (
                  formatPriceRub(product.price)
                ) : (
                  ""
                )}
              </h2>
            </div>

            <hr className="border-border" />

            {/* Add to Cart Form */}
            <AddToCartForm product={product} isLoading={isLoading} />
          </div>
        </div>
      </div>

      {/* Product Description and Properties - Full Width */}
      <div className="mt-8">
        <div className="flex flex-col gap-6">
          {/* Product Description */}
          {(!isLoading && product?.description) || isLoading ? (
            <Card className="border">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">
                  {t("common.description")}
                </h3>
                <div className="text-base text-muted-foreground">
                  {isLoading ? (
                    <div className="h-16 w-full rounded bg-muted animate-pulse" />
                  ) : (
                    product?.description || ""
                  )}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* Additional Information */}
          <Card className="border">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">
                {t("product.additionalInformation")}
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">SKU:</span>
                  <span className="text-sm">
                    {isLoading ? (
                      <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                    ) : (
                      product?.sku || "—"
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Brand:</span>
                  <span className="text-sm">
                    {isLoading ? (
                      <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                    ) : product?.brand ? (
                      <RouterLink
                        to={`/brands/${product.brand.slug}`}
                        className="text-primary hover:underline"
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
                    <hr className="border-border" />
                    {product.fields.map((field) => (
                      <div
                        key={field.id}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-muted-foreground">
                          {field.name}:
                        </span>
                        <span className="text-sm">
                          {field.type === "integer"
                            ? typeof field.value === "number"
                              ? field.value
                              : parseInt(field.value as string, 10)
                            : String(field.value)}
                        </span>
                      </div>
                    ))}
                  </>
                )}
                {/* <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Category:</span>
                  <span className="text-sm">
                    {isLoading ? (
                      <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                    ) : (
                      product?.category?.name || "N/A"
                    )}
                  </span>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
