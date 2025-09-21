import { NextResponse } from "next/server";
import { luluFetch } from "@/src/lib/lulu/client";
import { rateLimitRequest } from "@/src/lib/rate-limit";
import { createExternalId, handleLuluError, validationError } from "@/src/lib/api-utils";
import { logInfo } from "@/src/lib/logger";

const RATE_LIMIT = { limit: 40, windowMs: 60_000 };

export async function POST(request: Request) {
  const rate = rateLimitRequest(request, "lulu-shipping-options", RATE_LIMIT.limit, RATE_LIMIT.windowMs);
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

  let payload: any;
  try {
    payload = await request.json();
  } catch (error) {
    return validationError("JSON inválido no corpo da requisição.", externalId);
  }

  if (!payload?.line_items || !Array.isArray(payload.line_items) || payload.line_items.length === 0) {
    return validationError("Informe ao menos um item em line_items.", externalId);
  }

  if (!payload?.shipping_address) {
    return validationError("shipping_address é obrigatório.", externalId);
  }

  try {
    const response = await luluFetch("/shipping-options/", {
      method: "POST",
      body: payload,
      headers: {
        "X-Request-Id": externalId,
      },
      externalId,
    });

    logInfo("Enviada consulta de opções de envio da Lulu", { external_id: externalId });

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
