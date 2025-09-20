import Image from "next/image";
import Link from "next/link";
import type { News } from "@/data/news";

interface NewsGridProps {
  posts: News[];
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
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={item.capa}
              alt={`Ilustração da notícia ${item.titulo}`}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 45vw, 320px"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              {item.tags[0] ?? "notícia"}
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-3 p-6">
            <time
              dateTime={item.dataISO}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary"
            >
              {formatDate(item.dataISO)}
            </time>
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary">
              {item.titulo}
            </h3>
            <p className="text-sm text-gray-600">{item.resumo}</p>
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
