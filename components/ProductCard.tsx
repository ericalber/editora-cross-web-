import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { getAuthorBySlug, whatsappLink } from "@/lib/store";

interface ProductCardProps {
  product: Product;
}

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function ProductCard({ product }: ProductCardProps) {
  const author = getAuthorBySlug(product.autorSlug);
  const hasDiscount = typeof product.desconto === "number" && product.desconto > 0;
  const finalPrice = hasDiscount
    ? product.preco * (1 - product.desconto! / 100)
    : product.preco;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/livros/${product.slug}`} className="relative block h-64 w-full overflow-hidden">
        <Image
          src={product.cover}
          alt={product.titulo}
          fill
          sizes="(max-width: 768px) 80vw, 320px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {hasDiscount ? (
          <span className="absolute left-4 top-4 rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            -{product.desconto}%
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
          {product.categoria}
        </span>
        <h3 className="line-clamp-2 text-xl font-semibold text-gray-900">
          {product.titulo}
        </h3>
        {author ? (
          <Link
            href={`/autores/${author.slug}`}
            className="text-sm font-medium text-primary transition hover:text-primary/80"
          >
            {author.nome}
          </Link>
        ) : null}
        <div className="mt-auto space-y-1">
          {hasDiscount ? (
            <span className="text-xs text-gray-400 line-through">
              {currency.format(product.preco)}
            </span>
          ) : null}
          <p className="text-lg font-semibold text-primary">
            {currency.format(finalPrice)}
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <Link
            href={`/livros/${product.slug}`}
            className="flex-1 rounded-full border border-primary px-4 py-2 text-center text-sm font-semibold text-primary transition hover:bg-primary/10"
          >
            Detalhes
          </Link>
          <a
            href={whatsappLink(product.titulo)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Comprar
          </a>
        </div>
      </div>
    </article>
  );
}
