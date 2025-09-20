"use client";

import Link from "next/link";
import { SectionTitle } from "@/components/SectionTitle";
import { useCart } from "@/src/commerce/CartContext";
import { WHATSAPP_CONTACT_URL } from "@/lib/constants";

export default function CheckoutCanceledPage() {
  const { totalItems } = useCart();

  return (
    <main className="bg-gray-50 pb-16 pt-28">
      <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
        <SectionTitle
          title="Pagamento não concluído"
          subtitle="Suas escolhas continuam reservadas no carrinho."
        />
        <div className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-900">
            {totalItems
              ? `Você ainda tem ${totalItems} ${totalItems === 1 ? "item" : "itens"} aguardando.`
              : "Nenhum item encontrado no carrinho."}
          </p>
          <p className="text-sm text-gray-500">
            Se precisar de ajuda, nossa equipe está disponível para tirar dúvidas sobre o processo de compra.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/carrinho" className="btn-primary">
              Retornar ao carrinho
            </Link>
            <a
              href={WHATSAPP_CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary transition hover:bg-primary/10"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
