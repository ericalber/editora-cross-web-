import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

const ordersDir = path.join(process.cwd(), "data", "orders");

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature") ?? request.headers.get("Stripe-Signature");

  if (!webhookSecret) {
    return NextResponse.json({ message: "Webhook Stripe não configurado." }, { status: 500 });
  }

  const payload = await request.text();

  if (!signature || !verifyStripeSignature(payload, signature, webhookSecret)) {
    return NextResponse.json({ message: "Assinatura inválida." }, { status: 400 });
  }

  let event: StripeCheckoutEvent;
  try {
    event = JSON.parse(payload) as StripeCheckoutEvent;
  } catch (error) {
    return NextResponse.json({ message: "Payload inválido." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    try {
      const record = buildOrderRecord(session);
      fs.mkdirSync(ordersDir, { recursive: true });
      const filePath = path.join(ordersDir, `${record.id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(record, null, 2), "utf8");
    } catch (error) {
      console.error("Falha ao registrar pedido:", error);
      return NextResponse.json({ message: "Falha ao registrar pedido." }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

function verifyStripeSignature(payload: string, signatureHeader: string, secret: string) {
  const parts = signatureHeader.split(",").reduce<Record<string, string>>((acc, part) => {
    const [key, value] = part.split("=");
    if (key && value) {
      acc[key] = value;
    }
    return acc;
  }, {});

  const timestamp = parts["t"];
  const signature = parts["v1"];

  if (!timestamp || !signature) {
    return false;
  }

  const expectedPayload = `${timestamp}.${payload}`;
  const computed = crypto.createHmac("sha256", secret).update(expectedPayload).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(signature, "hex"));
  } catch {
    return false;
  }
}

function buildOrderRecord(session: StripeSession) {
  const items = parseMetadata(session.metadata?.cart);
  const amountTotal = typeof session.amount_total === "number" ? session.amount_total / 100 : 0;

  return {
    id: crypto.randomUUID(),
    when: new Date().toISOString(),
    provider: "stripe" as const,
    status: "paid" as const,
    currency: session.currency ?? "usd",
    amount: Number(amountTotal.toFixed(2)),
    items,
    rawSessionId: session.id,
  };
}

function parseMetadata(metadata?: string | null) {
  if (!metadata) {
    return [] as Array<{ slug: string; qty: number; unitPrice: number }>;
  }
  try {
    const parsed = JSON.parse(metadata);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => {
          if (!item || typeof item !== "object") {
            return null;
          }
          const slug = typeof (item as any).slug === "string" ? (item as any).slug : null;
          const qty = typeof (item as any).qty === "number" ? (item as any).qty : null;
          const unitPrice = typeof (item as any).unitPrice === "number" ? (item as any).unitPrice : null;
          if (!slug || !qty || !unitPrice) {
            return null;
          }
          return { slug, qty, unitPrice };
        })
        .filter(Boolean) as Array<{ slug: string; qty: number; unitPrice: number }>;
    }
  } catch (error) {
    console.warn("Não foi possível interpretar metadata do carrinho", error);
  }
  return [] as Array<{ slug: string; qty: number; unitPrice: number }>;
}

type StripeSession = {
  id: string;
  amount_total?: number | null;
  currency?: string | null;
  metadata?: {
    cart?: string | null;
    [key: string]: string | null | undefined;
  } | null;
};

type StripeCheckoutEvent = {
  id: string;
  type: string;
  data: {
    object: StripeSession;
  };
};
