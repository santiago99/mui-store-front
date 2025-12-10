import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetCollectionQuery } from "@/app/apiSlice";
import type { Product } from "@/features/product/productApi";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

export interface CollectionsCarouselProps {
  collectionSlug: string;
}

export default function CollectionsCarousel({
  collectionSlug,
}: CollectionsCarouselProps) {
  // Fixed item width - all items have the same width
  const ITEM_WIDTH = 240; // pixels
  const GAP = 16; // gap-4 = 16px

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const {
    data: products,
    isLoading,
    isError,
  } = useGetCollectionQuery(collectionSlug);

  const [showLeftButton, setShowLeftButton] = React.useState(false);
  const [showRightButton, setShowRightButton] = React.useState(true);

  const canScrollLeft = () => {
    if (!scrollContainerRef.current) return false;
    return scrollContainerRef.current.scrollLeft > 0;
  };

  const canScrollRight = () => {
    if (!scrollContainerRef.current) return false;
    const container = scrollContainerRef.current;
    return (
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateButtons = () => {
      setShowLeftButton(canScrollLeft());
      setShowRightButton(canScrollRight());
    };

    updateButtons();
    container.addEventListener("scroll", updateButtons);
    window.addEventListener("resize", updateButtons);

    return () => {
      container.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [products]);

  // Hide component on error or when no products
  if (isError || (!isLoading && (!products || products.length === 0))) {
    return null;
  }

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    // Scroll by one item width + gap
    const scrollAmount = ITEM_WIDTH + GAP;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <div className="relative">
        <div
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollSnapType: "x mandatory",
          }}
        >
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={`skeleton-${idx}`}
              className="flex-shrink-0"
              style={{
                width: `${ITEM_WIDTH}px`,
                scrollSnapAlign: "start",
              }}
            >
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Left Navigation Button */}
      {showLeftButton && (
        <Button
          variant="default"
          size="icon"
          className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 z-10 rounded-full shadow-lg"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {/* Right Navigation Button */}
      {showRightButton && (
        <Button
          variant="default"
          size="icon"
          className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 z-10 rounded-full shadow-lg"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4 [&::-webkit-scrollbar]:hidden"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          scrollSnapType: "x mandatory",
        }}
      >
        {products?.map((product: Product) => (
          <div
            key={product.id}
            className="flex-shrink-0"
            style={{
              width: `${ITEM_WIDTH}px`,
              scrollSnapAlign: "start",
            }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
