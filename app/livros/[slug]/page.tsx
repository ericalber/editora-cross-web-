import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/SectionTitle";
import { ProductCard } from "@/components/ProductCard";
import {
  getAuthorBySlug,
  getProductBySlug,
  getProductSlugs,
  getProducts,
  whatsappLink,
} from "@/lib/store";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return getProductSlugs().map((slug) => ({ slug }));
}

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const author = getAuthorBySlug(product.autorSlug);
  const gallery = product.imagens.length ? product.imagens : [product.cover];
  const related = getProducts()
    .filter((item) => item.slug !== product.slug && item.categoria === product.categoria)
    .slice(0, 8);

  const hasDiscount = typeof product.desconto === "number" && product.desconto > 0;
  const finalPrice = hasDiscount
    ? product.preco * (1 - product.desconto! / 100)
    : product.preco;

  return (
    <main className="bg-gray-50 pb-16 pt-28">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <div className="relative h-[420px] overflow-hidden rounded-3xl border border-gray-200 bg-white">
              <Image
                src={gallery[0]}
                alt={product.titulo}
                fill
                className="object-cover"
              />
            </div>
            {gallery.length > 1 ? (
              <div className="grid grid-cols-4 gap-3">
                {gallery.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative h-24 overflow-hidden rounded-2xl border border-gray-200"
                  >
                    <Image src={image} alt={product.titulo} fill className="object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                {product.categoria}
              </span>
              <h1 className="text-3xl font-semibold text-gray-900">
                {product.titulo}
              </h1>
              {author ? (
                <Link
                  href={`/autores/${author.slug}`}
                  className="text-sm font-semibold text-primary transition hover:text-primary/80"
                >
                  {author.nome}
                </Link>
              ) : null}
            </div>

            <div className="space-y-1">
              {hasDiscount ? (
                <span className="text-sm text-gray-400 line-through">
                  {currency.format(product.preco)}
                </span>
              ) : null}
              <p className="text-3xl font-semibold text-primary">
                {currency.format(finalPrice)}
              </p>
              <p className="text-sm text-gray-500">
                ISBN {product.isbn} • {product.paginas} páginas
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Sinopse
              </h2>
              <p className="text-base leading-relaxed text-gray-700">
                {product.sinopse}
              </p>
            </div>

            {product.tags?.length ? (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-secondary">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-secondary/15 px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink(product.titulo)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1 text-center text-sm font-semibold uppercase tracking-wide"
              >
                Comprar via WhatsApp
              </a>
              <Link
                href="/contato"
                className="flex-1 rounded-full border border-primary px-6 py-3 text-center text-sm font-semibold uppercase tracking-wide text-primary transition hover:bg-primary/10"
              >
                Falar com consultor
              </Link>
            </div>
          </div>
        </div>

        {related.length ? (
          <section className="space-y-6">
            <SectionTitle title="Relacionados" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
