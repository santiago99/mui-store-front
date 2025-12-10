import CollectionsCarousel from "@/features/product/components/CollectionsCarousel";

export const Frontpage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-12">
        <section>
          <h2 className="mb-6 text-2xl font-semibold">New products</h2>
          <CollectionsCarousel collectionSlug="new" />
        </section>
        <section>
          <h2 className="mb-6 text-2xl font-semibold">Featured products</h2>
          <CollectionsCarousel collectionSlug="featured" />
        </section>
      </div>
    </div>
  );
};
