"use client";

import * as Accordion from "@radix-ui/react-accordion";
import Image from "next/image";
import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { Product } from "@/data/products";
import { AddToCartButton } from "@/components/AddToCartButton";
import { whatsappLink } from "@/lib/store";
import { buildBookMetadata, getProductSummary } from "@/lib/product-details";

interface BookQuickViewProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookQuickView({ product, open, onOpenChange }: BookQuickViewProps) {
  const allowRender = typeof window !== "undefined";
  const [isMounted, setIsMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (allowRender) {
      setIsMounted(true);
    }
  }, [allowRender]);

  useEffect(() => {
    if (!open || !product || !allowRender) {
      return;
    }
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
        return;
      }
      if (event.key === "Tab") {
        const focusable = getFocusable(panelRef.current);
        if (focusable.length === 0) {
          event.preventDefault();
          panelRef.current?.focus();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        if (event.shiftKey) {
          if (active === first || !panelRef.current?.contains(active)) {
            event.preventDefault();
            last.focus();
          }
        } else if (active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const frame = requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(frame);
      previousFocusRef.current?.focus();
    };
  }, [open, onOpenChange, product, allowRender]);

  const handleOverlayClick = () => {
    onOpenChange(false);
  };

  const handlePanelClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const content = useMemo(() => {
    if (!product) {
      return null;
    }
    return (
      <div className="book-quickview-overlay" role="presentation" onClick={handleOverlayClick}>
        <div
          ref={panelRef}
          className="book-quickview-panel surface-premium-panel--side"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`book-quickview-title-${product.slug}`}
          aria-describedby={`book-quickview-${product.slug}`}
          tabIndex={-1}
          onClick={handlePanelClick}
        >
          <header className="book-quickview-header">
            <h2 className="book-quickview-title" id={`book-quickview-title-${product.slug}`}>
              {product.titulo}
            </h2>
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Fechar painel"
              className="book-quickview-close"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="book-quickview-body">
            <div className="book-quickview-media">
              <div className="book-quickview-cover">
                <Image
                  src={product.capa}
                  alt={`Capa do livro ${product.titulo}`}
                  fill
                  sizes="(max-width: 768px) 60vw, 280px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div className="book-quickview-content" id={`book-quickview-${product.slug}`}>
              <p className="book-quickview-subtitle">{product.subtitulo}</p>
              <p className="book-quickview-sinopse">{product.sinopse}</p>

              <div className="book-quickview-meta">
                {buildBookMetadata(product).map((item) => (
                  <div key={item.label} className="book-quickview-meta-item">
                    <span className="book-quickview-meta-label">{item.label}</span>
                    <span className="book-quickview-meta-value">{item.value}</span>
                  </div>
                ))}
              </div>

              <Accordion.Root type="single" collapsible className="book-quickview-accordion">
                <Accordion.Item value="sumario">
                  <Accordion.Trigger className="book-quickview-accordion-trigger">
                    Sumário / Índice
                  </Accordion.Trigger>
                  <Accordion.Content className="book-quickview-accordion-content">
                    {renderSummary(product)}
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>

              <div className="book-quickview-cta">
                <AddToCartButton
                  bookSlug={product.slug}
                  redirectToCart
                  className="flex-1"
                />
                <a
                  href={whatsappLink(product.titulo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="book-quickview-whatsapp book-quickview-whatsapp-btn text-sm font-semibold uppercase tracking-wide"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [onOpenChange, product]);

  if (!isMounted || !open || !product) {
    return null;
  }

  return allowRender ? createPortal(content, document.body) : null;
}

function getFocusable(root: HTMLElement | null) {
  if (!root) {
    return [] as HTMLElement[];
  }
  const selectors = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ];
  return Array.from(root.querySelectorAll<HTMLElement>(selectors.join(","))).filter(
    (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"),
  );
}

function renderSummary(product: Product) {
  const summary = getProductSummary(product);
  if (!summary) {
    return <p className="book-quickview-accordion-empty">Sumário disponível em breve.</p>;
  }
  return (
    <ul className="book-quickview-accordion-list">
      {summary.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
