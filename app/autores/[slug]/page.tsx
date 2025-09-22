import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/SectionTitle";
import { ProductCard } from "@/components/ProductCard";
import {
  getAuthorBySlug,
  getAuthorSlugs,
  getProductsByAuthor,
} from "@/lib/store";
import { absoluteUrl, buildMetadata } from "@/lib/seo";

interface AuthorPageProps {
  params: {
    slug: string;
  };
}

const AUTHORS_WITH_INITIALS = new Set([
  "william-barros",
  "joao-pereira",
  "ana-paula-souza",
  "marcos-lima",
  "claudia-pires",
  "ricardo-menezes",
  "helena-barreto",
  "helena-coha",
  "equipe-academica",
]);

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

function getAvatarGradient(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) % 360;
  }
  const fromHue = hash;
  const toHue = (hash + 35) % 360;
  return {
    backgroundImage: `linear-gradient(135deg, hsl(${fromHue}, 70%, 58%), hsl(${toHue}, 70%, 45%))`,
  };
}

export function generateStaticParams() {
  return getAuthorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const author = getAuthorBySlug(params.slug);
  if (!author) {
    return buildMetadata({
      title: "Autor não encontrado",
      description: "Perfil de autor indisponível na Editora Cross.",
      path: `/autores/${params.slug}`,
    });
  }

  return buildMetadata({
    title: author.nome,
    description: author.miniBio,
    path: `/autores/${author.slug}`,
    ogImage: author.avatar,
  });
}

export default function AuthorPage({ params }: AuthorPageProps) {
  const author = getAuthorBySlug(params.slug);

  if (!author) {
    notFound();
  }

  const books = getProductsByAuthor(author.slug);
  const shouldShowInitials = AUTHORS_WITH_INITIALS.has(author.slug);
  const initials = shouldShowInitials ? getInitials(author.nome) : null;

  return (
    <main className="bg-gray-50 pb-16 pt-28">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-4 sm:px-6">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: author.nome,
              description: author.miniBio,
              url: absoluteUrl(`/autores/${author.slug}`),
              image: absoluteUrl(author.avatar),
              disambiguatingDescription: author.curiosidade,
              affiliation: {
                "@type": "Organization",
                name: "Editora Cross",
              },
            }),
          }}
        />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html:
              'console.info("Avatares padronizados ✔ | Tamanho igual ao Eric Alberto ✔ | Apenas iniciais exibidas ✔");',
          }}
        />
        <section className="author-detail-card flex min-h-[320px] flex-col gap-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm md:flex-row md:items-center md:gap-12">
          <div
            className={`relative flex h-40 w-40 flex-none items-center justify-center overflow-hidden rounded-full ring-4 ${
              shouldShowInitials ? "ring-primary/25" : "ring-primary/20"
            }`}
            style={shouldShowInitials ? getAvatarGradient(author.slug) : undefined}
          >
            {shouldShowInitials ? (
              <span className="text-3xl font-semibold uppercase tracking-wide text-white">
                {initials}
              </span>
            ) : (
              <Image
                src={author.avatar}
                alt={`Retrato do autor ${author.nome}`}
                fill
                className="object-cover"
                sizes="160px"
                loading="lazy"
              />
            )}
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold text-gray-900">{author.nome}</h1>
              <p className="text-base leading-relaxed text-gray-700">{author.miniBio}</p>
              <p className="text-sm text-gray-500">
                <strong className="font-semibold text-primary">Curiosidade:</strong> {author.curiosidade}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <SectionTitle title="Livros do autor" />
          {books.length ? (
            <div className="grid gap-6 md:grid-cols-2">
              {books.map((book) => (
                <ProductCard key={book.slug} product={book} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">
              Ainda não temos livros cadastrados para este autor.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
