"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export type NewsTickerItem = {
  slug: string;
  titulo: string;
};

interface NewsTickerProps {
  items: NewsTickerItem[];
}

export function NewsTicker({ items }: NewsTickerProps) {
  const safeItems = useMemo(() => (items.length ? items : []), [items]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!safeItems.length || paused) {
      return;
    }
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % safeItems.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [safeItems.length, paused]);

  useEffect(() => {
    if (index >= safeItems.length) {
      setIndex(0);
    }
  }, [index, safeItems.length]);

  return (
    <aside
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="bg-primary px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white">
        Últimas notícias
      </div>
      <div className="relative h-40">
        <div
          className="absolute inset-0 flex flex-col gap-3 px-4 py-4 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateY(-${index * 3}rem)` }}
        >
          {safeItems.map((item) => (
            <Link
              key={item.slug}
              href={`/noticias/${item.slug}`}
              className="flex h-12 items-center rounded-lg px-3 text-sm font-medium text-gray-800 transition hover:bg-primary/5 hover:text-primary"
            >
              • {item.titulo}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
