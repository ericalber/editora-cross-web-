"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { getAuthorById, whatsappLink } from "@/lib/store";
import { AddToCartButton } from "@/components/AddToCartButton";
import { UI_FLAGS } from "@/src/ui/ui.flags";

interface ProductCardProps {
  product: Product;
  onOpenQuickView?: (product: Product) => void;
}

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function ProductCard({ product, onOpenQuickView }: ProductCardProps) {
  const author = getAuthorById(product.autorId);
  const hasDiscount = typeof product.desconto === "number" && product.desconto > 0;
  const finalPrice = hasDiscount
    ? product.preco * (1 - product.desconto! / 100)
    : product.preco;
  const enableQuickView = UI_FLAGS.bookQuickView && typeof onOpenQuickView === "function";
  const motionClasses = UI_FLAGS.microInteractions
    ? "transition-transform duration-150 ease-out hover:-translate-y-1 hover:shadow-xl active:scale-[0.97]"
    : "transition hover:-translate-y-1 hover:shadow-xl";

  return (
    <article
      className={`glass-card group flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 ${motionClasses}`}
    >
      <button
        type="button"
        onClick={enableQuickView ? () => onOpenQuickView?.(product) : undefined}
        onKeyDown={(event) => {
          if (!enableQuickView) {
            return;
          }
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpenQuickView?.(product);
          }
        }}
        className="book-card-trigger"
        aria-label={`Expandir informações do livro ${product.titulo}`}
      >
        <div className="relative h-64 w-full overflow-hidden rounded-[1.75rem]">
          <Image
            src={product.capa}
            alt={`Capa do livro ${product.titulo}`}
            fill
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 320px"
            loading="lazy"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          {hasDiscount ? (
            <span className="absolute left-4 top-4 rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              -{product.desconto}%
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6 text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            {product.categoria}
          </span>
          <h3 className="line-clamp-2 text-xl font-semibold text-foreground">
            {product.titulo}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.subtitulo}</p>
          {author ? (
            <span className="text-sm font-medium text-primary">
              {author.nome}
            </span>
          ) : null}
        </div>
      </button>
      <div className="flex flex-1 flex-col gap-3 border-t border-border/70 bg-card/70 p-6 backdrop-blur-sm">
        <div className="mt-auto space-y-1">
          {hasDiscount ? (
            <span className="text-xs text-muted-foreground line-through">
              {currency.format(product.preco)}
            </span>
          ) : null}
          <p className="text-lg font-semibold text-primary">
            {currency.format(finalPrice)}
          </p>
        </div>
        <div className="flex flex-col gap-3 pt-2" data-card-action>
          <div className="flex flex-col gap-3 sm:flex-row" data-card-action>
            <div data-card-action>
              <AddToCartButton
                bookSlug={product.slug}
                redirectToCart
                className="flex-1"
              />
            </div>
            <a
              href={whatsappLink(product.titulo)}
              target="_blank"
              rel="noopener noreferrer"
              className="book-card-whatsapp book-card-whatsapp-btn text-sm font-semibold uppercase tracking-wide"
              data-card-action
            >
              Falar no WhatsApp
            </a>
          </div>
          <Link
            href={`/livros/${product.slug}`}
            className="book-card-link"
            data-card-action
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </article>
  );
}
