import type { Metadata } from "next";
import { CartPageClient } from "./CartPageClient";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Carrinho",
  description: "Revise os livros selecionados antes de seguir para o checkout seguro da Editora Cross.",
  path: "/carrinho",
});

export default function CartPage() {
  return <CartPageClient />;
}
