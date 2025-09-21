import Image from "next/image";
import Link from "next/link";
import type { News } from "@/data/news";
import { UI_FLAGS } from "@/src/ui/ui.flags";

interface NewsGridProps {
  posts: News[];
}

const TAG_LABELS: Record<string, string> = {
  educacao: "Educação",
  educação: "Educação",
  lancamentos: "Lançamentos",
  lançamentos: "Lançamentos",
};

function formatTagLabel(tag?: string) {
  if (!tag) {
    return "Notícia";
  }
  const normalized = tag.toLowerCase();
  return TAG_LABELS[normalized] ?? tag;
}

function formatDate(dateISO: string) {
  return new Date(dateISO).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });
}

export function NewsGrid({ posts }: NewsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((item) => (
        <article
          key={item.slug}
          className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"
        >
            <div className="news-card-media">
              <Image
                src={item.capa}
                alt={`Ilustração da notícia ${item.titulo}`}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 45vw, 320px"
                loading="lazy"
              />
              <div className="news-card-media-overlay" aria-hidden="true" />
              {UI_FLAGS.newsCardTopOnlyPill && item.tags[0] ? (
                <div className="card-top-area">
                  <span className="pill-category">{formatTagLabel(item.tags[0])}</span>
                </div>
              ) : null}
            </div>

          <div className="flex flex-1 flex-col gap-3 p-6">
            <time
              dateTime={item.dataISO}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary"
            >
              {formatDate(item.dataISO)}
            </time>
            <h3 className="news-card-title text-xl font-semibold text-gray-900 group-hover:text-primary">
              {item.titulo}
            </h3>
            <p className="news-card-excerpt text-sm text-gray-600">{item.resumo}</p>
            <div className="mt-auto pt-2">
              <Link
                href={`/noticias/${item.slug}`}
                className="inline-flex items-center text-sm font-semibold text-primary transition hover:text-primary/80"
              >
                Ler mais →
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
