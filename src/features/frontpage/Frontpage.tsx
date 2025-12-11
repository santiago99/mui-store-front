import CollectionsCarousel from "@/features/product/components/CollectionsCarousel";
import { useTranslation } from "react-i18next";

export const Frontpage = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full">
      {/* Hero Block */}
      <section className="relative w-full overflow-hidden">
        <div className="relative h-[60vh] min-h-[400px] w-full">
          <img
            src="/assets/hero-image.png"
            alt={t("frontpage.heroImageAlt", "Premium Electronics Store")}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center text-white">
              <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
                {t("frontpage.heroTitle", "Discover Premium Electronics")}
              </h1>
              <p className="mx-auto max-w-2xl text-lg md:text-xl">
                {t(
                  "frontpage.heroSubtitle",
                  "Explore our curated selection of the latest technology and accessories"
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Sections */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-12">
          <section>
            <h2 className="mb-6 text-2xl font-semibold">
              {t("frontpage.newProducts", "New products")}
            </h2>
            <CollectionsCarousel collectionSlug="new" />
          </section>
          <section>
            <h2 className="mb-6 text-2xl font-semibold">
              {t("frontpage.featuredProducts", "Featured products")}
            </h2>
            <CollectionsCarousel collectionSlug="featured" />
          </section>
        </div>
      </div>
    </div>
  );
};
