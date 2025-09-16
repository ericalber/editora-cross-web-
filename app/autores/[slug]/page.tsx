import Image from "next/image";
import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/SectionTitle";
import { ProductCard } from "@/components/ProductCard";
import {
  getAuthorBySlug,
  getAuthorSlugs,
  getProductsByAuthor,
} from "@/lib/store";

interface AuthorPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return getAuthorSlugs().map((slug) => ({ slug }));
}

export default function AuthorPage({ params }: AuthorPageProps) {
  const author = getAuthorBySlug(params.slug);

  if (!author) {
    notFound();
  }

  const books = getProductsByAuthor(author.slug);

  return (
    <main className="bg-gray-50 pb-16 pt-28">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-4 sm:px-6">
        <section className="flex flex-col gap-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm md:flex-row md:items-center">
          <div className="relative h-40 w-40 overflow-hidden rounded-full ring-4 ring-primary/20">
            <Image src={author.avatar} alt={author.nome} fill className="object-cover" />
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold text-gray-900">{author.nome}</h1>
              <p className="text-base leading-relaxed text-gray-700">{author.bio}</p>
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
