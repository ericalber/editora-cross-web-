import { NextResponse } from "next/server";
import { luluFetch } from "@/src/lib/lulu/client";
import { rateLimitRequest } from "@/src/lib/rate-limit";
import { createExternalId, handleLuluError, validationError } from "@/src/lib/api-utils";
import { logInfo } from "@/src/lib/logger";

const RATE_LIMIT = { limit: 10, windowMs: 60_000 };

export async function POST(request: Request) {
  const rate = rateLimitRequest(request, "lulu-webhook-subscribe", RATE_LIMIT.limit, RATE_LIMIT.windowMs);
  if (!rate.allowed) {
    return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
  }

  const externalId = createExternalId(request.headers.get("x-external-id"));

  let payload: any;
  try {
    payload = await request.json();
  } catch (error) {
    return validationError("JSON inválido no corpo da requisição.", externalId);
  }

  if (!payload?.url) {
    return validationError("Informe a URL de webhook (url).", externalId);
  }

  const body = {
    topics: payload.topics ?? ["PRINT_JOB_STATUS_CHANGED"],
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
