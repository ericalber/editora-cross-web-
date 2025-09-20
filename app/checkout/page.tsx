import type { Metadata } from "next";
import { CheckoutPageClient } from "./CheckoutPageClient";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Checkout",
  description: "Finalize a compra de livros da Editora Cross com resumo do pedido e opções de pagamento seguro.",
  path: "/checkout",
});

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
