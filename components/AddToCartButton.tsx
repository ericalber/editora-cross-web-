"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useCart } from "@/src/commerce/CartContext";

interface AddToCartButtonProps {
  bookSlug: string;
  quantity?: number;
  redirectToCart?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function AddToCartButton({
  bookSlug,
  quantity = 1,
  redirectToCart = false,
  className,
  children = "Comprar agora",
}: AddToCartButtonProps) {
  const { addItem, isHydrated } = useCart();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [adding, setAdding] = useState(false);

  const disabled = !isHydrated || pending || adding;

  const handleClick = () => {
    if (disabled) {
      return;
    }
    setAdding(true);
    try {
      addItem(bookSlug, quantity);
      if (redirectToCart) {
        startTransition(() => {
          router.push("/carrinho");
        });
      }
    } finally {
      setTimeout(() => setAdding(false), 250);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/40",
        className,
      )}
    >
      {children}
    </button>
  );
}
