"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/src/commerce/CartContext";

export function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/carrinho"
      className="relative inline-flex items-center justify-center rounded-full border border-primary/30 p-3 text-primary transition hover:bg-primary/10"
      aria-label="Abrir carrinho"
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex min-h-[1.25rem] min-w-[1.25rem] items-center justify-center rounded-full bg-secondary px-1 text-[0.65rem] font-bold text-white">
          {totalItems}
        </span>
      ) : null}
    </Link>
  );
}
