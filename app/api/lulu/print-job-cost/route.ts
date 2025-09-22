import { NextResponse } from "next/server";
import { luluFetch } from "@/src/lib/lulu/client";
import { rateLimitRequest } from "@/src/lib/rate-limit";
import { createExternalId, handleLuluError, validationError } from "@/src/lib/api-utils";
import { logInfo } from "@/src/lib/logger";

const RATE_LIMIT = { limit: 40, windowMs: 60_000 };

type JsonRecord = Record<string, unknown>;

function isJsonRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null;
}

export async function POST(request: Request) {
  const rate = rateLimitRequest(request, "lulu-print-job-cost", RATE_LIMIT.limit, RATE_LIMIT.windowMs);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error: "RATE_LIMITED",
        retry_after_ms: rate.retryAfter ?? RATE_LIMIT.windowMs,
      },
      {
        status: 429,
        headers: rate.retryAfter ? { "Retry-After": Math.ceil((rate.retryAfter ?? 0) / 1000).toString() } : undefined,
      },
    );
  }

  const externalId = createExternalId(request.headers.get("x-external-id"));

  let rawPayload: unknown;
  try {
    rawPayload = await request.json();
  } catch {
    return validationError("JSON inválido no corpo da requisição.", externalId);
  }

  if (!isJsonRecord(rawPayload)) {
    return validationError("Formato do payload inválido.", externalId);
  }

  const payload = rawPayload;
  const lineItems = payload.line_items;
  if (!Array.isArray(lineItems) || lineItems.length === 0) {
    return validationError("Informe ao menos um item em line_items.", externalId);
  }

  const shippingAddress = payload.shipping_address;
  if (!isJsonRecord(shippingAddress) || typeof shippingAddress.phone_number !== "string" || shippingAddress.phone_number.trim().length === 0) {
    return validationError("shipping_address.phone_number é obrigatório.", externalId);
  }

  if (!isJsonRecord(payload.shipping_option) && typeof payload.shipping_option !== "string") {
    return validationError("shipping_option é obrigatório.", externalId);
  }

  try {
    const response = await luluFetch("/print-job-cost-calculations/", {
      method: "POST",
      body: payload,
      headers: {
        "X-Request-Id": externalId,
      },
      externalId,
    });

    logInfo("Consulta de custo de print job enviada à Lulu", { external_id: externalId });

    return NextResponse.json(
      {
        external_id: externalId,
        data: response,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleLuluError(error, externalId);
  }
}
