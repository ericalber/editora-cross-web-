"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SectionTitle } from "@/components/SectionTitle";
import { ProductCard } from "@/components/ProductCard";
import {
  getBestSellers,
  getNewReleases,
  getProductCategories,
  getProducts,
} from "@/lib/store";

const allProducts = getProducts();
const categories = getProductCategories();

const specialFilters = [
  { key: "lancamentos", label: "Lançamentos", getData: () => getNewReleases(12) },
  { key: "mais-vendidos", label: "Mais vendidos", getData: () => getBestSellers(12) },
];

export default function BooksPage() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("filtro");
  const initialCategory = searchParams.get("categoria");

  const defaultFilter = specialFilters.some((item) => item.key === initialFilter)
    ? initialFilter
    : initialCategory && categories.includes(initialCategory)
      ? initialCategory
      : "todos";

  const [filter, setFilter] = useState<string>(defaultFilter ?? "todos");

  const filteredProducts = useMemo(() => {
    if (filter === "todos") {
      return allProducts;
    }
    const special = specialFilters.find((item) => item.key === filter);
    if (special) {
      return special.getData();
    }
    return allProducts.filter((product) => product.categoria === filter);
  }, [filter]);

  const filters = [
    { key: "todos", label: "Todos" },
    ...specialFilters.map(({ key, label }) => ({ key, label })),
    ...categories.map((category) => ({ key: category, label: category })),
  ];

  return (
    <main className="bg-gray-50 pb-16 pt-28">
      <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6">
        <SectionTitle
          title="Catálogo Editora Cross"
          subtitle="Filtre por categoria ou descubra nossos destaques editoriais."
        />
        <div className="flex flex-wrap items-center gap-3">
          {filters.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                filter === item.key
                  ? "border-transparent bg-primary text-white"
                  : "border-primary/30 text-primary hover:bg-primary/5"
              }`}
            >
              {item.label}
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
