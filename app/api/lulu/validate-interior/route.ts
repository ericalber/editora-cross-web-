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
  const rate = rateLimitRequest(request, "lulu-validate-interior", RATE_LIMIT.limit, RATE_LIMIT.windowMs);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "RATE_LIMITED", retry_after_ms: rate.retryAfter ?? RATE_LIMIT.windowMs },
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

  if (!isJsonRecord(rawPayload) || typeof rawPayload.source_url !== "string" || rawPayload.source_url.trim().length === 0) {
    return validationError("source_url é obrigatório para validação de interior.", externalId);
  }

  const payload = rawPayload;

  try {
    const response = await luluFetch("/validate-interior/", {
      method: "POST",
      body: payload,
      headers: {
        "X-Request-Id": externalId,
      },
      externalId,
    });

    logInfo("Validação de interior solicitada", { external_id: externalId });

    return NextResponse.json({ external_id: externalId, data: response }, { status: 202 });
  } catch (error) {
    return handleLuluError(error, externalId);
  }
}
