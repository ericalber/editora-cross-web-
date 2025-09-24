import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

const MONTH_ABBR = [
  "Jan.",
  "Fev.",
  "Mar.",
  "Abr.",
  "Mai.",
  "Jun.",
  "Jul.",
  "Ago.",
  "Set.",
  "Out.",
  "Nov.",
  "Dez.",
];


function formatDate(dateISO: string) {
  const date = new Date(dateISO);
  const day = String(date.getDate()).padStart(2, '0');
  const month = MONTH_ABBR[date.getMonth()] ?? '';
  return `${day} ${month}`.trim();
}

const CARD_VARIANTS: Record<string, string> = {
  eventos: 'news-card--azure',
  lideranca: 'news-card--azure',
  midia: 'news-card--azure',
  mercado: 'news-card--azure',
  tecnologia: 'news-card--azure',
  familia: 'news-card--amber',
  lancamentos: 'news-card--amber',
  referencia: 'news-card--amber',
  premios: 'news-card--amber',
  educacao: 'news-card--emerald',
  formacao: 'news-card--emerald',
  missoes: 'news-card--emerald',
  discipulado: 'news-card--emerald',
  comunidade: 'news-card--emerald',
  leitura: 'news-card--emerald',
};

function resolveVariant(tag?: string) {
  if (!tag) {
    return "news-card--neutral";
  }
  const normalized = tag.toLowerCase();
  return CARD_VARIANTS[normalized] ?? "news-card--neutral";
}

export function NewsGrid({ posts }: NewsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((item) => {
        const primaryTag = item.tags[0];
        const supportingTags = item.tags.slice(0, 2);

        return (
          <article
            key={item.slug}
            className={
              "news-card " +
              resolveVariant(primaryTag) +
              " " +
              (UI_FLAGS.microInteractions
                ? "group transition-transform duration-150 ease-out hover:-translate-y-1 hover:shadow-lg active:scale-[0.97]"
                : "group transition hover:-translate-y-1 hover:shadow-lg")
            }
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
              {UI_FLAGS.newsCardTopOnlyPill && primaryTag ? (
                <div className="card-top-area">
                  <span className="pill-category">{formatTagLabel(primaryTag)}</span>
                </div>
              ) : null}
            </div>

            <div className="news-card-body">
              <div className="news-card-header">
                <span className="news-card-badge">{formatTagLabel(primaryTag)}</span>
                <time dateTime={item.dataISO}>{formatDate(item.dataISO)}</time>
              </div>

              <div className="news-card-title-wrapper">
                <h3 className="news-card-title text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                  {item.titulo}
                </h3>
              </div>

              <p className="news-card-excerpt text-sm text-muted-foreground">{item.resumo}</p>

              <div className="news-card-footer">
                <div className="news-card-meta">
                  {supportingTags.map((tag) => (
                    <span key={tag} className="news-card-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
                <Link href={`/noticias/${item.slug}`} className="news-card-cta">
                  <span>Ler mais</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
