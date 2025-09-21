"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "/images/hero/slide-1-clean.svg",
    title: "Conteúdo bíblico para uma igreja em movimento",
    subtitle:
      "Conheça recursos para discipulado, formação de líderes e pequenos grupos com linguagem atual e fundamento sólido.",
    ctaLabel: "Explorar catálogo",
    ctaHref: "/livros",
  },
  {
    id: 2,
    image: "/images/hero/slide-2.svg",
    title: "Autores que inspiram transformação",
    subtitle:
      "Histórias, pesquisas e ministérios que abençoam comunidades por todo o Brasil e além.",
    ctaLabel: "Conhecer autores",
    ctaHref: "/autores",
  },
  {
    id: 3,
    image: "/images/hero/slide-3.svg",
    title: "Digital, impresso e experiências imersivas",
    subtitle:
      "Lançamentos em múltiplos formatos, com curadoria editorial e suporte para sua igreja.",
    ctaLabel: "Ver lançamentos",
    ctaHref: "/livros?filtro=lancamentos",
  },
];

const transition = { duration: 0.7, ease: [0.16, 1, 0.3, 1] };

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const activeSlide = slides[activeIndex];

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gray-900 text-white shadow-2xl">
      <div className="relative h-[480px] w-full md:h-[520px]">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={activeSlide.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={transition}
          >
            <Image
              src={activeSlide.image}
              alt={activeSlide.title}
              fill
              priority={activeIndex === 0}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/20" />
          </motion.div>
        </AnimatePresence>
        <div className="relative z-10 flex h-full flex-col justify-center px-6 py-14 sm:px-12 lg:px-20">
          <motion.div
            key={`content-${activeSlide.id}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={transition}
            className="max-w-2xl space-y-6"
          >
            <span className="hero-badge inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium uppercase tracking-[0.2em] text-[#B37A22]">
              Editora Cross
            </span>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              {activeSlide.title}
            </h1>
            <p className="text-lg text-gray-100/90 md:text-xl">
              {activeSlide.subtitle}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={activeSlide.ctaHref}
                className="btn-primary"
              >
                {activeSlide.ctaLabel}
              </Link>
              <Link
                href="/noticias"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10"
              >
                Notícias
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 pb-6">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Ir para slide ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`h-2 w-10 rounded-full transition ${
              activeIndex === index
                ? "bg-white"
                : "bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
