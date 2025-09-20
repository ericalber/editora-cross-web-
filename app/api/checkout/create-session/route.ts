import { NextResponse } from "next/server";
import { products } from "@/data/products";

interface CheckoutRequest {
  items: Array<{
    idLivro: string;
    qty?: number;
  }>;
}

const STRIPE_API_BASE = "https://api.stripe.com/v1";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as CheckoutRequest | null;
    if (!body || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ message: "Carrinho vazio ou payload inválido." }, { status: 400 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const currency = (process.env.NEXT_PUBLIC_CURRENCY ?? "usd").toLowerCase();

    if (!secretKey || !baseUrl) {
      return NextResponse.json(
        {
          message:
            "Stripe não está configurado. Defina STRIPE_SECRET_KEY e NEXT_PUBLIC_BASE_URL para habilitar o checkout.",
        },
        { status: 500 },
      );
    }

    const lineItems: Array<{ unitAmount: number; quantity: number; name: string; slug: string }> = [];
    const metadataItems: Array<{ slug: string; qty: number; unitPrice: number }> = [];

    body.items.forEach((entry) => {
      const quantity = clampQty(entry.qty ?? 1);
      if (quantity <= 0) {
        return;
      }
      const product = products.find((item) => item.id === entry.idLivro);
      if (!product) {
        throw new Error(`Produto com id ${entry.idLivro} não encontrado.`);
      }
      const finalPrice = product.desconto
        ? product.preco * (1 - product.desconto / 100)
        : product.preco;
      const unitAmount = Math.round(finalPrice * 100);
      lineItems.push({
        unitAmount,
        quantity,
        name: product.titulo,
        slug: product.slug,
      });
      metadataItems.push({ slug: product.slug, qty: quantity, unitPrice: Number(finalPrice.toFixed(2)) });
    });

    if (!lineItems.length) {
      return NextResponse.json({ message: "Nenhum item válido encontrado." }, { status: 400 });
    }

    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("success_url", `${baseUrl}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`);
    params.append("cancel_url", `${baseUrl}/checkout/cancelado`);

    lineItems.forEach((item, index) => {
      params.append(`line_items[${index}][price_data][currency]`, currency);
      params.append(`line_items[${index}][price_data][product_data][name]`, item.name);
      params.append(`line_items[${index}][price_data][product_data][metadata][slug]`, item.slug);
      params.append(`line_items[${index}][price_data][unit_amount]`, String(item.unitAmount));
      params.append(`line_items[${index}][quantity]`, String(item.quantity));
    });

    const metadataString = JSON.stringify(metadataItems).slice(0, 500);
    params.append("metadata[cart]", metadataString);

    const response = await fetch(`${STRIPE_API_BASE}/checkout/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const message =
        typeof error?.error?.message === "string"
          ? error.error.message
          : "Não foi possível criar a sessão de checkout.";
      return NextResponse.json({ message }, { status: 500 });
    }

    const session = (await response.json()) as { url?: string };

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado ao criar sessão de checkout.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

function clampQty(value: number) {
  if (!Number.isFinite(value)) {
    return 1;
  }
  return Math.max(0, Math.min(99, Math.floor(value))); // mantemos entre 0 e 99
}
