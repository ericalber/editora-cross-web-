"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

interface ProductsCarouselProps {
  data: Product[];
  title?: string;
  viewAllHref?: string;
}

export function ProductsCarousel({ data, title, viewAllHref }: ProductsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    const el = containerRef.current;
    if (!el) return;
    const width = el.querySelector<HTMLDivElement>("div")?.clientWidth ?? 320;
    const offset = direction === "left" ? -width * 1.2 : width * 1.2;
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  const showArrows = data.length > 1;

  return (
    <section className="relative space-y-4">
      {title || viewAllHref ? (
        <div className="flex items-end justify-between">
          {title ? <h3 className="text-xl font-semibold text-gray-900 md:text-2xl">{title}</h3> : <span />}
          {viewAllHref ? (
            <a
              href={viewAllHref}
              className="text-sm font-semibold text-primary transition hover:text-primary/80"
            >
              Ver mais
            </a>
          ) : null}
        </div>
      ) : null}

      {showArrows ? (
        <div className="pointer-events-none absolute inset-y-0 -left-3 -right-3 hidden items-center justify-between lg:flex">
          <button
            type="button"
            aria-label="Itens anteriores"
            onClick={() => handleScroll("left")}
            className="pointer-events-auto rounded-full bg-white p-3 text-primary shadow-md ring-1 ring-primary/20 transition hover:bg-primary hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Próximos itens"
            onClick={() => handleScroll("right")}
            className="pointer-events-auto rounded-full bg-white p-3 text-primary shadow-md ring-1 ring-primary/20 transition hover:bg-primary hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}

      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 pt-2 [scrollbar-width:none] [-ms-overflow-style:none]"
      >
        <style>{`div::-webkit-scrollbar{display:none}`}</style>
        {data.map((product) => (
          <div key={product.slug} className="min-w-[280px] max-w-[320px] flex-1 snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
