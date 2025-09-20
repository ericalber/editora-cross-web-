"use client";

import Image from "next/image";
import Link from "next/link";
import { SectionTitle } from "@/components/SectionTitle";
import { useCart } from "@/src/commerce/CartContext";
import { WHATSAPP_CONTACT_URL } from "@/lib/constants";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function CartPageClient() {
  const { items, subtotal, totalItems, setQty, removeItem, isHydrated } = useCart();

  const isEmpty = isHydrated && items.length === 0;

  return (
    <main className="bg-gray-50 pb-16 pt-28">
      <div className="mx-auto max-w-5xl space-y-10 px-4 sm:px-6">
        <SectionTitle
          title="Carrinho"
          subtitle={totalItems ? `${totalItems} ${totalItems === 1 ? "item" : "itens"} selecionados` : undefined}
        />

        {!isHydrated ? (
          <p className="text-sm text-gray-500">Carregando itens do carrinho...</p>
        ) : null}

        {isEmpty ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center">
            <p className="text-lg font-semibold text-gray-800">Seu carrinho está vazio.</p>
            <p className="text-sm text-gray-500">
              Que tal conhecer nossos lançamentos e montar uma lista cheia de esperança?
            </p>
            <Link
              href="/livros"
              className="btn-primary"
            >
              Descobrir livros
            </Link>
          </div>
        ) : null}

        {items.length ? (
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.idLivro}
                  className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  <div className="relative h-28 w-24 overflow-hidden rounded-2xl border border-gray-100">
                    <Image
                      src={item.capa}
                      alt={`Capa do livro ${item.titulo}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3">
                    <div className="space-y-1">
                      <Link
                        href={`/livros/${item.slug}`}
                        className="text-base font-semibold text-gray-900 hover:text-primary"
                      >
                        {item.titulo}
                      </Link>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                        {item.categoria}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1">
                        <button
                          type="button"
                          onClick={() => setQty(item.idLivro, item.qty - 1)}
                          aria-label="Diminuir quantidade"
                          className="rounded-full p-1 text-sm font-bold text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
                          disabled={item.qty <= 1}
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-gray-700">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(item.idLivro, item.qty + 1)}
                          aria-label="Aumentar quantidade"
                          className="rounded-full p-1 text-sm font-bold text-primary transition hover:bg-primary/10"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.idLivro)}
                        className="text-sm font-semibold text-gray-400 transition hover:text-primary"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                  <div className="text-right sm:w-28">
                    <p className="text-sm text-gray-400">{currency.format(item.unitPrice)}</p>
                    <p className="text-lg font-semibold text-primary">
                      {currency.format(item.unitPrice * item.qty)}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <aside className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Resumo</h2>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="text-base font-semibold text-primary">
                  {currency.format(subtotal)}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Frete e impostos serão definidos no checkout seguro da Stripe.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/checkout"
                  className="btn-primary text-center"
                >
                  Finalizar compra
                </Link>
                <a
                  href={WHATSAPP_CONTACT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-primary px-6 py-3 text-center text-sm font-semibold uppercase tracking-wide text-primary transition hover:bg-primary/10"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </aside>
          </div>
        ) : null}
      </div>
    </main>
  );
}
