"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SectionTitle } from "@/components/SectionTitle";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/data/products";

interface BooksPageClientProps {
  products: Product[];
  categories: string[];
  newReleases: Product[];
  bestSellers: Product[];
}

export function BooksPageClient({ products, categories, newReleases, bestSellers }: BooksPageClientProps) {
  const searchParams = useSearchParams();
  const initialFilterParam = searchParams.get("filtro");
  const initialCategory = searchParams.get("categoria");

  const availableFilters = useMemo(() => {
    const base = new Map<string, Product[]>([["todos", products]]);
    base.set("lancamentos", newReleases);
    base.set("mais-vendidos", bestSellers);
    categories.forEach((category) => {
      base.set(
        category,
        products.filter((product) => product.categoria === category),
      );
    });
    return base;
  }, [products, categories, newReleases, bestSellers]);

  const defaultFilter = (() => {
    if (initialFilterParam && availableFilters.has(initialFilterParam)) {
      return initialFilterParam;
    }
    if (initialCategory && availableFilters.has(initialCategory)) {
      return initialCategory;
    }
    return "todos";
  })();

  const [filter, setFilter] = useState(defaultFilter);

  const filteredProducts = availableFilters.get(filter) ?? products;

  return (
    <main className="bg-gray-50 pb-16 pt-28">
      <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6">
        <SectionTitle
          title="Catálogo Editora Cross"
          subtitle="Filtre por categoria ou descubra nossos destaques editoriais."
        />
        <div className="flex flex-wrap items-center gap-3">
          {Array.from(availableFilters.keys()).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                filter === key
                  ? "border-transparent bg-primary text-white"
                  : "border-primary/30 text-primary hover:bg-primary/5"
              }`}
            >
              {labelForFilter(key)}
            </button>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}

function labelForFilter(key: string) {
  switch (key) {
    case "todos":
      return "Todos";
    case "lancamentos":
      return "Lançamentos";
    case "mais-vendidos":
      return "Mais vendidos";
    default:
      return key;
  }
}
