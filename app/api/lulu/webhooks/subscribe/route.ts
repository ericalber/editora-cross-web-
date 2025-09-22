import { NextResponse } from "next/server";
import { luluFetch } from "@/src/lib/lulu/client";
import { rateLimitRequest } from "@/src/lib/rate-limit";
import { createExternalId, handleLuluError, validationError } from "@/src/lib/api-utils";
import { logInfo } from "@/src/lib/logger";

const RATE_LIMIT = { limit: 10, windowMs: 60_000 };

type JsonRecord = Record<string, unknown>;

function isJsonRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  const rate = rateLimitRequest(request, "lulu-webhook-subscribe", RATE_LIMIT.limit, RATE_LIMIT.windowMs);
  if (!rate.allowed) {
    return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
  }

  const externalId = createExternalId(request.headers.get("x-external-id"));

  let rawPayload: unknown;
  try {
    rawPayload = await request.json();
  } catch {
    return validationError("JSON inválido no corpo da requisição.", externalId);
  }

  if (!isJsonRecord(rawPayload) || !isNonEmptyString(rawPayload.url)) {
    return validationError("Informe a URL de webhook (url).", externalId);
  }

  const payload = rawPayload;
  const topicsRaw = payload.topics;
  const topics = Array.isArray(topicsRaw)
    ? topicsRaw.filter((topic): topic is string => typeof topic === "string" && topic.trim().length > 0)
    : undefined;
  const body = {
    topics: topics && topics.length ? topics : ["PRINT_JOB_STATUS_CHANGED"],
    url: payload.url,
  };

  try {
    const response = await luluFetch("/webhooks/", {
      method: "POST",
      body,
      headers: {
        "X-Request-Id": externalId,
      },
      externalId,
    });

    logInfo("Assinatura de webhook Lulu criada", { external_id: externalId });

    return NextResponse.json({ external_id: externalId, data: response }, { status: 201 });
  } catch (error) {
    return handleLuluError(error, externalId);
  }
}
