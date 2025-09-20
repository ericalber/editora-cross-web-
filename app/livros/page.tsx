import type { Metadata } from "next";
import { BooksPageClient } from "./BooksPageClient";
import { getBestSellers, getNewReleases, getProductCategories, getProducts } from "@/lib/store";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Livros",
  description:
    "Explore lançamentos, best-sellers e categorias especializadas da Editora Cross com sinopses detalhadas e preços atualizados para igrejas e leitores cristãos.",
  path: "/livros",
});

export default function BooksPage() {
  const products = getProducts();
  const categories = getProductCategories();
  const newReleases = getNewReleases(12);
  const bestSellers = getBestSellers(12);

  return (
    <BooksPageClient
      products={products}
      categories={categories}
      newReleases={newReleases}
      bestSellers={bestSellers}
    />
  );
}
