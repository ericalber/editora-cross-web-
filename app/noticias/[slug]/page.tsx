import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/SectionTitle";
import { NewsGrid } from "@/components/NewsGrid";
import { getNews, getNewsBySlug, getNewsSlugs } from "@/lib/store";

interface NewsDetailPageProps {
  params: {
    slug: string;
  };
}

function formatDate(dateISO: string) {
  return new Date(dateISO).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function generateStaticParams() {
  return getNewsSlugs().map((slug) => ({ slug }));
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const article = getNewsBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const related = getNews()
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);

  return (
    <main className="bg-gray-50 pb-16 pt-28">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-4 sm:px-6">
        <Link href="/noticias" className="text-sm font-semibold text-primary">
          ← Ver todas as notícias
        </Link>
        <article className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              {article.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
            <h1 className="text-4xl font-semibold text-gray-900">{article.titulo}</h1>
            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
              <span>{formatDate(article.dataISO)}</span>
            </div>
          </div>
          <div className="relative h-[420px] overflow-hidden rounded-3xl border border-gray-200">
            <Image src={article.capa} alt={article.titulo} fill className="object-cover" />
          </div>
          <div className="space-y-4 text-base leading-relaxed text-gray-700">
            {article.conteudo ? (
              <div dangerouslySetInnerHTML={{ __html: article.conteudo }} />
            ) : (
              <p>Em breve adicionaremos o conteúdo completo desta notícia.</p>
            )}
          </div>
        </article>

        {related.length ? (
          <section className="space-y-6">
            <SectionTitle title="Leia também" viewAllHref="/noticias" />
            <NewsGrid posts={related} />
          </section>
        ) : null}
      </div>
    </main>
  );
}
