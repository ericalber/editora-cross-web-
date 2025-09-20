"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Author } from "@/data/authors";

interface AuthorCarouselProps {
  autores: Author[];
}

export function AuthorCarousel({ autores }: AuthorCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const offset = direction === "left" ? -220 : 220;
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  const showArrows = autores.length > 1;

  return (
    <section className="relative space-y-4">
      {showArrows ? (
        <div className="pointer-events-none absolute inset-y-0 -left-2 -right-2 hidden items-center justify-between lg:flex">
          <button
            type="button"
            aria-label="Autores anteriores"
            onClick={() => scroll("left")}
            className="pointer-events-auto rounded-full bg-white p-2 text-primary shadow-md ring-1 ring-primary/20 transition hover:bg-primary hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Próximos autores"
            onClick={() => scroll("right")}
            className="pointer-events-auto rounded-full bg-white p-2 text-primary shadow-md ring-1 ring-primary/20 transition hover:bg-primary hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pt-2 [scrollbar-width:none] [-ms-overflow-style:none]"
      >
        <style>{`div::-webkit-scrollbar{display:none}`}</style>
        {autores.map((autor) => (
          <Link
            key={autor.slug}
            href={`/autores/${autor.slug}`}
            className="flex w-[140px] snap-start flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="relative block h-20 w-20 overflow-hidden rounded-full ring-2 ring-primary/20">
              <Image
                src={autor.avatar}
                alt={`Retrato do autor ${autor.nome}`}
                fill
                sizes="80px"
                className="object-cover"
                loading="lazy"
              />
            </span>
            <span className="text-sm font-semibold text-gray-900">{autor.nome}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
