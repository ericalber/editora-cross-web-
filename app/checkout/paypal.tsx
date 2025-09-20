"use client";

import { useState } from "react";
import type { CartItem } from "@/src/commerce/CartContext";

interface PayPalToggleProps {
  items: CartItem[];
  subtotal: number;
  disabled?: boolean;
}

const hasPayPalConfig = Boolean(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);

export function PayPalToggle({ items, subtotal, disabled }: PayPalToggleProps) {
  const [pending, setPending] = useState(false);

  if (!hasPayPalConfig || !items.length) {
    return null;
  }

  const handleClick = () => {
    setPending(true);
    // Espaço reservado para integração real com PayPal.
    setTimeout(() => {
      setPending(false);
      alert(
        "Pagamento via PayPal ainda não está configurado neste ambiente. Consulte a documentação para concluir a integração.",
      );
    }, 400);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || pending}
      className="inline-flex items-center justify-center rounded-full border border-blue-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Abrindo PayPal..." : "Pagar com PayPal"}
    </button>
  );
}
