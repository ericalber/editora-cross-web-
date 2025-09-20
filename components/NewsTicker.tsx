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

const ITEM_HEIGHT = 48; // px (equiv. to h-12)

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

  const handleFocusWithin = () => setPaused(true);
  const handleBlurWithin = () => setPaused(false);

  return (
    <aside className="news-ticker" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="news-ticker-header">Últimas notícias</div>
      <div
        className="news-ticker-viewport"
        onFocusCapture={handleFocusWithin}
        onBlurCapture={handleBlurWithin}
      >
        <div
          className="news-ticker-track"
          style={{ transform: `translateY(-${index * ITEM_HEIGHT}px)` }}
          aria-live="polite"
        >
          {safeItems.map((item) => (
            <Link
              key={item.slug}
              href={`/noticias/${item.slug}`}
              className="news-ticker-item"
            >
              <span className="news-ticker-bullet" aria-hidden="true">
                •
              </span>
              <span className="news-ticker-text">{item.titulo}</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
