"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { SectionTitle } from "@/components/SectionTitle";
import { useCart } from "@/src/commerce/CartContext";
import { WHATSAPP_CONTACT_URL } from "@/lib/constants";

interface SuccessPageClientProps {
  sessionId?: string;
}

export function SuccessPageClient({ sessionId }: SuccessPageClientProps) {
  const { clearCart } = useCart();
  const clearedRef = useRef(false);

  useEffect(() => {
    if (clearedRef.current) {
      return;
    }
    clearCart();
    clearedRef.current = true;
  }, [clearCart]);

  return (
    <main className="bg-gray-50 pb-16 pt-28">
      <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
        <SectionTitle
          title="Pagamento confirmado"
          subtitle="Obrigado por apoiar o ministério da Editora Cross."
        />
        <div className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-900">
            Recebemos seu pedido e em breve você receberá um e-mail com os detalhes da compra.
          </p>
          <p className="text-sm text-gray-500">
            Número da sessão Stripe: <span className="font-mono text-primary">{sessionId ?? "n/d"}</span>
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/livros" className="btn-primary">
              Continuar explorando livros
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
