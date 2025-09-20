"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionTitle } from "@/components/SectionTitle";
import { useCart } from "@/src/commerce/CartContext";
import { WHATSAPP_CONTACT_URL } from "@/lib/constants";
import { PayPalToggle } from "./paypal";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function CheckoutPageClient() {
  const { items, subtotal, isHydrated } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEmpty = isHydrated && items.length === 0;

  const handleStripeCheckout = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            idLivro: item.idLivro,
            qty: item.qty,
          })),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ message: "Falha ao iniciar checkout." }));
        throw new Error(payload.message ?? "Falha ao iniciar checkout.");
      }

      const session = await response.json();
      if (session?.url) {
        window.location.href = session.url as string;
        return;
      }
      throw new Error("URL de checkout não retornada pela API.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível abrir o checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gray-50 pb-16 pt-28">
      <div className="mx-auto max-w-4xl space-y-10 px-4 sm:px-6">
        <SectionTitle
          title="Checkout"
          subtitle="Revise seus itens e escolha a forma de pagamento."
        />

        {!isHydrated ? (
          <p className="text-sm text-gray-500">Carregando seu carrinho...</p>
        ) : null}

        {isEmpty ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center">
            <p className="text-lg font-semibold text-gray-800">Você ainda não adicionou livros ao carrinho.</p>
            <Link href="/livros" className="btn-primary mt-4 inline-flex">
              Voltar ao catálogo
            </Link>
          </div>
        ) : null}

        {items.length ? (
          <div className="space-y-6">
            <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Resumo do pedido</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.idLivro} className="flex items-center gap-4">
                    <div className="relative h-20 w-16 overflow-hidden rounded-2xl border border-gray-100">
                      <Image
                        src={item.capa}
                        alt={`Capa do livro ${item.titulo}`}
                        fill
                        sizes="64px"
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{item.titulo}</p>
                      <p className="text-xs text-gray-500">
                        {item.categoria} • {item.qty} {item.qty === 1 ? "unidade" : "unidades"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">
                        {currency.format(item.unitPrice * item.qty)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
                <span className="font-semibold text-gray-500">Subtotal</span>
                <span className="text-lg font-semibold text-primary">{currency.format(subtotal)}</span>
              </div>
              <p className="text-xs text-gray-400">
                Ao continuar, você será direcionado ao checkout seguro da Stripe. Os dados de pagamento não são
                armazenados pela Editora Cross.
              </p>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleStripeCheckout}
                disabled={loading}
                className="btn-primary inline-flex items-center justify-center"
              >
                {loading ? "Redirecionando..." : "Pagar com Stripe"}
              </button>
              <PayPalToggle items={items} subtotal={subtotal} disabled={loading} />
              <a
                href={WHATSAPP_CONTACT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-primary px-6 py-3 text-center text-sm font-semibold uppercase tracking-wide text-primary transition hover:bg-primary/10"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
