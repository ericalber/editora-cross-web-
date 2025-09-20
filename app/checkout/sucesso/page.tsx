import type { Metadata } from "next";
import { SuccessPageClient } from "./SuccessPageClient";
import { buildMetadata } from "@/lib/seo";

interface SuccessPageProps {
  searchParams?: {
    session_id?: string;
  };
}

export const metadata: Metadata = buildMetadata({
  title: "Checkout concluído",
  description: "Pedido confirmado com sucesso na Editora Cross. Confira instruções pós-compra e suporte pelo WhatsApp.",
  path: "/checkout/sucesso",
});

export default function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  return <SuccessPageClient sessionId={searchParams?.session_id} />;
}
