import ProductList from "@/features/product/components/ProductList";
import { useTranslation } from "react-i18next";

export const Frontpage = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{t("category.catalog")}</h2>
      </div>
      <ProductList pageSize={12} />
    </div>
  );
};
